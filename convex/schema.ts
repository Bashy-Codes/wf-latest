import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

const userManagementTables = {
  users: defineTable({
    // Required Convex Auth fields
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),

    userName: v.string(),
    name: v.string(),
    profilePicture: v.string(),
    gender: v.union(v.literal("male"), v.literal("female"), v.literal("other")),
    birthDate: v.string(),
    country: v.string(),
    isAdmin: v.boolean(),
    activeBadge: v.optional(v.string()),
  })
    .index("by_userName", ["userName"])
    .index("by_country_gender", ["country", "gender"]),

  profiles: defineTable({
    userId: v.id("users"),
    aboutMe: v.string(),
    spokenLanguages: v.array(v.string()),
    learningLanguages: v.array(v.string()),
    hobbies: v.array(v.string()),
  }).index("by_userId", ["userId"]),

  userInformation: defineTable({
    userId: v.id("users"),
    genderPreference: v.boolean(),
    ageGroup: v.union(v.literal("13-17"), v.literal("18-100")),
    lastActive: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_ageGroup_lastActive", ["ageGroup", "lastActive"])
    .index("by_ageGroup_genderPreference_lastActive", [
      "ageGroup",
      "genderPreference",
      "lastActive",
    ]),

  blockedUsers: defineTable({
    blockerUserId: v.id("users"),
    blockedUserId: v.id("users"),
  })
    .index("by_blocker", ["blockerUserId"])
    .index("by_blocked", ["blockedUserId"])
    .index("by_both", ["blockerUserId", "blockedUserId"]),
};

/*
 * Tables for the friendships
**/

const friendshipsTables = {
  friendRequests: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    requestMessage: v.string(),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"])
    .index("by_both", ["senderId", "receiverId"]),

  friendships: defineTable({
    userId: v.id("users"),
    friendId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_friend", ["friendId"])
    .index("by_both", ["userId", "friendId"]),
};

/*
 * Tables for Feed
**/

const feedTables = {
  posts: defineTable({
    userId: v.id("users"),
    collectionId: v.optional(v.id("collections")),
    content: v.string(),
    images: v.optional(v.array(v.string())),
    commentsCount: v.number(),
    reactionsCount: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_collectionId", ["collectionId"]),

  comments: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    content: v.string(),
    replyParentId: v.optional(v.id("comments")),
  })
    .index("by_userId", ["userId"])
    .index("by_postId", ["postId"])
    .index("by_replyParent", ["replyParentId"]),

  reactions: defineTable({
    userId: v.id("users"),
    postId: v.id("posts"),
    emoji: v.string(),
  })
    .index("by_userId", ["userId"])
    .index("by_postId", ["postId"])
    .index("by_userId_postId", ["userId", "postId"]),

  collections: defineTable({
    userId: v.id("users"),
    title: v.string(),
    postsCount: v.number(),
  }).index("by_userId", ["userId"]),
};

/*
 * Tables for Conversations
**/

const conversationsTables = {
  conversations: defineTable({
    userId: v.id("users"), // The user who "owns" this conversation record
    otherUserId: v.id("users"), // The other participant
    conversationGroupId: v.string(), // Shared identifier for both conversation records
    lastMessageId: v.optional(v.id("messages")),
    lastMessageTime: v.number(),
    hasUnreadMessages: v.boolean(),
  })
    .index("by_both", ["userId", "otherUserId"])
    .index("by_user_lastMessageTime", ["userId", "lastMessageTime"])
    .index("by_conversationGroupId", ["conversationGroupId"]),

  messages: defineTable({
    conversationGroupId: v.string(),
    senderId: v.id("users"),
    content: v.optional(v.string()),
    type: v.union(v.literal("text"), v.literal("image")),
    imageId: v.optional(v.id("_storage")),
    replyParentId: v.optional(v.id("messages")),
  })
    .index("by_conversationGroup", ["conversationGroupId"]),
};

/*
 * Tables for Letters
**/

const lettersTables = {
  letters: defineTable({
    senderId: v.id("users"),
    recipientId: v.id("users"),
    title: v.string(),
    content: v.string(),
    deliverAt: v.number(), // Unix timestamp for when the letter should be delivered
  })
    .index("by_sender", ["senderId"])
    .index("by_recipient", ["recipientId"])
    .index("by_recipient_deliverAt", ["recipientId", "deliverAt"])
    .index("by_sender_deliverAt", ["senderId", "deliverAt"])
    .index("by_deliverAt", ["deliverAt"]),
};

/*
 * Tables for Communities
**/

const communitiesTables = {
  communities: defineTable({
    adminId: v.id("users"),
    title: v.string(),
    description: v.string(),
    rules: v.array(v.string()),
    ageGroup: v.union(v.literal("13-17"), v.literal("18-100")),
    gender: v.union(v.literal("all"), v.literal("male"), v.literal("female"), v.literal("other")),
    language: v.string(),
    banner: v.optional(v.id("_storage")),
  }).index("by_adminId", ["adminId"]),

  communityMembers: defineTable({
    communityId: v.id("communities"),
    userId: v.id("users"),
    status: v.union(v.literal("pending"), v.literal("approved")),
    requestMessage: v.optional(v.string()),
  })
    .index("by_communityId", ["communityId"])
    .index("by_userId", ["userId"])
    .index("by_communityId_userId", ["communityId", "userId"])
    .index("by_communityId_status", ["communityId", "status"]),

  discussions: defineTable({
    communityId: v.id("communities"),
    userId: v.id("users"),
    title: v.string(),
    content: v.string(),
    imageUrl: v.optional(v.string()),
    repliesCount: v.number(),
  })
    .index("by_communityId", ["communityId"])
    .index("by_userId", ["userId"]),

  discussionThreads: defineTable({
    userId: v.id("users"),
    discussionId: v.id("discussions"),
    parentId: v.optional(v.id("discussionThreads")),
    content: v.string(),
  })
    .index("by_discussionId", ["discussionId"])
    .index("by_userId", ["userId"])
    .index("by_parentId", ["parentId"]),
};

/*
 * Tables for Store
**/

const storeTables = {
  userProducts: defineTable({
    userId: v.id("users"),
    productId: v.string(),
    quantity: v.number(),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_productId", ["userId", "productId"]),

  userGifts: defineTable({
    senderId: v.id("users"),
    receiverId: v.id("users"),
    productId: v.string(),
  })
    .index("by_sender", ["senderId"])
    .index("by_receiver", ["receiverId"]),
};

/*
 * Tables for Notifications
**/

const notifications = {
  notifications: defineTable({
    recipientId: v.id("users"),
    senderId: v.id("users"),
    type: v.union(
      v.literal("friend_request_sent"),
      v.literal("friend_request_accepted"),
      v.literal("friend_request_rejected"),
      v.literal("friend_removed"),
      v.literal("conversation_deleted"),
      v.literal("user_blocked"),
      v.literal("post_reaction"),
      v.literal("post_commented"),
      v.literal("comment_replied"),
      v.literal("letter_scheduled"),
    ),
    hasUnread: v.boolean(),
  })
    .index("by_recipient", ["recipientId"])
    .index("by_recipient_unread", ["recipientId", "hasUnread"]),
};


/*
 * Tables for Moderations
**/

const moderationTables = {
  reports: defineTable({
    reporterId: v.id("users"),
    reportType: v.union(
      v.literal("harassment"),
      v.literal("hate_speech"),
      v.literal("inappropriate_content"),
      v.literal("spam"),
      v.literal("other"),
    ),
    reportReason: v.string(),
    attachment: v.id("_storage"),

    targetType: v.union(v.literal("user"), v.literal("post")),
    targetUserId: v.optional(v.id("users")),
    targetPostId: v.optional(v.id("posts")),
  })
    .index("by_reporter", ["reporterId"])
    .index("by_targetType", ["targetType"])
    .index("by_targetUser", ["targetUserId"])
    .index("by_reporter_targetUser", ["reporterId", "targetUserId"])
    .index("by_reporter_targetPost", ["reporterId", "targetPostId"]),
};


const schema = defineSchema({
  ...authTables,
  ...userManagementTables,
  ...friendshipsTables,
  ...feedTables,
  ...conversationsTables,
  ...moderationTables,
  ...lettersTables,
  ...communitiesTables,
  ...storeTables,
  ...notifications
});

export default schema;
