import { useState, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Community, CommunitiesSection } from "@/types/communities";

interface UseCommunitiesReturn {
  activeSection: CommunitiesSection;
  joinedCommunities: Community[];
  discoverCommunities: Community[];
  isLoading: boolean;
  handleSectionChange: (section: CommunitiesSection) => void;
  getCurrentData: () => Community[];
}

export const useCommunities = (): UseCommunitiesReturn => {
  const [activeSection, setActiveSection] = useState<CommunitiesSection>("joined");

  const joinedResult = useQuery(api.communities.communities.getJoinedCommunities, {
    paginationOpts: { numItems: 50, cursor: null },
  });

  const discoverResult = useQuery(api.communities.communities.getDiscoverCommunities, {
    paginationOpts: { numItems: 50, cursor: null },
  });

  const joinedCommunities = joinedResult?.page || [];
  const discoverCommunities = discoverResult?.page || [];
  const isLoading = joinedResult === undefined || discoverResult === undefined;

  const handleSectionChange = useCallback((section: CommunitiesSection) => {
    setActiveSection(section);
  }, []);

  const getCurrentData = useCallback(() => {
    return activeSection === "joined" ? joinedCommunities : discoverCommunities;
  }, [activeSection, joinedCommunities, discoverCommunities]);

  return {
    activeSection,
    joinedCommunities,
    discoverCommunities,
    isLoading,
    handleSectionChange,
    getCurrentData,
  };
};