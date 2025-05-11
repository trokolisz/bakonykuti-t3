'use client';

import { Button } from "~/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "~/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export function SignInButton() {
  return (
    <Button variant="outline" asChild className="w-full">
      <Link href="/auth/signin">
        Bejelentkezés
      </Link>
    </Button>
  );
}

export function UserButton() {
  const { data: session } = useSession();
  
  if (!session?.user) return null;
  
  const initials = session.user.name
    ? session.user.name.split(' ').map(n => n[0]).join('')
    : session.user.email?.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={session.user.image || ''} alt={session.user.name || ''} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{session.user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {session.user.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard">
              <User className="mr-2 h-4 w-4" />
              <span>Admin Dashboard</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/' })}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Kijelentkezés</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AuthButtons() {
  const { data: session, status } = useSession();
  
  if (status === 'loading') {
    return <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />;
  }
  
  return session ? <UserButton /> : <SignInButton />;
}
