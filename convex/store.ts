import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";

export const purchaseProduct = mutation({
  args: {
    productId: v.string(),
  },
  handler: async (ctx, { productId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const existingProduct = await ctx.db
      .query("userProducts")
      .withIndex("by_userId_productId", (q) =>
        q.eq("userId", userId).eq("productId", productId)
      )
      .first();

    if (existingProduct) {
      await ctx.db.patch(existingProduct._id, {
        quantity: existingProduct.quantity + 1,
      });
    } else {
      await ctx.db.insert("userProducts", {
        userId,
        productId,
        quantity: 1,
      });
    }

    return { success: true };
  },
});

export const sendGift = mutation({
  args: {
    receiverId: v.id("users"),
    productId: v.string(),
  },
  handler: async (ctx, { receiverId, productId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const userProduct = await ctx.db
      .query("userProducts")
      .withIndex("by_userId_productId", (q) =>
        q.eq("userId", userId).eq("productId", productId)
      )
      .first();

    if (!userProduct) {
      throw new Error("Product not found in user's inventory");
    }

    if (userProduct.quantity < 1) {
      throw new Error("Insufficient quantity");
    }

    if (userProduct.quantity === 1) {
      await ctx.db.delete(userProduct._id);
    } else {
      await ctx.db.patch(userProduct._id, {
        quantity: userProduct.quantity - 1,
      });
    }

    await ctx.db.insert("userGifts", {
      senderId: userId,
      receiverId,
      productId,
    });

    return { success: true };
  },
});

export const getUserProducts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const results = await ctx.db
      .query("userProducts")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .order("desc")
      .paginate(paginationOpts);

    return results;
  },
});

export const getUserReceivedGifts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const results = await ctx.db
      .query("userGifts")
      .withIndex("by_receiver", (q) => q.eq("receiverId", userId))
      .order("desc")
      .paginate(paginationOpts);

    const giftsWithSender = await Promise.all(
      results.page.map(async (gift) => {
        const sender = await ctx.db.get(gift.senderId);
        if (!sender) {
          return null;
        }

        return {
          giftId: gift._id,
          createdAt: gift._creationTime,
          productId: gift.productId,
          senderInfo: {
            name: sender.name,
            country: sender.country,
          },
        };
      })
    );

    return {
      page: giftsWithSender.filter((gift) => gift !== null),
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    };
  },
});

export const getUserSentGifts = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const results = await ctx.db
      .query("userGifts")
      .withIndex("by_sender", (q) => q.eq("senderId", userId))
      .order("desc")
      .paginate(paginationOpts);

    const giftsWithReceiver = await Promise.all(
      results.page.map(async (gift) => {
        const receiver = await ctx.db.get(gift.receiverId);
        if (!receiver) {
          return null;
        }

        return {
          giftId: gift._id,
          createdAt: gift._creationTime,
          productId: gift.productId,
          receiverInfo: {
            name: receiver.name,
            country: receiver.country,
          },
        };
      })
    );

    return {
      page: giftsWithReceiver.filter((gift) => gift !== null),
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    };
  },
});

export const getUserProfileGifts = query({
  args: {
    userId: v.id("users"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { userId, paginationOpts }) => {
    const currentUserId = await getAuthUserId(ctx);
    if (!currentUserId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const friendship = await ctx.db
      .query("friendships")
      .withIndex("by_both", (q) =>
        q.eq("userId", currentUserId).eq("friendId", userId)
      )
      .first();

    if (!friendship && currentUserId !== userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const results = await ctx.db
      .query("userGifts")
      .withIndex("by_receiver", (q) => q.eq("receiverId", userId))
      .order("desc")
      .paginate(paginationOpts);

    const giftsWithSender = await Promise.all(
      results.page.map(async (gift) => {
        const sender = await ctx.db.get(gift.senderId);
        if (!sender) {
          return null;
        }

        return {
          giftId: gift._id,
          createdAt: gift._creationTime,
          productId: gift.productId,
          senderInfo: {
            name: sender.name,
            country: sender.country,
          },
        };
      })
    );

    return {
      page: giftsWithSender.filter((gift) => gift !== null),
      isDone: results.isDone,
      continueCursor: results.continueCursor,
    };
  },
});
