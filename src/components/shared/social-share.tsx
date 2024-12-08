"use client"

import { Button } from "~/components/ui/button"
import { Facebook, Twitter, Linkedin, Link as LinkIcon } from "lucide-react"
import { useToast } from "~/hooks/use-toast"

export function SocialShare({ title, url }: { title: string; url: string }) {
  const { toast } = useToast()
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  const copyLink = async () => {
    await navigator.clipboard.writeText(url)
    toast({
      title: "Link másolva!",
      description: "A link a vágólapra került.",
    })
  }

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}
      >
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Megosztás Facebookon</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`, '_blank')}
      >
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Megosztás Twitteren</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => window.open(`https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`, '_blank')}
      >
        <Linkedin className="h-4 w-4" />
        <span className="sr-only">Megosztás LinkedInen</span>
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={copyLink}
      >
        <LinkIcon className="h-4 w-4" />
        <span className="sr-only">Link másolása</span>
      </Button>
    </div>
  )
}