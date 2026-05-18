import Link from 'next/link';
import { Lock } from 'lucide-react';
import { buttonVariants } from '@/components/ui/button';

export function AccessDenied() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background px-4 text-center">
      <div className="flex flex-col items-center gap-4 max-w-md">
        <div className="rounded-full bg-muted p-4">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Access Denied
        </h1>
        <p className="text-sm text-muted-foreground">
          You don&apos;t have permission to access this project, or it may not exist.
        </p>
        <Link href="/editor" className={buttonVariants({ variant: 'default', className: 'mt-4' })}>
          Return to Editor
        </Link>
      </div>
    </div>
  );
}
