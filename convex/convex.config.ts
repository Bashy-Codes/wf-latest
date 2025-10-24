import { defineApp } from "convex/server";
import r2 from "@convex-dev/r2/convex.config";
import pushNotifications from "@convex-dev/expo-push-notifications/convex.config";

const app = defineApp();

// Cloudflare R2 component
app.use(r2);

// Expo Push Notifications component
app.use(pushNotifications);

export default app;
