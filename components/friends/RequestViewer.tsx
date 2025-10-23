import React from "react";
import {
  StyleSheet,
  Text,
} from "react-native";
import { moderateScale } from "react-native-size-matters";
import { useTheme } from "@/lib/Theme";
import { WFModal } from "../ui/WFModal";
import { Id } from "@/convex/_generated/dataModel";

interface BaseRequest {
  requestMessage: string;
}

interface FriendRequest extends BaseRequest {
  requestId: Id<"friendRequests">;
  senderId: Id<"users">;
}

interface CommunityRequest extends BaseRequest {
  requestId: Id<"communityMembers">;
  userId: Id<"users">;
}

type RequestType = FriendRequest | CommunityRequest;

interface RequestViewerProps {
  request: RequestType | null;
  visible: boolean;
  loading: boolean;
  onAccept: () => void;
  onReject: () => void;
}

export const RequestViewer: React.FC<RequestViewerProps> = ({
  request,
  visible,
  loading = false,
  onAccept,
  onReject,
}) => {
  const theme = useTheme();

  const styles = StyleSheet.create({
    messageText: {
      fontSize: moderateScale(16),
      color: theme.colors.text,
      lineHeight: moderateScale(22),
      minHeight: "30%"
    },
  });

  if (!request) return null;

  return (
    <WFModal
      visible={visible}
      onClose={onReject}
      onConfirm={onAccept}
      closeIcon="trash"
      headerIcon="mail"
      title="Request"
      loading={loading}
    >
      <Text style={styles.messageText}>{request.requestMessage}</Text>
    </WFModal>
  );
};