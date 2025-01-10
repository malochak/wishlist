"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createWishlistAction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string | null;

  const { error } = await supabase
    .from("wishlists")
    .insert({
      user_id: user.id,
      title,
      description,
    });

  if (error) {
    console.error("Error creating wishlist:", error);
    throw error;
  }

  revalidatePath("/wishlists");
  redirect("/wishlists");
}

export async function getWishlistsAction() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const { data: wishlists, error } = await supabase
    .from("wishlists")
    .select(`
      *,
      wishlist_items (*)
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching wishlists:", error);
    throw error;
  }

  return wishlists;
}

export async function addWishlistItemAction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/sign-in");
  }

  const wishlistId = formData.get("wishlistId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const imageUrl = formData.get("imageUrl") as string | null;
  const purchaseUrl = formData.get("purchaseUrl") as string | null;
  const price = formData.get("price") ? Number(formData.get("price")) : null;

  // Verify user owns the wishlist
  const { data: wishlist, error: wishlistError } = await supabase
    .from("wishlists")
    .select()
    .eq("id", wishlistId)
    .eq("user_id", user.id)
    .single();

  if (wishlistError || !wishlist) {
    throw new Error("Wishlist not found or access denied");
  }

  const { error } = await supabase
    .from("wishlist_items")
    .insert({
      wishlist_id: wishlistId,
      name,
      description,
      image_url: imageUrl,
      purchase_url: purchaseUrl,
      price,
    });

  if (error) {
    console.error("Error adding wishlist item:", error);
    throw error;
  }

  revalidatePath(`/wishlists/${wishlistId}`);
}

export async function deleteWishlistAction(formData: FormData) {
  const supabase = await createClient();

  const wishlistId = formData.get("wishlistId") as string;

  const { error } = await supabase
    .from("wishlists")
    .delete()
    .eq("id", wishlistId);

  if (error) {
    console.error("Error deleting wishlist:", error);
    throw error;
  }

  revalidatePath("/wishlists");
}

export async function toggleWishlistVisibility(formData: FormData) {
  // Implementation here
}

export async function createReservation(formData: FormData) {
  // Implementation here
}

export async function updateItemPriority(formData: FormData) {
  // Implementation here
} 