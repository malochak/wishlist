import { createClient } from "@/utils/supabase/server";
import { WishlistItemCard } from "@/components/wishlist/wishlist-item-card";
import type { WishlistItem } from "@/components/wishlist/wishlist-item-card";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PublicWishlistPage({
  params,
}: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Get wishlist
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
          {wishlist.wishlist_items?.map((item: WishlistItem) => (
            <WishlistItemCard
              key={item.id}
              item={item}
              isOwner={false}
              wishlistId={id}
            />
          ))}
        </div>
      )}
    </div>
  );
} 