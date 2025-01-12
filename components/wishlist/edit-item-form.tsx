"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";
import { updateWishlistItemAction } from "@/app/wishlists/actions";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditItemFormProps {
  wishlistId: string;
  item: {
    id: string;
    name: string;
    description: string | null;
    image_url: string | null;
    purchase_url: string | null;
    price: number | null;
  };
}

export function EditItemForm({ wishlistId, item }: EditItemFormProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      formData.append("itemId", item.id);
      await updateWishlistItemAction(formData);
      router.push(`/wishlists/${wishlistId}`);
      router.refresh();
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
        <label htmlFor="name" className="text-sm font-medium">
          Item Name
        </label>
        <Input
          id="name"
          name="name"
          defaultValue={item.name}
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
          defaultValue={item.description || ""}
          rows={4}
          maxLength={500}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="purchaseUrl" className="text-sm font-medium">
          Purchase Link (Optional)
        </label>
        <Input
          id="purchaseUrl"
          name="purchaseUrl"
          type="url"
          defaultValue={item.purchase_url || ""}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="price" className="text-sm font-medium">
          Price (Optional)
        </label>
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          defaultValue={item.price || ""}
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="imageUrl" className="text-sm font-medium">
          Image URL (Optional)
        </label>
        <Input
          id="imageUrl"
          name="imageUrl"
          type="url"
          defaultValue={item.image_url || ""}
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" className="flex-1" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" asChild className="flex-1">
          <Link href={`/wishlists/${wishlistId}`}>Cancel</Link>
        </Button>
      </div>
    </form>
  );
} 