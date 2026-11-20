import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md space-y-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Page not found</h1>
      <p className="text-muted-foreground">
        This listing may have been removed after it closed, or the link is wrong.
      </p>
      <Button nativeButton={false} render={<Link href="/apprenticeships" />}>
        Browse apprenticeships
      </Button>
    </div>
  );
}
