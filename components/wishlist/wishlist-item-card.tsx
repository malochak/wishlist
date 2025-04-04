'use client';

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ImageIcon, Pencil, Trash2 } from "lucide-react";
import { ReservationForm } from "@/components/wishlist/reservation-form";
import Image from "next/image";
import Link from "next/link";
import { deleteWishlistItemAction } from "@/app/wishlists/actions";
import { Badge } from "@/components/ui/badge";

export interface WishlistItem {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  purchase_url?: string;
  price?: number;
  reservations: {
    id: string;
    status: string;
    reserved_at: string;
    reserver_name?: string;
  };
}

interface WishlistItemCardProps {
  item: WishlistItem;
  isOwner: boolean;
  wishlistId: string;
}

export function WishlistItemCard({ item, isOwner, wishlistId }: WishlistItemCardProps) {
  const isReserved = !!item.reservations;
  
  console.log("reservations", item.reservations);

  return (
    <Card className={`flex flex-col relative ${isReserved ? 'opacity-60' : ''}`}>
      {isReserved && (
        <Badge variant="secondary" className="absolute right-2 top-2 z-10">
          Reserved
        </Badge>
      )}
      
      {/* Image Section */}
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

      {/* Content Section */}
      <div className="flex flex-col flex-1 justify-between">
        {/* Title and Description Container */}
        <div className="flex flex-col">
          <CardHeader>
            <CardTitle className="line-clamp-1">{item.name}</CardTitle>
            {item.description && (
              <CardDescription className="line-clamp-3">
                {item.description}
              </CardDescription>
            )}
          </CardHeader>
        </div>

        {/* Price and Footer Container */}
        <div className="flex flex-col">
          <CardContent className="pt-0">
            {item.price && (
              <div className="text-lg font-semibold">
                ${item.price.toFixed(2)}
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between items-center gap-2">
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
            
            <div className="flex items-center gap-2">
              {isOwner ? (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                  >
                    <Link href={`/wishlists/${wishlistId}/items/${item.id}/edit`}>
                      <span className="sr-only">Edit Item</span>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                  <form action={deleteWishlistItemAction}>
                    <input type="hidden" name="itemId" value={item.id} />
                    <Button
                      variant="outline"
                      size="icon"
                      type="submit"
                      className="text-destructive hover:text-destructive"
                    >
                      <span className="sr-only">Delete Item</span>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </>
              ) : (
                !isReserved ? (
                  <ReservationForm itemId={item.id} itemName={item.name} />
                ) : (
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">
                      Reserved {new Date(item.reservations!.reserved_at).toLocaleDateString()}
                    </span>
                  </div>
                )
              )}
            </div>
          </CardFooter>

          {/* Show reservation info to owner */}
          {isOwner && item.reservations && (
            <div className="px-6 pb-4 text-sm text-muted-foreground">
              Reserved by: {item.reservations.reserver_name}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
} 