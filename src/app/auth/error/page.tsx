'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '~/components/ui/button';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  let errorMessage = 'Hiba történt a bejelentkezés során.';
  
  if (error === 'CredentialsSignin') {
    errorMessage = 'Hibás email vagy jelszó.';
  } else if (error === 'AccessDenied') {
    errorMessage = 'Nincs jogosultságod az oldal megtekintéséhez.';
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Hiba</CardTitle>
          <CardDescription>
            Bejelentkezési hiba
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">{errorMessage}</p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button asChild variant="ghost">
            <Link href="/">Vissza a főoldalra</Link>
          </Button>
          <Button asChild>
            <Link href="/auth/signin">Újra próbálkozás</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
