# Community Features for WorldFriends

## Core Features

# Community Management

- Communities are public, no need for request approval and users can join. however they can't see content of community except info. members can see content and engage.

Admin Controls:
create, update, delete community.

- Community Discovery & Joining

Communities are accessible from tab header.
Two-Tab Sections Interface:
Joined: Displays communities the user is a member of.
Discover: Shows communities available to join.


- Community Discussions

Posts like Discussions that users can create as the main engagment of community

Threaded Replies System:
Community-specific thread replies, similar to posts comments but tailored to discussions.

Tables:

- Communities: adminId, title, description, rules(array), and banner image, age Group(auto assigned (13-17 or 18+) based on the admin's age when creating community), gender(all, male, female, or other, give two options when creating: my own gender or all, my own gender selection will select the admin own gender).

- communityMembers: userId, communityId, status(approved, pending but for now, all are approved).
discussions: communityId, userId, title, content, images, and repliesCount.
discussionThreads: userId, discussionId, parentId, content. 

Note: we have all database schema and queries already setup so you need to work on client side.


# New Screens

- Create Community (/screens/create-community):
Full setup interface for creating a community, including title, description input, banner(image adding), rules(input chips like adding UI), gender selection with all and my gender option, and acceptance of agreement to be fair and make worldfriends friendly and contribute positively and then enable the create button.

- Communities (/screens/communities):
Fetch joined communities and discover new ones based on the section user is int. show `CommunityCard` that is touchable and will send to the community screen.

# Key Components

CommunityCard:
Modern card design for communities, both joined and unjoined will use the same card. show title of community and banner, no need for buttons or something, just make it touchable.

CommunitiesHeader:
Beautiful header component for communities screen like we have in @Store screen and @Inventory screen, show only image with static URL: storage.worldfriends.app/community. show a button to create community too.

create hooks for each screen

Notes:
No need to add communities notifcations for now. no need for language translation, just use english inside components and I will update later. 
update the existing components to also support communities if needed and used in communities.


Integration

Each screen has very clean and best practiced beautiful written code
Each hook has very clean and best practiced beautiful written code as useRevenueCat.ts has clean and very beautifully and readable not complex code written
UI adheres to modern, beautiful design principles consistent with the app.


for now, you should create these screens and components and make them functional, we will work on further tasks later. write standard practiced code, look how we have segments in @Inventory screen, how other code in the app is written, write clean types in files and write standard practiced code.



------------------------


Great! now let's move on and create community screen and it's components.

# WorldFriends communities: creating community screen and it's sections components

- create screens/community/[id].tsx and show @CommunitiesHeader, but before, update the @CommunitiesHeader to make it reusable and show the actual community banner in community screen and on button press, this time send to create discussion screen.

- create a CommunityHomeSection component for showing discussions that we will create later.
- create a CommunityInfoSection component that will show community details like description, admin, age group, and gender
- create a CommunitySettingsSection and it shows delete and update community options for admin and leave community for admin
- when the user is not member of community: so don't show settings section, show restriction message as we have in @PostsSection and @CollectionsSection and @GiftsSection of user profile for CommunityHomeSection and also show button to join community and on press, user will join community, and show CommunityInfoSection as it is so users can see info.

- create a hook useCommunity to manage all the logic of community and server fetchings and mutations etc

for now, you should create these screens and components and make them functional, we will work on further tasks later. write standard practiced code, look how we have segments in @Inventory screen, how other code in the app is written, write clean types in files and write standard practiced code.


------------------------------------------

Great! let's move on to create the discussions system

- create a screens/discussion/[id].tsx. make the UI somewhat similar to post screen.
- create a `DiscussionCard` component that you will show in home section community.
- create a `ThreadInput` component that is similar to comment input component and also create a `ThreadItem` that is similar to comment item. 
- create a useDiscussion hook for fetching, deleting, adding thread, deleting thread etc logic and other logic separate from UI code

------------------------------------------

Great! 

now I want you to:
- add a new requestMessage optional field in communityMembers table and when the user will join community so you should show @InputModal and when the user will send request so update the home state text to show that `Your community join request will be reviewed by Community Admin {username}` so you need to add hasPendingReuqest in query too when getting info.
- create a new `CommunityMembersSection` to show members with pagination. when not member so show restricted message with lock icon.
- create a new `CommunityReuqestsSection` to to show requests to admin only
- a member item UI will be like ConversationItem where show profile photo first, age, gender icon, country flag. no actions buttons needed for both members and requests, just member tap will send to profile and request tap will show @RequestViewer
- for requests, show @RequestViewer so you can update it's types if needed or other updates to make it reusable and then update it's usage where it is used to be more cleaner and reusable, not specific to one friend requests but independent.
- on accept request, set the member status to approved and set message to empty, on reject delete the request record.