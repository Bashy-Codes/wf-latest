import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { paginationOptsValidator } from "convex/server";
import { r2 } from "../storage";

export const getCommunity = query({
  args: {
    communityId: v.id("communities"),
  },
  handler: async (ctx, { communityId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const community = await ctx.db.get(communityId);
    if (!community) return null;

    // Check if user is a member
    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", userId)
      )
      .first();

    const isMember = membership && membership.status === "approved";

    // Get admin info
    const admin = await ctx.db.get(community.adminId);
    if (!admin) throw new Error("Community admin not found");

    return {
      communityId: community._id,
      title: community.title,
      description: community.description,
      rules: community.rules,
      ageGroup: community.ageGroup,
      gender: community.gender,
      communityAdmin: {
        adminId: admin._id,
        name: admin.name,
        profilePicture: admin.profilePicture ? await r2.getUrl(admin.profilePicture) : null,
      },
      isAdmin: community.adminId === userId,
      isMember,
      createdAt: community._creationTime,
    };
  },
});

export const getCommunityInfo = query({
  args: {
    communityId: v.id("communities"),
  },
  handler: async (ctx, { communityId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;

    const community = await ctx.db.get(communityId);
    if (!community) return null;

    // Check if user is a member
    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", userId)
      )
      .first();

    const isMember = membership && membership.status === "approved";
    const hasPendingRequest = membership && membership.status === "pending";

    // Get admin info
    const admin = await ctx.db.get(community.adminId);
    if (!admin) throw new Error("Community admin not found");

    // Get banner URL if exists
    let bannerUrl = null;
    if (community.banner) {
      bannerUrl = await ctx.storage.getUrl(community.banner);
    }

    return {
      communityId: community._id,
      title: community.title,
      description: community.description,
      rules: community.rules,
      ageGroup: community.ageGroup,
      gender: community.gender,
      communityAdmin: {
        adminId: admin._id,
        name: admin.name,
        profilePicture: admin.profilePicture ? await r2.getUrl(admin.profilePicture) : null,
      },
      isAdmin: community.adminId === userId,
      isMember,
      hasPendingRequest,
      bannerUrl,
      createdAt: community._creationTime,
    };
  },
});

export const createCommunity = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    rules: v.array(v.string()),
    genderOption: v.union(v.literal("all"), v.literal("my_gender")),
    banner: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { title, description, rules, genderOption, banner }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const userInfo = await ctx.db
      .query("userInformation")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!userInfo) {
      throw new Error("User information not found");
    }

    const gender = genderOption === "all" ? "all" : user.gender;

    const communityId = await ctx.db.insert("communities", {
      adminId: userId,
      title,
      description,
      rules,
      ageGroup: userInfo.ageGroup,
      gender,
      banner,
    });

    // Auto-join the admin as approved member
    await ctx.db.insert("communityMembers", {
      communityId,
      userId,
      status: "approved",
    });

    return communityId;
  },
});

export const getJoinedCommunities = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const memberships = await ctx.db
      .query("communityMembers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .filter((q) => q.eq(q.field("status"), "approved"))
      .collect();

    const communityIds = memberships.map((m) => m.communityId);

    const communities = await Promise.all(
      communityIds.map(async (id) => {
        const community = await ctx.db.get(id);
        if (!community) return null;

        // Get banner URL if exists
        let bannerUrl = null;
        if (community.banner) {
          bannerUrl = await ctx.storage.getUrl(community.banner);
        }

        return {
          communityId: community._id,
          title: community.title,
          description: community.description,
          rules: community.rules,
          ageGroup: community.ageGroup,
          gender: community.gender,
          bannerUrl,
          createdAt: community._creationTime,
        };
      })
    );

    const validCommunities = communities.filter((c) => c !== null);

    return {
      page: validCommunities,
      isDone: true,
      continueCursor: "",
    };
  },
});

export const getDiscoverCommunities = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const user = await ctx.db.get(userId);
    const userInfo = await ctx.db
      .query("userInformation")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .first();

    if (!user || !userInfo) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    // Get user's joined communities
    const memberships = await ctx.db
      .query("communityMembers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect();

    const joinedCommunityIds = new Set(memberships.map((m) => m.communityId));

    // Get communities that match user's age group and gender preferences
    const allCommunities = await ctx.db.query("communities").collect();

    const eligibleCommunities = await Promise.all(
      allCommunities
        .filter((community) => {
          // Skip already joined communities
          if (joinedCommunityIds.has(community._id)) {
            return false;
          }

          // Check age group match
          if (community.ageGroup !== userInfo.ageGroup) {
            return false;
          }

          // Check gender match
          if (community.gender !== "all" && community.gender !== user.gender) {
            return false;
          }

          return true;
        })
        .map(async (community) => {
          // Get banner URL if exists
          let bannerUrl = null;
          if (community.banner) {
            bannerUrl = await ctx.storage.getUrl(community.banner);
          }

          return {
            communityId: community._id,
            title: community.title,
            description: community.description,
            rules: community.rules,
            ageGroup: community.ageGroup,
            gender: community.gender,
            bannerUrl,
            createdAt: community._creationTime,
          };
        })
    );

    return {
      page: eligibleCommunities,
      isDone: true,
      continueCursor: "",
    };
  },
});

export const joinCommunity = mutation({
  args: {
    communityId: v.id("communities"),
    requestMessage: v.optional(v.string()),
  },
  handler: async (ctx, { communityId, requestMessage }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const existingMembership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", userId)
      )
      .first();

    if (existingMembership) {
      throw new Error("Already a member or request pending");
    }

    await ctx.db.insert("communityMembers", {
      communityId,
      userId,
      status: "pending",
      requestMessage,
    });

    return { success: true };
  },
});

export const updateCommunity = mutation({
  args: {
    communityId: v.id("communities"),
    title: v.string(),
    description: v.string(),
    rules: v.array(v.string()),
  },
  handler: async (ctx, { communityId, title, description, rules }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const community = await ctx.db.get(communityId);
    if (!community) {
      throw new Error("Community not found");
    }

    if (community.adminId !== userId) {
      throw new Error("Only admin can update community");
    }

    await ctx.db.patch(communityId, {
      title,
      description,
      rules,
    });

    return { success: true };
  },
});

export const deleteCommunity = mutation({
  args: {
    communityId: v.id("communities"),
  },
  handler: async (ctx, { communityId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) {
      throw new Error("User not authenticated");
    }

    const community = await ctx.db.get(communityId);
    if (!community) {
      throw new Error("Community not found");
    }

    if (community.adminId !== userId) {
      throw new Error("Only admin can delete community");
    }

    // Delete all related data
    const members = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId", (q) => q.eq("communityId", communityId))
      .collect();

    const discussions = await ctx.db
      .query("discussions")
      .withIndex("by_communityId", (q) => q.eq("communityId", communityId))
      .collect();

    // Delete discussion threads
    for (const discussion of discussions) {
      const threads = await ctx.db
        .query("discussionThreads")
        .withIndex("by_discussionId", (q) => q.eq("discussionId", discussion._id))
        .collect();

      for (const thread of threads) {
        await ctx.db.delete(thread._id);
      }
      await ctx.db.delete(discussion._id);
    }

    // Delete members
    for (const member of members) {
      await ctx.db.delete(member._id);
    }

    // Delete community
    await ctx.db.delete(communityId);

    return { success: true };
  },
});

export const getCommunityMembers = query({
  args: {
    communityId: v.id("communities"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { communityId, paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };

    const membership = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_userId", (q) =>
        q.eq("communityId", communityId).eq("userId", userId)
      )
      .first();

    if (!membership || membership.status !== "approved") {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const result = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_status", (q) =>
        q.eq("communityId", communityId).eq("status", "approved")
      )
      .paginate(paginationOpts);

    const members = await Promise.all(
      result.page.map(async (member) => {
        const user = await ctx.db.get(member.userId);
        if (!user) return null;

        const profilePicture = await r2.getUrl(user.profilePicture);
        const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();

        return {
          userId: user._id,
          profilePicture,
          name: user.name,
          gender: user.gender,
          age,
          country: user.country,
          isSupporter: user.isSupporter,
        };
      })
    );

    return {
      page: members.filter((m) => m !== null),
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

export const getCommunityRequests = query({
  args: {
    communityId: v.id("communities"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { communityId, paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return { page: [], isDone: true, continueCursor: "" };

    const community = await ctx.db.get(communityId);
    if (!community || community.adminId !== userId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const result = await ctx.db
      .query("communityMembers")
      .withIndex("by_communityId_status", (q) =>
        q.eq("communityId", communityId).eq("status", "pending")
      )
      .paginate(paginationOpts);

    const requests = await Promise.all(
      result.page.map(async (request) => {
        const user = await ctx.db.get(request.userId);
        if (!user) return null;

        const profilePicture = await r2.getUrl(user.profilePicture);
        const age = new Date().getFullYear() - new Date(user.birthDate).getFullYear();

        return {
          requestId: request._id,
          userId: user._id,
          profilePicture,
          name: user.name,
          gender: user.gender,
          age,
          country: user.country,
          isSupporter: user.isSupporter,
          requestMessage: request.requestMessage || "",
        };
      })
    );

    return {
      page: requests.filter((r) => r !== null),
      isDone: result.isDone,
      continueCursor: result.continueCursor,
    };
  },
});

export const acceptCommunityRequest = mutation({
  args: {
    requestId: v.id("communityMembers"),
  },
  handler: async (ctx, { requestId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const request = await ctx.db.get(requestId);
    if (!request) throw new Error("Request not found");

    const community = await ctx.db.get(request.communityId);
    if (!community || community.adminId !== userId) {
      throw new Error("Only admin can accept requests");
    }

    await ctx.db.patch(requestId, {
      status: "approved",
      requestMessage: undefined,
    });

    return { success: true };
  },
});

export const rejectCommunityRequest = mutation({
  args: {
    requestId: v.id("communityMembers"),
  },
  handler: async (ctx, { requestId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("User not authenticated");

    const request = await ctx.db.get(requestId);
    if (!request) throw new Error("Request not found");

    const community = await ctx.db.get(request.communityId);
    if (!community || community.adminId !== userId) {
      throw new Error("Only admin can reject requests");
    }

    await ctx.db.delete(requestId);

    return { success: true };
  },
});
