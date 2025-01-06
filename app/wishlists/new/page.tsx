import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function NewWishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // If user is authenticated, they'll see this page
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Wishlist</h1>
      {/* TODO: Add wishlist creation form */}
      <div className="text-muted-foreground">Wishlist creation form coming soon...</div>
    </div>
  );
}
