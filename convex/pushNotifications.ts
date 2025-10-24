import { mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { components } from "./_generated/api";
import { Id } from "./_generated/dataModel";

const pushNotifications = components.pushNotifications;

export const recordPushToken = mutation({
  args: {
    pushToken: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await pushNotifications.recordToken(ctx, {
      userId,
      pushToken: args.pushToken,
    });

    return { success: true };
  },
});

export const removePushToken = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    await pushNotifications.pauseNotifications(ctx, {
      userId,
    });

    return { success: true };
  },
});

export async function sendPushNotification(
  ctx: any,
  userId: Id<"users">,
  notification: {
    title: string;
    body: string;
    data?: Record<string, any>;
  }
) {
  try {
    await pushNotifications.sendPushNotification(ctx, {
      userId,
      notification: {
        title: notification.title,
        body: notification.body,
        data: notification.data,
      },
    });
  } catch (error) {
    console.error("Failed to send push notification:", error);
  }
}
