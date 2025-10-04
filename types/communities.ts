import { Id } from "@/convex/_generated/dataModel";

export interface Community {
  communityId: Id<"communities">;
  title: string;
  description: string;
  rules: string[];
  ageGroup: "13-17" | "18-100";
  gender: "all" | "male" | "female" | "other";
  bannerUrl?: string | null;
  createdAt: number;
}

export interface CommunityInfo extends Community {
  communityAdmin: {
    adminId: Id<"users">;
    name: string;
    profilePicture: string | null;
  };
  isAdmin: boolean;
  isMember: boolean;
  hasPendingRequest: boolean;
}

export type CommunitiesSection = "joined" | "discover";