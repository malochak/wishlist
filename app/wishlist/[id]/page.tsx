"use client"

import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Gift, Link as LinkIcon } from 'lucide-react'

interface PublicWishlistPageProps {
  params: {
    id: string
  }
}

export default function PublicWishlistPage({ params }: PublicWishlistPageProps) {
  // This will be replaced with actual data from Supabase
  const wishlistData = {
    owner: 'John Doe',
    items: [
      {
        id: '1',
        name: 'Example Item',
        description: 'This is an example item description',
        imageUrl: 'https://placehold.co/600x400',
        purchaseLink: 'https://example.com',
        isReserved: false,
      },
    ],
  }

  if (!wishlistData) {
    notFound()
  }

  return (
    <div className="container py-10">
      <div className="mb-8 text-center">
        <h1 className="text-4xl font-bold">{wishlistData.owner}'s Wishlist</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a gift to reserve for {wishlistData.owner}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {wishlistData.items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {item.imageUrl && (
              <div className="relative h-48 w-full">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            )}
            <CardHeader className="space-y-1">
              <h3 className="text-2xl font-semibold tracking-tight">
                {item.name}
              </h3>
              {item.description && (
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {item.purchaseLink && (
                <a
                  href={item.purchaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-sm text-blue-600 hover:underline"
                >
                  <LinkIcon className="mr-1 h-4 w-4" />
                  View product
                </a>
              )}
              {item.isReserved ? (
                <div className="rounded-md bg-muted p-4 text-center text-sm text-muted-foreground">
                  This item has been reserved
                </div>
              ) : (
                <Button className="w-full" size="lg">
                  <Gift className="mr-2 h-4 w-4" />
                  Reserve This Gift
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
