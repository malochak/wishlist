import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Share2, Plus, Settings, Pencil, Trash2, ImageIcon } from "lucide-react";
import { WishlistItemCard } from "@/components/wishlist/wishlist-item-card";
import type { WishlistItem } from "@/components/wishlist/wishlist-item-card";

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
    redirect("/");
  }

  const { data: wishlist, error } = await supabase
    .from("wishlists")
    .select(`
      *,
      wishlist_items (
        *,
        reservations (*)
      )
    `)
    .eq("id", id)
    .single();

  if (error || !wishlist) {
    redirect("/wishlists");
  }

  const isOwner = wishlist.user_id === user.id;
  console.log("isowner", isOwner);

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
          {wishlist.wishlist_items?.map((item: WishlistItem) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              isOwner={isOwner}
              wishlistId={id}
            />
          ))}
        </div>
      )}
    </div>
  );
} 