import { Id } from "@/convex/_generated/dataModel";


// Types for friend card
export interface Friend {
  userId: Id<"users">;
  profileId: Id<"profiles">;
  profilePicture: string;
  name: string;
  gender: "male" | "female" | "other";
  age: number;
  country: string;
  activeBadge?: string;
}

// Types for Friend Request
export interface Request {
  requestId: Id<"friendRequests">;
  profilePicture: string;
  name: string;
  gender: "male" | "female" | "other";
  age: number;
  country: string;
  activeBadge?: string;
  requestMessage: string;
  senderId: Id<"users">;
}
