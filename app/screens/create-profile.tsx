import React, { Suspense } from "react";
import { ScreenLoading } from "@/components/ScreenLoading";
import { useRouter } from "expo-router";

const CreateProfileComponent = React.lazy(() => 
  import("@/components/lazy/CreateProfileComponent").then(module => ({
    default: module.CreateProfileComponent
  }))
);

export default function CreateProfileScreen() {
  const router = useRouter();

  return (
    <Suspense fallback={<ScreenLoading onBack={() => router.back()} />}>
      <CreateProfileComponent />
    </Suspense>
  );
}