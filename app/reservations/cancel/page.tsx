'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { cancelReservationAction } from "@/app/wishlists/actions";

export default function CancelReservationPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  if (!token) {
    return (
      <div className="container py-8">
        <Card className="max-w-md mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Invalid Request</h1>
          <p className="text-muted-foreground">
            No cancellation token provided. Please check your cancellation link.
          </p>
        </Card>
      </div>
    );
  }

  async function handleCancellation() {
    if (!token) return; // TypeScript check
    
    setStatus("loading");
    setError(null);

    try {
      await cancelReservationAction(token);
      setStatus("success");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStatus("error");
    }
  }

  return (
    <div className="container py-8">
      <Card className="max-w-md mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Cancel Reservation</h1>
        
        {status === "success" ? (
          <div className="space-y-4">
            <p className="text-green-600">
              Your reservation has been successfully cancelled.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Are you sure you want to cancel your reservation?
            </p>

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div className="flex justify-end gap-2">
              <Button
                onClick={handleCancellation}
                disabled={status === "loading"}
              >
                {status === "loading" ? "Cancelling..." : "Yes, Cancel Reservation"}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
} 