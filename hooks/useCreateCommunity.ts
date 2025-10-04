import { useState, useCallback } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Toast from "react-native-toast-message";
import { uploadImageToConvex } from "@/utils/uploadImages";

interface UseCreateCommunityReturn {
  title: string;
  description: string;
  rules: string[];
  genderOption: "all" | "my_gender";
  bannerUri: string | null;
  isCreating: boolean;
  agreementAccepted: boolean;
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  addRule: (rule: string) => void;
  removeRule: (index: number) => void;
  setGenderOption: (option: "all" | "my_gender") => void;
  setBannerUri: (uri: string | null) => void;
  setAgreementAccepted: (accepted: boolean) => void;
  createCommunity: () => Promise<boolean>;
  canCreate: boolean;
}

export const useCreateCommunity = (): UseCreateCommunityReturn => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rules, setRules] = useState<string[]>([]);
  const [genderOption, setGenderOption] = useState<"all" | "my_gender">("all");
  const [bannerUri, setBannerUri] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [agreementAccepted, setAgreementAccepted] = useState(false);

  const createCommunityMutation = useMutation(api.communities.communities.createCommunity);
  const generateUploadUrl = useMutation(api.storage.generateConvexUploadUrl);

  const addRule = useCallback((rule: string) => {
    if (rule.trim() && !rules.includes(rule.trim())) {
      setRules(prev => [...prev, rule.trim()]);
    }
  }, [rules]);

  const removeRule = useCallback((index: number) => {
    setRules(prev => prev.filter((_, i) => i !== index));
  }, []);

  const createCommunity = useCallback(async (): Promise<boolean> => {
    if (!title.trim() || !description.trim() || !agreementAccepted) {
      return false;
    }

    setIsCreating(true);
    try {
      let bannerId: Id<"_storage"> | undefined = undefined;

      if (bannerUri) {
        const uploadResult = await uploadImageToConvex(bannerUri, generateUploadUrl);
        if (uploadResult?.storageId) {
          bannerId = uploadResult.storageId as Id<"_storage">;
        }
      }

      await createCommunityMutation({
        title: title.trim(),
        description: description.trim(),
        rules,
        genderOption,
        banner: bannerId,
      });

      Toast.show({
        type: "success",
        text1: "Community Created",
        text2: "Your community has been created successfully!",
      });

      return true;
    } catch (error) {
      console.error("Failed to create community:", error);
      Toast.show({
        type: "error",
        text1: "Creation Failed",
        text2: "Failed to create community. Please try again.",
      });
      return false;
    } finally {
      setIsCreating(false);
    }
  }, [title, description, rules, genderOption, bannerUri, agreementAccepted, createCommunityMutation, generateUploadUrl]);

  const canCreate = title.trim().length > 0 && 
                   description.trim().length > 0 && 
                   agreementAccepted;

  return {
    title,
    description,
    rules,
    genderOption,
    bannerUri,
    isCreating,
    agreementAccepted,
    setTitle,
    setDescription,
    addRule,
    removeRule,
    setGenderOption,
    setBannerUri,
    setAgreementAccepted,
    createCommunity,
    canCreate,
  };
};