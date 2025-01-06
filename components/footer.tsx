import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full border-t border-t-foreground/10">
      <div className="container mx-auto py-4">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Wishlist. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
