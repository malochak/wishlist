# Hybrid Reservation System Documentation

## Overview
A dual-mode reservation system that supports both authenticated and non-authenticated users, providing a seamless experience for casual users while offering enhanced features for registered users.

## Implementation Details

### 1. Public Access Routes
```typescript
// Middleware public routes configuration
const publicRoutes = [
  '/sign-in',
  '/sign-up',
  '/public'  // Base path for public wishlist views
];

// Route matching logic
const isPublicRoute = publicRoutes.some(route => {
  // Exact match for root path
  if (request.nextUrl.pathname === '/') {
    return true;
  }
  // For other routes, check if it starts with the route and is followed by / or end of string
  return request.nextUrl.pathname.match(new RegExp(`^${route}(?:/|$)`));
});
```

### 2. URL Generation for Sharing
Server-side URL generation to ensure compatibility:
```typescript
// In share page component
const headersList = await headers();
const host = headersList.get('host');
const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
const publicUrl = `${protocol}://${host}/wishlists/public/${id}`;
```

### 3. Component Structure

#### Server Component (page.tsx)
- Handles URL generation
- Manages authentication state
- Passes data to client component

#### Client Component (client.tsx)
- Manages UI interactions
- Handles clipboard operations
- Shows success/error states

### 4. Security Measures

#### Middleware Protection
- Public routes are explicitly defined
- Authentication checks for protected routes
- Proper route pattern matching
- Redirect to landing page for unauthorized access

#### Route Structure
- `/wishlists/[id]` - Protected route for wishlist owners
- `/wishlists/public/[id]` - Public route for shared wishlists
- `/wishlists/[id]/share` - Protected route for generating share links

### 5. Features

#### Share Page
- Generates shareable public URL
- Copy to clipboard functionality
- Preview link for shared wishlist
- Back navigation to wishlist
- Success/error notifications

#### Public View
- Read-only access to wishlist items
- Reservation capability for non-authenticated users
- Basic item details display
- Purchase link access

## Usage

### Sharing a Wishlist
1. Owner accesses `/wishlists/[id]`
2. Clicks share button
3. Gets redirected to `/wishlists/[id]/share`
4. Copies generated public URL
5. Shares URL with others

### Accessing Shared Wishlist
1. Recipient opens public URL
2. Views wishlist items without authentication
3. Can reserve items using email
4. Gets confirmation of reservation

## Security Considerations

### Route Protection
```typescript
// Middleware authentication check
if (user.error) {
  return NextResponse.redirect(new URL('/', request.url));
}
```

### Public Access
- Read-only access to shared wishlists
- No editing capabilities
- Basic reservation functionality
- No access to owner information

## Future Enhancements

### Phase 1
1. Email notifications for reservations
2. Reservation management for authenticated users
3. Enhanced sharing options (social media)

### Phase 2
1. Multiple wishlist sharing
2. Group gifting functionality
3. Advanced privacy settings
4. Analytics for wishlist owners

## Testing Requirements

### Unit Tests
- URL generation
- Route protection
- Reservation logic

### Integration Tests
- Share flow
- Public access
- Reservation process

### E2E Tests
- Complete sharing workflow
- Public access scenarios
- Reservation completion

## Monitoring

### Key Metrics
- Share link generation
- Public access counts
- Reservation success rate
- Error rates

## Documentation Updates
Last updated: [Current Date]
Version: 1.0.0
