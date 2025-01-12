"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { createReservationAction } from "@/app/wishlists/actions";

interface ReservationFormProps {
  itemId: string;
  itemName: string;
}

export function ReservationForm({ itemId, itemName }: ReservationFormProps) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true);
    setError(null);

    try {
      formData.append("itemId", itemId);
      await createReservationAction(formData);
      setOpen(false);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Reserve</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve Item</DialogTitle>
          <DialogDescription>
            Reserve &quot;{itemName}&quot; by filling out this form.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="reserverName" className="text-sm font-medium">
              Your Name
            </label>
            <Input
              id="reserverName"
              name="reserverName"
              required
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="reserverEmail" className="text-sm font-medium">
              Your Email
            </label>
            <Input
              id="reserverEmail"
              name="reserverEmail"
              type="email"
              required
              placeholder="john@example.com"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Reserving..." : "Reserve Item"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 