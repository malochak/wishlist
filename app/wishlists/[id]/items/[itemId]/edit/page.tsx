import { EditItemForm } from "@/components/wishlist/edit-item-form";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function EditItemPage(
    {params}: {params: {id: string, itemId: string}}
) {
  const { id, itemId } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Verify wishlist exists and user owns it
  const { data: item, error } = await supabase
    .from("wishlist_items")
    .select(`
      *,
      wishlists!inner (
        user_id
      )
    `)
    .eq("id", itemId)
    .single();

  if (error || !item || item.wishlists.user_id !== user.id) {
    redirect("/wishlists");
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Item</h1>
      <EditItemForm wishlistId={id} item={item} />
    </div>
  );
} 