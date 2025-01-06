import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";

export default async function Login(props: { searchParams: Promise<Message> }) {
  const searchParams = await props.searchParams;
  return (
    <div className="flex-1 flex flex-col gap-8 items-center mt-12">
      <div className="w-96">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-medium mb-2">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link className="text-foreground font-medium underline" href="/sign-up">
              Sign up
            </Link>
          </p>
        </div>

        <form className="flex flex-col gap-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input name="email" placeholder="you@example.com" required />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="password">Password</Label>
              <Link
                className="text-xs text-foreground underline"
                href="/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
          </div>

          <SubmitButton pendingText="Signing In..." formAction={signInAction}>
            Sign in with Email
          </SubmitButton>
          <FormMessage message={searchParams} />
        </form>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <SocialAuthButtons />
      </div>
    </div>
  );
}
