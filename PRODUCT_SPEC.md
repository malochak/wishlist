# Wishlist App - Product Specification

## Overview
A minimalist wishlist application that allows users to create, manage, and share their wishlists with friends and family.

## Wireframes and User Flows

### 1. Login/Registration Screen
- **Title:** "Welcome to Wishlist App"
- **Authentication Methods:**
  - Facebook Login
  - Google Login

### 2. Wishlist Dashboard
- **Header:** "Your Wishlist"
- **Key Features:**
  - Add New Item button
  - Generate Shareable Wishlist Link
- **Item Card Components:**
  - Item Name
  - Optional Description
  - Optional Image
  - Purchase Link
  - Edit/Delete Actions

### 3. Add/Edit Item Screen
- **Title:** "Add a New Gift"
- **Form Fields:**
  - Item Name (Required)
  - Description (Optional)
  - Purchase Link (Optional)
  - Image Upload (Optional)
- **Actions:**
  - Save Item
  - Cancel

### 4. Public Wishlist (Shared Link)
- **Header:** "[User]'s Wishlist"
- **Item Display:**
  - Item Details
  - Reserve Gift Functionality
- **Reservation Flow:**
  - Popup for reservation confirmation
  - Email or Unique Code input

### 5. Wishlist Settings (Future Version)
- Visibility Options
- Reservation Tracking Preferences

## Requirements

### 1. User Authentication
- Third-party login support:
  - Facebook
  - Google
- Secure authentication and data storage

### 2. Wishlist Management
- Create personal wishlist
- Add items with:
  - Required name
  - Optional description
  - Optional purchase link
  - Optional image
- Edit and delete wishlist items
- Generate unique shareable link

### 3. Public Wishlist Sharing
- Display wishlist items publicly
- Item reservation system
- Prevent duplicate reservations
- Minimal reservation identification

### 4. Reservation Management
- Optional reservation visibility
- Default anonymous reservations

### 5. Design Principles
- Mobile-first responsive design
- Minimalist, clean UI
- Neutral color scheme

## Database Schema

### Tables

#### profiles
- `id`: UUID (PK, references auth.users)
- `username`: text (unique)
- `full_name`: text
- `avatar_url`: text
- `updated_at`: timestamp

#### wishlists
- `id`: UUID (PK)
- `user_id`: UUID (FK to profiles)
- `title`: text
- `description`: text (optional)
- `is_public`: boolean (default true)
- `created_at`: timestamp
- `updated_at`: timestamp

#### wishlist_items
- `id`: UUID (PK)
- `wishlist_id`: UUID (FK to wishlists)
- `name`: text
- `description`: text (optional)
- `image_url`: text (optional)
- `purchase_url`: text (optional)
- `price`: decimal(10,2) (optional)
- `priority`: smallint (default 1)
- `created_at`: timestamp
- `updated_at`: timestamp

#### reservations
- `id`: UUID (PK)
- `item_id`: UUID (FK to wishlist_items)
- `reserver_email`: text
- `reserver_name`: text (optional)
- `reserved_at`: timestamp
- `status`: text (enum: 'reserved', 'purchased', 'cancelled')
- `cancellation_token`: UUID (unique)

### Security Policies
- Row Level Security (RLS) enabled on all tables
- Public profiles viewable by everyone
- Users can only manage their own profiles
- Public wishlists viewable by everyone
- Private wishlists only viewable by owners
- Wishlist items inherit wishlist visibility
- Reservations viewable only by wishlist owners

## Implemented Features

### Authentication
- Email/Password authentication
- OAuth providers (Google, Facebook)
- Password reset functionality
- User profile creation on signup

### Wishlist Management
- Create new wishlists
  - Required title
  - Optional description
  - Public/private setting
- View all user's wishlists
- Delete wishlists

### Item Management
- Add items to wishlists
  - Required name
  - Optional description
  - Optional purchase URL
  - Optional price
  - Optional image URL
- View items in wishlist
- Delete items from wishlist

## API Actions

### Authentication
- `signUpAction`: Handle user registration
- `signInAction`: Handle user login
- `forgotPasswordAction`: Handle password reset requests
- `resetPasswordAction`: Process password resets
- `signOutAction`: Handle user logout

### Wishlist Management
- `createWishlistAction`: Create new wishlists
- `getWishlistsAction`: Fetch user's wishlists
- `addWishlistItemAction`: Add items to wishlist
- `deleteWishlistAction`: Remove wishlists

## Components

### Forms
- `WishlistForm`: Create/edit wishlists
  - Title input
  - Description textarea
  - Submit/Cancel buttons
  - Error handling
  - Loading states

- `AddItemForm`: Add/edit wishlist items
  - Name input
  - Description textarea
  - Purchase URL input
  - Price input
  - Image URL input
  - Submit/Cancel buttons
  - Error handling
  - Loading states

## Technical Implementation

### Server Actions
All database operations are implemented as server actions for:
- Better security
- Improved performance
- Type safety
- Proper error handling
- Cache invalidation

### Database Access
- Uses Supabase client
- Server-side data fetching
- Row Level Security enforcement
- Proper error handling

### UI Components
- Built with shadcn/ui
- Responsive design
- Loading states
- Error feedback
- Form validation

## Technology Stack
- Frontend: Next.js (React)
- Authentication: Supabase Auth
- Database: Supabase (PostgreSQL)
- UI Components: shadcn/ui
- Styling: Tailwind CSS

## Next Steps
1. Implement wishlist sharing functionality
2. Add reservation system
3. Create public wishlist view
4. Add email notifications
5. Implement item prioritization
6. Add image upload functionality

## Future Considerations
- Internationalization
- Accessibility improvements
- Advanced sharing options
- Group gift contributions
- Multiple wishlist support
- Reservation notifications
