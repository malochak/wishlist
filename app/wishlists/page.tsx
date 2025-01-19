import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getWishlistsAction } from "./actions";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default async function WishlistsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
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
            <Link key={wishlist.id} href={`/wishlists/${wishlist.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{wishlist.title}</CardTitle>
                  {wishlist.description && (
                    <CardDescription>{wishlist.description}</CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{wishlist.wishlist_items?.length || 0} items</span>
                    <span>{wishlist.is_public ? "Public" : "Private"}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
