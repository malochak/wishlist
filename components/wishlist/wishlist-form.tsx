"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { createWishlistAction } from "@/app/wishlists/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function WishlistForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      await createWishlistAction(formData);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setIsSubmitting(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium">
          Title
        </label>
        <Input
          id="title"
          name="title"
          placeholder="My Birthday Wishlist"
          required
          minLength={3}
          maxLength={100}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium">
          Description (Optional)
        </label>
        <Textarea
          id="description"
          name="description"
          placeholder="Things I'd love to receive for my birthday..."
          rows={4}
          maxLength={500}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Wishlist"}
        </Button>
        <Button type="button" variant="outline" asChild className="flex-1">
          <Link href="/wishlists">Cancel</Link>
        </Button>
      </div>
    </form>
  );
} 