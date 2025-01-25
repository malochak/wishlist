'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Copy, ExternalLink, Globe, Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toggleWishlistVisibilityAction } from "@/app/wishlists/actions";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SharePageClientProps {
  id: string;
  publicUrl: string;
  isPublic: boolean;
}

export function SharePageClient({ id, publicUrl, isPublic: initialIsPublic }: SharePageClientProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [isPublic, setIsPublic] = useState(initialIsPublic);

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

  const handleVisibilityToggle = async () => {
    const formData = new FormData();
    formData.append("wishlistId", id);
    formData.append("isPublic", (!isPublic).toString());
    
    try {
      await toggleWishlistVisibilityAction(formData);
      setIsPublic(!isPublic);
      toast({
        title: isPublic ? "Wishlist is now private" : "Wishlist is now public",
        description: isPublic 
          ? "Only you can see this wishlist now" 
          : "Anyone with the link can view this wishlist",
      });
    } catch (error) {
      toast({
        title: "Failed to update visibility",
        description: "Please try again later.",
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
              Control visibility and share your wishlist with friends and family.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
              <div className="flex flex-col space-y-1">
                <Label htmlFor="public-toggle">Public Access</Label>
                <span className="text-sm text-muted-foreground">
                  {isPublic ? (
                    <div className="flex items-center gap-1">
                      <Globe className="h-4 w-4" />
                      Anyone with the link can view
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Lock className="h-4 w-4" />
                      Only you can view
                    </div>
                  )}
                </span>
              </div>
              <Switch
                id="public-toggle"
                checked={isPublic}
                onCheckedChange={handleVisibilityToggle}
              />
            </div>

            {isPublic && (
              <div className="space-y-4">
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 