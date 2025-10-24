# Push Notifications Setup Guide

This guide explains the remaining setup steps you need to complete to enable push notifications in your World Friends app.

## Overview

Push notifications have been integrated into your app for the following events:
- **New Message**: When someone sends you a message
- **Friend Request Received**: When someone sends you a friend request
- **Friend Request Accepted**: When someone accepts your friend request

## Required Setup Steps

### 1. Expo Project Configuration

You need to add your Expo Project ID to the environment variables.

#### Get Your Expo Project ID

1. Go to [Expo Dashboard](https://expo.dev)
2. Sign in to your account (or create one if you don't have it)
3. Create a new project or select your existing project
4. Copy the Project ID from your project settings

#### Add to Environment Variables

Add the following to your `.env` file:

```env
EXPO_PUBLIC_PROJECT_ID=your-expo-project-id-here
```

Replace `your-expo-project-id-here` with your actual Expo Project ID.

### 2. Test on Physical Device

Push notifications only work on physical devices, not in simulators or emulators.

#### iOS Testing

1. Build a development build:
   ```bash
   npx expo run:ios --device
   ```

2. Make sure your iOS device is connected to your Mac
3. Select your device when prompted
4. The app will install and you'll be prompted to allow notifications

#### Android Testing

1. Build a development build:
   ```bash
   npx expo run:android
   ```

2. Make sure your Android device is connected and USB debugging is enabled
3. The app will install and you'll be prompted to allow notifications

### 3. Production Setup

For production builds, you'll need to configure push notification credentials.

#### iOS Production Setup

1. Create an Apple Push Notification Service (APNs) key:
   - Go to [Apple Developer Portal](https://developer.apple.com/account/resources/authkeys/list)
   - Create a new key with Push Notifications enabled
   - Download the `.p8` file

2. Add credentials to Expo:
   ```bash
   npx expo credentials:manager
   ```

3. Follow the prompts to upload your APNs key

#### Android Production Setup

1. Expo automatically handles Firebase Cloud Messaging (FCM) for push notifications
2. No additional setup is required for Android in most cases
3. If you have a custom Firebase project, configure it in `app.json`:

```json
{
  "expo": {
    "android": {
      "googleServicesFile": "./google-services.json"
    }
  }
}
```

### 4. App Configuration (app.json)

Ensure your `app.json` includes the following notification settings:

```json
{
  "expo": {
    "notification": {
      "icon": "./assets/notification-icon.png",
      "color": "#ffffff",
      "iosDisplayInForeground": true,
      "androidMode": "default",
      "androidCollapsedTitle": "#{unread_notifications} new notifications"
    },
    "ios": {
      "infoPlist": {
        "UIBackgroundModes": ["remote-notification"]
      }
    },
    "android": {
      "useNextNotificationsApi": true,
      "permissions": [
        "POST_NOTIFICATIONS"
      ]
    }
  }
}
```

### 5. Convex Dashboard Configuration

The push notifications component has been configured in your Convex backend, but you should verify it's working:

1. Go to your [Convex Dashboard](https://dashboard.convex.dev)
2. Select your project
3. Navigate to "Components" in the sidebar
4. Verify that `expo-push-notifications` is listed and active

### 6. Testing Push Notifications

Once setup is complete, test the notifications:

1. Install the app on two physical devices (or one device and one test account)
2. Log in with different accounts on each device
3. Send a friend request from one device
4. You should receive a push notification on the other device
5. Accept the friend request and send a message
6. Verify that message notifications are received

## Troubleshooting

### Notifications Not Appearing

1. **Check Permissions**: Make sure notification permissions are granted
   - iOS: Settings > [Your App] > Notifications
   - Android: Settings > Apps > [Your App] > Notifications

2. **Verify Token Registration**: Check the console logs to see if the push token was successfully registered

3. **Check Device**: Ensure you're testing on a physical device, not a simulator

4. **Verify Convex Component**: Check your Convex dashboard to ensure the push notifications component is active

### Common Issues

**"Must use physical device for Push Notifications"**
- This is expected. Push notifications don't work in simulators/emulators

**"Project ID not found"**
- Add `EXPO_PUBLIC_PROJECT_ID` to your `.env` file

**Token registration fails**
- Make sure you have an Expo account and project set up
- Verify your Project ID is correct
- Check that you have internet connectivity

## How It Works

### Architecture

1. **Client Side** (`hooks/usePushNotifications.ts`):
   - Requests notification permissions
   - Gets Expo push token from device
   - Registers token with Convex backend
   - Listens for incoming notifications
   - Handles notification taps

2. **Backend Side** (`convex/pushNotifications.ts`):
   - Stores push tokens for each user
   - Provides helper function to send notifications
   - Integrates with Convex Expo Push Notifications component

3. **Event Integration**:
   - `convex/friendships.ts`: Sends notifications for friend requests
   - `convex/communications/conversations.ts`: Sends notifications for new messages

### Notification Data Structure

Each notification includes:
- **title**: The notification title
- **body**: The notification message
- **data**: Custom data for handling taps
  - `type`: The notification type (e.g., "friend_request_sent", "new_message")
  - Additional context (e.g., `senderId`, `conversationGroupId`)

### Navigation Handling

When a user taps a notification, the `handleNotificationResponse` function in `usePushNotifications.ts` determines where to navigate based on the notification type. You can customize this behavior to match your app's navigation structure.

## Next Steps

After completing the setup:

1. Test thoroughly on both iOS and Android devices
2. Customize notification sounds and icons as needed
3. Consider adding notification preferences in user settings
4. Monitor notification delivery in the Expo dashboard

## Additional Resources

- [Expo Push Notifications Guide](https://docs.expo.dev/push-notifications/overview/)
- [Convex Push Notifications Component](https://www.convex.dev/components/push-notifications)
- [Expo Notifications API Reference](https://docs.expo.dev/versions/latest/sdk/notifications/)
