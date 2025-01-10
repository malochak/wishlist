import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { AddItemForm } from "@/components/wishlist/add-item-form";

export default async function NewItemPage({
  params: { id },
}: {
  params: { id: string };
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Verify wishlist exists and user owns it
  const { data: wishlist, error } = await supabase
    .from("wishlists")
    .select()
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !wishlist) {
    redirect("/wishlists");
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Add New Item</h1>
      <AddItemForm wishlistId={id} />
    </div>
  );
} 