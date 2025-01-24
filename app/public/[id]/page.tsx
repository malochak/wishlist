import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { ReservationForm } from "@/components/wishlist/reservation-form";
import Image from "next/image";

interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  purchase_url?: string;
  price?: number;
  reservations?: Reservation[];
}

interface Reservation {
  id: string;
  status: string;
  created_at: string;
}

interface Wishlist {
  id: string;
  title: string;
  description?: string;
  is_public: boolean;
  wishlist_items?: WishlistItem[];
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicWishlistPage({
  params,
}: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Get wishlist
  const { data: wishlist, error: wishlistError } = await supabase
    .from("wishlists")
    .select('*')
    .eq("id", id)
    .single();

  if (wishlistError || !wishlist) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Wishlist not found</h1>
        <p className="text-muted-foreground mt-2">
          This wishlist might have been deleted or is private.
        </p>
      </div>
    );
  }

  // Get wishlist items
  const { data: wishlistItems, error: itemsError } = await supabase
    .from("wishlist_items")
    .select('*')
    .eq("wishlist_id", id);

  if (itemsError) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Error loading wishlist items</h1>
        <p className="text-muted-foreground mt-2">
          Please try again later.
        </p>
      </div>
    );
  }

  // Get reservations for these items if there are any items
  let reservations = [];
  if (wishlistItems && wishlistItems.length > 0) {
    const { data: reservationsData, error: reservationsError } = await supabase
      .from("reservations")
      .select('*')
      .in('item_id', wishlistItems.map(item => item.id));
    
    if (!reservationsError) {
      reservations = reservationsData || [];
    }
  }

  // Combine the data
  const fullWishlist = {
    ...wishlist,
    wishlist_items: wishlistItems?.map(item => ({
      ...item,
      reservations: reservations.filter(r => r.item_id === item.id)
    }))
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{fullWishlist.title}</h1>
        {fullWishlist.description && (
          <p className="text-muted-foreground mt-2">{fullWishlist.description}</p>
        )}
      </div>

      {fullWishlist.wishlist_items?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No items in this wishlist</h2>
          <p className="text-muted-foreground">
            The owner hasn't added any items yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fullWishlist.wishlist_items?.map((item) => (
            <Card key={item.id} className="flex flex-col">
              {item.image_url ? (
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover rounded-t-lg hover:scale-105 transition-transform duration-200"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-muted flex items-center justify-center rounded-t-lg">
                  <ImageIcon className="h-12 w-12 text-muted-foreground" />
                </div>
              )}
              <div className="flex flex-col flex-grow">
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                  {item.description && (
                    <CardDescription>{item.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  {item.price && (
                    <div className="text-lg font-semibold">
                      ${item.price.toFixed(2)}
                    </div>
                  )}
                </CardContent>
                <CardFooter className="mt-auto flex justify-between items-center gap-2">
                  <div className="flex items-center gap-2">
                    {item.purchase_url && (
                      <Button variant="outline" asChild>
                        <a 
                          href={item.purchase_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          View Item
                        </a>
                      </Button>
                    )}
                  </div>
                  
                  <div className="flex items-center">
                    {!item.reservations?.[0] ? (
                      <ReservationForm itemId={item.id} itemName={item.name} />
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500" />
                        <span className="text-sm text-muted-foreground">
                          Reserved {new Date(item.reservations[0].created_at).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 