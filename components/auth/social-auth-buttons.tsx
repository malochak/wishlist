import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Apple, Facebook } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";

async function signInWithProvider(provider: 'google' | 'facebook' | 'apple') {
  'use server'
  
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    if (error) {
      console.error('OAuth Error:', error.message);
      throw error;
    }

    // data.url contains the URL to redirect the user to
    if (data?.url) {
      redirect(data.url);
    }
  } catch (err) {
    console.error('Unexpected error during OAuth:', err);
    throw err;
  }
}

interface SocialAuthButtonsProps {
  className?: string;
}

export function SocialAuthButtons({ className }: SocialAuthButtonsProps) {
  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-background px-2 text-muted-foreground">
          Or continue with
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <form action={signInWithProvider.bind(null, 'google')}>
          <Button
            variant="outline"
            className="w-full"
            type="submit"
          >
            <Image
              src="/google.svg"
              width={16}
              height={16}
              alt="Google"
              className="mr-2"
            />
            Google
          </Button>
        </form>

        <form action={signInWithProvider.bind(null, 'facebook')}>
          <Button
            variant="outline"
            className="w-full"
            type="submit"
          >
            <Facebook className="mr-2 h-4 w-4" />
            Facebook
          </Button>
        </form>

        <form action={signInWithProvider.bind(null, 'apple')}>
          <Button
            variant="outline"
            className="w-full"
            type="submit"
          >
            <Apple className="mr-2 h-4 w-4" />
            Apple
          </Button>
        </form>
      </div>
    </div>
  );
}
