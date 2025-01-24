import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ImageIcon } from "lucide-react";
import { ReservationForm } from "@/components/wishlist/reservation-form";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicWishlistPage({
  params,
}: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: wishlist, error } = await supabase
    .from("wishlists")
    .select(`
      *,
      wishlist_items (
        *,
        reservations (
          id,
          status,
          created_at
        )
      )
    `)
    .eq("id", id)
    .eq("is_public", true)
    .single();

  if (error || !wishlist) {
    return (
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Wishlist not found</h1>
        <p className="text-muted-foreground mt-2">
          This wishlist might have been deleted or is private.
        </p>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{wishlist.title}</h1>
        {wishlist.description && (
          <p className="text-muted-foreground mt-2">{wishlist.description}</p>
        )}
      </div>

      {wishlist.wishlist_items?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No items in this wishlist</h2>
          <p className="text-muted-foreground">
            The owner hasn't added any items yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.wishlist_items?.map((item) => (
            <Card key={item.id}>
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
              <CardHeader className="min-h-[80px]">
                <CardTitle>{item.name}</CardTitle>
                {item.description && (
                  <CardDescription>{item.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="min-h-[60px]">
                {item.price && (
                  <div className="text-lg font-semibold">
                    ${item.price.toFixed(2)}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
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
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 