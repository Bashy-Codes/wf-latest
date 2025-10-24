# Letter System Migration - Convex Scheduled Functions

## Overview
Migrated the letter delivery system from unreliable time-based queries to Convex scheduled functions with status-based tracking.

## Changes Made

### 1. Schema Updates (`convex/schema.ts`)
- **Removed**: `deliverAt: v.number()` field
- **Added**: 
  - `status: v.union(v.literal("pending"), v.literal("delivered"))`
  - `scheduledFunctionId: v.optional(v.id("_scheduled_functions"))`
- **Updated Indexes**:
  - Replaced `by_recipient_deliverAt` with `by_recipient_status`
  - Replaced `by_sender_deliverAt` with `by_sender_status`
  - Removed `by_deliverAt` index

### 2. Backend Logic (`convex/communications/letters.ts`)
- **New Internal Mutation**: `deliverLetter` - Updates letter status to "delivered"
- **Updated `scheduleLetter` Mutation**:
  - Creates letter with `status: "pending"`
  - Uses `ctx.scheduler.runAt()` to schedule delivery
  - Stores `scheduledFunctionId` for cancellation support
- **Updated Queries**:
  - `getUserReceivedLetters`: Filters by `status === "delivered"`
  - `getUserSentLetters`: Returns all letters with status field
  - `getLetter`: Checks status instead of time comparison
- **Updated `deleteLetter` Mutation**:
  - Cancels scheduled function if letter is pending
  - Uses `ctx.scheduler.cancel()` for cleanup

### 3. Helper Functions (`convex/helpers.ts`)
- **Removed**: `calculateDaysUntilDelivery()` - No longer needed

### 4. Type Definitions (`types/index.ts`)
- **Updated Interfaces**:
  - `LetterData`: Replaced `deliverAt`, `isDelivered`, `daysUntilDelivery` with `status`
  - `LetterDetailData`: Replaced `deliverAt`, `isDelivered`, `daysUntilDelivery` with `status`
  - `LetterCardProps`: Updated to use `status` field

### 5. Frontend Components
- **`LetterCard.tsx`**: Updated to check `letter.status === "delivered"`
- **`useLetter.ts`**: Removed `getDaysUntilDelivery` function
- **`[id].tsx`**: Updated to use `status` field, removed delivery countdown

## How It Works

1. **Scheduling**: When a user schedules a letter, the system:
   - Creates a letter document with `status: "pending"`
   - Schedules an internal mutation using `ctx.scheduler.runAt()`
   - Stores the scheduled function ID for potential cancellation

2. **Delivery**: At the scheduled time, Convex automatically:
   - Executes the `deliverLetter` internal mutation
   - Updates the letter status from "pending" to "delivered"

3. **Querying**: 
   - Recipients only see letters with `status === "delivered"`
   - Senders see all their letters with status indicator

4. **Cancellation**: If sender deletes a pending letter:
   - System cancels the scheduled function
   - Deletes the letter document

## Benefits

- **Reliability**: Convex guarantees scheduled functions execute exactly once
- **Resilience**: Survives system restarts and downtime
- **Atomic**: Scheduling is atomic with letter creation in mutations
- **Clean**: No need for polling or time-based queries
- **Scalable**: Handles letters scheduled months in advance

## Migration Notes

- Existing letters with `deliverAt` field will need data migration
- Run a migration script to convert existing letters to new schema
- Consider adding a notification when letter is delivered
