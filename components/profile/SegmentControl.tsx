import React from "react";
import { TabControl, TabItem } from "@/components/ui/TabControl";

type TabType = "profile" | "posts" | "collections" | "gifts";

interface SegmentControlProps {
  activeTab: TabType;
  onTabPress: (tab: TabType) => void;
}

const tabs: TabItem[] = [
  { id: "profile", iconName: "person" },
  { id: "posts", iconName: "grid" },
  { id: "collections", iconName: "images" },
  { id: "gifts", iconName: "gift" },
];

export const SegmentControl: React.FC<SegmentControlProps> = ({
  activeTab,
  onTabPress,
}) => {
  return (
    <TabControl
      tabs={tabs}
      activeTab={activeTab}
      onTabPress={onTabPress as (tabId: string) => void}
      showIcon
    />
  );
};
