import { Facebook, Instagram, Mail, Phone } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

import { Button } from "~/components/ui/button"
import { AuthButtons } from "~/components/auth/auth-buttons"

export default function Footer() {


  return (
    <footer className="w-full border-t">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Cím</h3>
            <p>Polgármesteri Hivatal</p>
            <p>Szabadság Utca 41</p>
            <p>8046</p>

          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Phone className="h-6 w-6" />Telefon és Fax</h3>
            <p>+36 22 596-026</p>
            <br />
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><Mail className="h-6 w-6" />Email</h3>
            <p><Link href="mailto:polgarmester@bakonykuti.hu" className="hover:underline">polgarmester@bakonykuti.hu</Link></p>
          </div>
          <div>
            <div className="flex justify-center">
              <AuthButtons />
            </div>
          </div>
            <div>
            <Image
              src="/szechenyi_terv.jpg"
              alt="Széchenyi Terv"
              width={520}
              height={500}
              className="w-full object-contain"
            />
            </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Village Name. All rights reserved.</p>
        </div>

      </div>

    </footer>
  )
}