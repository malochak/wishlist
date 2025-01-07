import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getWishlistsAction } from "./actions";

export default async function WishlistsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  const wishlists = await getWishlistsAction();

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Wishlists</h1>
        <Button asChild>
          <Link href="/wishlists/new">Create New Wishlist</Link>
        </Button>
      </div>

      {wishlists.length === 0 ? (
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold mb-2">No wishlists yet</h2>
          <p className="text-muted-foreground mb-4">
            Create your first wishlist to start sharing your wishes with others.
          </p>
          <Button asChild>
            <Link href="/wishlists/new">Create Your First Wishlist</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {wishlists.map((wishlist) => (
            <div key={wishlist.id} className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-2">{wishlist.title}</h2>
              {wishlist.description && (
                <p className="text-muted-foreground mb-4">{wishlist.description}</p>
              )}
              <div className="text-sm text-muted-foreground">
                {wishlist.wishlist_items?.length || 0} items
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
