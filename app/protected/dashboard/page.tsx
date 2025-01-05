import { Suspense } from 'react'
import Link from 'next/link'
import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { WishlistItem } from '@/components/wishlist/wishlist-item'

export default function DashboardPage() {
  return (
    <div className="container py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Your Wishlist</h1>
          <p className="mt-2 text-muted-foreground">
            Manage your wishlist items and share them with friends and family.
          </p>
        </div>
        <Button asChild>
          <Link href="/protected/items/add">
            <Plus className="mr-2 h-4 w-4" />
            Add New Item
          </Link>
        </Button>
      </div>

      <div className="mb-8">
        <h2 className="text-lg font-semibold">Your wishlist link</h2>
        <div className="mt-2 flex items-center gap-4">
          <code className="rounded bg-muted px-4 py-2 font-mono text-sm">
            {`${process.env.NEXT_PUBLIC_APP_URL}/wishlist/your-wishlist-id`}
          </code>
          <Button variant="outline" size="sm">
            Copy Link
          </Button>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-[300px] animate-pulse rounded-lg bg-muted"
              />
            ))}
          </div>
        }
      >
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* This will be replaced with actual data from Supabase */}
          <WishlistItem
            id="1"
            name="Example Item"
            description="This is an example item description"
            imageUrl="https://via.placeholder.com/300"
            purchaseLink="https://example.com"
            onEdit={(id) => console.log('Edit item', id)}
            onDelete={(id) => console.log('Delete item', id)}
          />
        </div>
      </Suspense>
    </div>
  )
}
