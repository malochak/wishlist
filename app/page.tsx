import { redirect } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { Button } from "@/components/ui/button"
import { GiftIcon } from "lucide-react"

export default async function Index() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/protected/dashboard")
  }

  return (
    <div className="flex-1 flex flex-col gap-20 items-center">
      <div className="flex flex-col gap-16 items-center">
        <div className="flex flex-col items-center gap-8 max-w-2xl text-center px-8 pt-16">
          <GiftIcon className="h-16 w-16 text-primary" />
          <h1 className="text-4xl lg:text-6xl font-bold">
            Create Your Perfect Wishlist
          </h1>
          <p className="text-xl text-muted-foreground">
            Share your wishes with friends and family. Create a wishlist, add
            items, and share it with your loved ones.
          </p>
          <Button size="lg" asChild>
            <a href="/auth/sign-in">Get Started</a>
          </Button>
        </div>
      </div>
    </div>
  )
}
