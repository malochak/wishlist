import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";
import { GiftIcon } from "lucide-react";

export default async function Index() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/wishlists");
  }

  return (
    <div className="flex-1 flex flex-col gap-8 items-center justify-center">
      <div className="flex flex-col items-center gap-4 max-w-2xl text-center">
        <GiftIcon className="h-16 w-16 text-primary" />
        <h1 className="text-5xl font-bold">Create Your Perfect Wishlist</h1>
        <p className="text-xl text-muted-foreground">
          Share your wishes with friends and family. Simple, elegant, and easy to use.
        </p>
      </div>
      
      <Button asChild size="lg" className="text-lg">
        <Link href="/wishlists/new">
          Create Wishlist
        </Link>
      </Button>
    </div>
  );
}
