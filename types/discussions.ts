import { Id } from "@/convex/_generated/dataModel";

export interface Discussion {
  discussionId: Id<"discussions">;
  communityId: Id<"communities">;
  title: string;
  content: string;
  imageUrl?: string | null;
  repliesCount: number;
  createdAt: number;
  discussionAuthor: {
    userId: Id<"users">;
    name: string;
    profilePicture: string;
  };
  isOwner: boolean;
}

export interface DiscussionDetail extends Discussion {
  communityTitle: string;
  canDelete: boolean;
}

export interface Thread {
  threadId: Id<"discussionThreads">;
  discussionId: Id<"discussions">;
  content: string;
  createdAt: number;
  threadAuthor: {
    userId: Id<"users">;
    name: string;
    profilePicture: string;
  };
  isOwner: boolean;
  hasReply: boolean;
  reply?: Thread | null;
}