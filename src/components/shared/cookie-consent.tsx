"use client"

import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent")
    if (!consent) {
      setShow(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "true")
    setShow(false)
  }

  if (!show) return null

  return (
    <Card className="fixed bottom-4 right-4 z-50 max-w-md">
      <CardHeader>
        <CardTitle>Cookie beállítások</CardTitle>
        <CardDescription>
          Weboldalunk cookie-kat használ a jobb felhasználói élmény érdekében.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          A weboldal használatával Ön elfogadja a cookie-k használatát.
        </p>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setShow(false)}>
          Később
        </Button>
        <Button onClick={handleAccept}>
          Elfogadom
        </Button>
      </CardFooter>
    </Card>
  )
}