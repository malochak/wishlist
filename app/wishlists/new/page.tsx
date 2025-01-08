import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { WishlistForm } from "@/components/wishlist/wishlist-form";

export default async function NewWishlistPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Wishlist</h1>
      <WishlistForm />
    </div>
  );
}
