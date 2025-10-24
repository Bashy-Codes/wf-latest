import { mutation, query, internalMutation } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { internal } from "../_generated/api";
import { createNotification } from "../notifications";
import { areFriends, calculateAge } from "../helpers";
import { r2 } from "../storage";


/**
 * Internal mutation to deliver a letter
 */
export const deliverLetter = internalMutation({
  args: { letterId: v.id("letters") },
  handler: async (ctx, args) => {
    const letter = await ctx.db.get(args.letterId);
    if (!letter) return;

    await ctx.db.patch(args.letterId, { status: "delivered" });
  },
});

/**
 * Schedule a new letter
 */
export const scheduleLetter = mutation({
  args: {
    recipientId: v.id("users"),
    title: v.string(),
    content: v.string(),
    daysUntilDelivery: v.number(),
  },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    if (args.title.trim().length === 0) {
      throw new Error("Title is required");
    }
    if (args.title.trim().length > 100) {
      throw new Error("Title must be 100 characters or less");
    }
    if (args.content.trim().length < 100) {
      throw new Error("Content must be at least 100 characters");
    }
    if (args.content.trim().length > 2000) {
      throw new Error("Content must be 2000 characters or less");
    }
    if (args.daysUntilDelivery < 1 || args.daysUntilDelivery > 30) {
      throw new Error("Delivery must be between 1 and 30 days from now");
    }

    const recipient = await ctx.db.get(args.recipientId);
    if (!recipient) throw new Error("Recipient not found");

    const friendship = await areFriends(ctx, currentUserId, args.recipientId);
    if (!friendship) {
      throw new Error("You can only send letters to friends");
    }

    const letterId = await ctx.db.insert("letters", {
      senderId: currentUserId,
      recipientId: args.recipientId,
      title: args.title.trim(),
      content: args.content.trim(),
      status: "pending",
    });

    const deliveryTime = Date.now() + (args.daysUntilDelivery * 24 * 60 * 60 * 1000);
    const scheduledFunctionId = await ctx.scheduler.runAt(
      deliveryTime,
      internal.communications.letters.deliverLetter,
      { letterId }
    );

    await ctx.db.patch(letterId, { scheduledFunctionId });

    await createNotification(
      ctx,
      args.recipientId,
      currentUserId,
      "letter_scheduled"
    );

    return { success: true, letterId };
  },
});


/**
 * Get received letters for the current user (only delivered letters)
 */
export const getUserReceivedLetters = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const result = await ctx.db
      .query("letters")
      .withIndex("by_recipient_status", (q) =>
        q.eq("recipientId", currentUserId).eq("status", "delivered")
      )
      .order("desc")
      .paginate(args.paginationOpts);

    const enrichedLetters = await Promise.all(
      result.page.map(async (letter) => {
        const sender = await ctx.db.get(letter.senderId);
        if (!sender) throw new Error("Sender not found");

        const senderProfilePictureUrl = await r2.getUrl(sender.profilePicture);

        return {
          letterId: letter._id,
          senderId: letter.senderId,
          recipientId: letter.recipientId,
          title: letter.title,
          content: letter.content,
          createdAt: letter._creationTime,
          status: letter.status,
          sender: {
            userId: sender._id,
            name: sender.name,
            profilePicture: senderProfilePictureUrl,
            gender: sender.gender,
            age: calculateAge(sender.birthDate),
            country: sender.country,
            activeBadge: sender.activeBadge
          },
        };
      })
    );

    return {
      ...result,
      page: enrichedLetters,
    };
  },
});

/**
 * Get sent letters for the current user (all letters)
 */
export const getUserSentLetters = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const result = await ctx.db
      .query("letters")
      .withIndex("by_sender", (q) => q.eq("senderId", currentUserId))
      .order("desc")
      .paginate(args.paginationOpts);

    const enrichedLetters = await Promise.all(
      result.page.map(async (letter) => {
        const recipient = await ctx.db.get(letter.recipientId);
        if (!recipient) throw new Error("Recipient not found");

        const recipientProfilePictureUrl = await r2.getUrl(recipient.profilePicture);

        return {
          letterId: letter._id,
          senderId: letter.senderId,
          recipientId: letter.recipientId,
          title: letter.title,
          content: letter.content,
          createdAt: letter._creationTime,
          status: letter.status,
          recipient: {
            userId: recipient._id,
            name: recipient.name,
            profilePicture: recipientProfilePictureUrl,
            gender: recipient.gender,
            age: calculateAge(recipient.birthDate),
            country: recipient.country,
            activeBadge: recipient.activeBadge,
          },
        };
      })
    );

    return {
      ...result,
      page: enrichedLetters,
    };
  },
});

/**
 * Get a specific letter by ID
 */
export const getLetter = query({
  args: { letterId: v.id("letters") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const letter = await ctx.db.get(args.letterId);
    if (!letter) throw new Error("Letter not found");

    if (letter.senderId !== currentUserId && letter.recipientId !== currentUserId) {
      throw new Error("Not authorized to view this letter");
    }

    if (letter.recipientId === currentUserId && letter.status === "pending") {
      throw new Error("Letter not yet delivered");
    }

    const isSender = letter.senderId === currentUserId;
    const relevantUserId = isSender ? letter.recipientId : letter.senderId;
    const relevantUser = await ctx.db.get(relevantUserId);

    if (!relevantUser) throw new Error("User data not found");

    return {
      letterId: letter._id,
      title: letter.title,
      content: letter.content,
      createdAt: letter._creationTime,
      isSender,
      status: letter.status,
      otherUser: {
        name: relevantUser.name,
        country: relevantUser.country,
      },
    };
  },
});


/**
 * Delete a letter (sender can delete anytime, recipient can delete delivered letters)
 */
export const deleteLetter = mutation({
  args: { letterId: v.id("letters") },
  handler: async (ctx, args) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) throw new Error("Not authenticated");

    const letter = await ctx.db.get(args.letterId);
    if (!letter) throw new Error("Letter not found");

    const isSender = letter.senderId === currentUserId;
    const isRecipient = letter.recipientId === currentUserId;

    if (!isSender && !isRecipient) {
      throw new Error("Not authorized to delete this letter");
    }

    if (isRecipient && letter.status === "pending") {
      throw new Error("Cannot delete undelivered letters");
    }

    if (isSender && letter.status === "pending" && letter.scheduledFunctionId) {
      await ctx.scheduler.cancel(letter.scheduledFunctionId);
    }

    await ctx.db.delete(args.letterId);

    return { success: true };
  },
});
