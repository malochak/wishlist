"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { randomUUID } from "crypto";

export async function createWishlistAction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
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
    redirect("/");
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
    redirect("/");
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

export async function createReservationAction(formData: FormData) {
  const itemId = formData.get("itemId") as string;
  const reserverName = formData.get("reserverName") as string;
  const reserverEmail = formData.get("reserverEmail") as string;
  const cancellationToken = randomUUID();

  if (!itemId || !reserverEmail) {
    throw new Error("Missing required fields");
  }

  const supabase = await createClient();

  // Check if item is already reserved
  const { data: existingReservation } = await supabase
    .from("reservations")
    .select("*")
    .eq("item_id", itemId)
    .eq("status", "reserved")
    .single();

  if (existingReservation) {
    throw new Error("This item is already reserved");
  }

  // Create reservation
  const { error: reservationError } = await supabase
    .from("reservations")
    .insert({
      item_id: itemId,
      reserver_name: reserverName,
      reserver_email: reserverEmail,
      status: "reserved",
      cancellation_token: cancellationToken,
    });

  if (reservationError) {
    throw new Error("Failed to create reservation");
  }

  // Send confirmation email with cancellation link
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const cancellationUrl = `${baseUrl}/reservations/cancel?token=${cancellationToken}`;
  
  // TODO: Implement email sending with the cancellation URL
  // For now, we'll just console.log it
  console.log("Cancellation URL:", cancellationUrl);

  revalidatePath("/wishlists/[id]");
  revalidatePath("/public/[id]");
}

export async function updateReservationStatusAction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  const reservationId = formData.get("reservationId") as string;
  const status = formData.get("status") as "reserved" | "purchased" | "cancelled";

  const { error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", reservationId);

  if (error) {
    console.error("Error updating reservation:", error);
    throw error;
  }

  revalidatePath("/wishlists/[id]");
}

export async function deleteWishlistItemAction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  const itemId = formData.get("itemId") as string;

  // Verify user owns the wishlist containing this item
  const { data: item, error: itemError } = await supabase
    .from("wishlist_items")
    .select("wishlist_id")
    .eq("id", itemId)
    .single();

  if (itemError || !item) {
    throw new Error("Item not found");
  }

  const { data: wishlist, error: wishlistError } = await supabase
    .from("wishlists")
    .select()
    .eq("id", item.wishlist_id)
    .eq("user_id", user.id)
    .single();

  if (wishlistError || !wishlist) {
    throw new Error("Not authorized to delete this item");
  }

  const { error } = await supabase
    .from("wishlist_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("Error deleting wishlist item:", error);
    throw error;
  }

  revalidatePath(`/wishlists/${item.wishlist_id}`);
}

export async function updateWishlistItemAction(formData: FormData) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  const itemId = formData.get("itemId") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string | null;
  const imageUrl = formData.get("imageUrl") as string | null;
  const purchaseUrl = formData.get("purchaseUrl") as string | null;
  const price = formData.get("price") ? Number(formData.get("price")) : null;

  // Verify user owns the wishlist containing this item
  const { data: item, error: itemError } = await supabase
    .from("wishlist_items")
    .select(`
      wishlist_id,
      wishlists!inner (
        user_id
      )
    `)
    .eq("id", itemId)
    .single();

  if (itemError || !item || item.wishlists.user_id !== user.id) {
    throw new Error("Not authorized to edit this item");
  }

  const { error } = await supabase
    .from("wishlist_items")
    .update({
      name,
      description,
      image_url: imageUrl,
      purchase_url: purchaseUrl,
      price,
      updated_at: new Date().toISOString(),
    })
    .eq("id", itemId);

  if (error) {
    console.error("Error updating wishlist item:", error);
    throw error;
  }

  revalidatePath(`/wishlists/${item.wishlist_id}`);
}

export async function reserveItemAction({
  itemId,
  email,
  name,
}: {
  itemId: string;
  email: string;
  name: string;
}) {
  const supabase = await createClient();
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  
  // First check if item is already reserved
  const { data: existingReservation } = await supabase
    .from('reservations')
    .select('id')
    .eq('item_id', itemId)
    .eq('status', 'reserved')
    .single();

  if (existingReservation) {
    throw new Error('Item is already reserved');
  }

  // Generate cancellation token
  const cancellationToken = randomUUID();

  // Create the reservation
  const { error } = await supabase
    .from('reservations')
    .insert({
      item_id: itemId,
      reserver_email: email,
      reserver_name: name,
      user_id: user?.id, // Will be null for non-authenticated users
      status: 'reserved',
      cancellation_token: cancellationToken,
    });

  if (error) {
    console.error('Reservation error:', error);
    throw new Error('Failed to reserve item');
  }

  // Get the item details for the email
  const { data: item } = await supabase
    .from('wishlist_items')
    .select('name, wishlist:wishlists(title)')
    .eq('id', itemId)
    .single();

  // Send confirmation email with cancellation link
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const cancellationUrl = `${baseUrl}/reservations/cancel?token=${cancellationToken}`;
  
  // TODO: Implement email sending with the cancellation URL
  console.log('Reservation details:', {
    email,
    name,
    itemName: item?.name,
    wishlistTitle: item?.wishlist?.title,
    cancellationUrl,
  });

  revalidatePath("/wishlists/[id]");
  revalidatePath("/public/[id]");
}

async function sendReservationEmail({
  email,
  name,
  itemId,
}: {
  email: string;
  name: string;
  itemId: string;
}) {
  // Implement email sending logic here
  // You could use services like SendGrid, Amazon SES, etc.
  console.log('TODO: Implement email sending');
}

export async function toggleWishlistVisibilityAction(formData: FormData) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  const wishlistId = formData.get("wishlistId") as string;
  const isPublic = formData.get("isPublic") === "true";

  // Verify user owns the wishlist
  const { data: wishlist, error: wishlistError } = await supabase
    .from("wishlists")
    .select()
    .eq("id", wishlistId)
    .eq("user_id", user.id)
    .single();

  if (wishlistError || !wishlist) {
    throw new Error("Not authorized to update this wishlist");
  }

  const { error } = await supabase
    .from("wishlists")
    .update({ is_public: isPublic })
    .eq("id", wishlistId);

  if (error) {
    console.error("Error updating wishlist visibility:", error);
    throw error;
  }

  revalidatePath(`/wishlists/${wishlistId}/share`);
}

export async function cancelReservationAction(token: string) {
  const supabase = await createClient();

  if (!token) {
    throw new Error("Cancellation token is required");
  }

  // Find the reservation
  const { data: reservation, error: findError } = await supabase
    .from("reservations")
    .select("*")
    .eq("cancellation_token", token)
    .single();

  if (findError || !reservation) {
    throw new Error("Invalid cancellation token");
  }

  if (reservation.status === "cancelled") {
    throw new Error("Reservation is already cancelled");
  }

  // Update the reservation status
  const { error: updateError } = await supabase
    .from("reservations")
    .update({ status: "cancelled" })
    .eq("cancellation_token", token);

  if (updateError) {
    throw new Error("Failed to cancel reservation");
  }

  revalidatePath("/wishlists/[id]");
  revalidatePath("/public/[id]");
} 