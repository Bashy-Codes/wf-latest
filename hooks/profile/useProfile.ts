import { useQuery, useConvexAuth } from "convex/react"
import { useTheme } from "@/lib/Theme"
import { api } from "@/convex/_generated/api"

export const useProfile = () => {
  const theme = useTheme()

  // Check if user is authenticated
  const { isAuthenticated } = useConvexAuth()

  // Get current user profile from Convex - only if authenticated
  const Profile = useQuery(api.users.getCurrentProfile, isAuthenticated ? {} : "skip")

  const isLoading = Profile === undefined

  return {
    // Profile data and states
    Profile,
    isLoading,

    // Theme
    theme
  }
}
