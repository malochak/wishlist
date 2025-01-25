// Server Component
import { SharePageClient } from './client';
import { headers } from 'next/headers';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function SharePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/");
  }

  // Get wishlist data including visibility status
  const { data: wishlist, error } = await supabase
    .from("wishlists")
    .select('is_public')
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !wishlist) {
    redirect("/wishlists");
  }
  
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const publicUrl = `${protocol}://${host}/public/${id}`;

  return (
    <SharePageClient 
      id={id} 
      publicUrl={publicUrl}
      isPublic={wishlist.is_public}
    />
  );
} 