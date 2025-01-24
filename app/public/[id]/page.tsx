import { createClient } from "@/utils/supabase/server";
import { WishlistItemCard } from "@/components/wishlist/wishlist-item-card";

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