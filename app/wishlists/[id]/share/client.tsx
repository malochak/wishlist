'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Copy, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface SharePageClientProps {
  id: string;
  publicUrl: string;
}

export function SharePageClient({ id, publicUrl }: SharePageClientProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "The wishlist link has been copied to your clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try copying the link manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-8">
          <Link href={`/wishlists/${id}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Wishlist
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Share Your Wishlist</CardTitle>
            <CardDescription>
              Share this link with friends and family to let them view and reserve items from your wishlist.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input value={publicUrl} readOnly />
              <Button onClick={copyToClipboard} variant="secondary">
                <Copy className="h-4 w-4 mr-2" />
                {copied ? "Copied!" : "Copy"}
              </Button>
            </div>
            <Button asChild variant="outline" className="w-full">
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Public View
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 