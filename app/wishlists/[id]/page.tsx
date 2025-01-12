import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Share2, Plus, Settings } from "lucide-react";
import { ReservationForm } from "@/components/wishlist/reservation-form";
import Image from "next/image";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function WishlistPage({
  params,
}: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const { data: wishlist, error } = await supabase
    .from("wishlists")
    .select(`
      *,
      wishlist_items (*)
    `)
    .eq("id", id)
    .single();

  if (error || !wishlist) {
    redirect("/wishlists");
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{wishlist.title}</h1>
          {wishlist.description && (
            <p className="text-muted-foreground mt-2">{wishlist.description}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href={`/wishlists/${id}/share`}>
              <span className="sr-only">Share Wishlist</span>
              <Share2 className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" size="icon" asChild>
            <Link href={`/wishlists/${id}/settings`}>
              <span className="sr-only">Wishlist Settings</span>
              <Settings className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild>
            <Link href={`/wishlists/${id}/items/new`}>
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Link>
          </Button>
        </div>
      </div>

      {wishlist.wishlist_items?.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No items yet</h2>
          <p className="text-muted-foreground mb-4">
            Add your first item to this wishlist.
          </p>
          <Button asChild>
            <Link href={`/wishlists/${id}/items/new`}>Add Your First Item</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wishlist.wishlist_items?.map((item) => (
            <Card key={item.id}>
              {item.image_url && (
                <div className="relative w-full h-48">
                  <Image
                    src={item.image_url}
                    alt={item.name}
                    fill
                    unoptimized
                    className="object-cover rounded-t-lg"
                  />
                </div>
              )}
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
                <ReservationForm itemId={item.id} itemName={item.name} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 