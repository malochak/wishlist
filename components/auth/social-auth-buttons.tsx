import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Image from "next/image";

async function signInWithProvider(provider: 'google' | 'facebook') {
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
    <div className={cn("flex flex-col space-y-3", className)}>
      <form action={signInWithProvider.bind(null, 'google')}>
        <button
          type="submit"
          className="w-full h-10 px-6 flex items-center justify-center gap-3 rounded-lg border hover:border-slate-400 hover:shadow transition duration-300"
        >
          <Image 
            width={20}
            height={20}
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            loading="lazy"
            alt="google logo"
            className="h-5 w-5"
          />
          <span>Google</span>
        </button>
      </form>

      <form action={signInWithProvider.bind(null, 'facebook')}>
        <button
          type="submit"
          className="w-full h-10 px-6 flex items-center justify-center gap-3 rounded-lg border hover:border-slate-400 hover:shadow transition duration-300"
        >
          <Image 
            width={20}
            height={20}
            src="https://www.svgrepo.com/show/475647/facebook-color.svg"
            loading="lazy"
            alt="facebook logo"
            className="h-5 w-5"
          />
          <span>Facebook</span>
        </button>
      </form>
    </div>
  );
}
