"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { UploadButton } from "~/components/file-upload";

import { createPageAction } from "./actions";

function getErrorMessage(error?: string) {
  if (error === "missing") {
    return "A title, slug és content mezők kötelezők.";
  }

  if (error === "duplicate") {
    return "Ez az URL path (slug) már létezik.";
  }

  return "";
}

export default function NewPageAdminPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error") ?? undefined;
  const errorMessage = getErrorMessage(error);

  return (
    <div className="container py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Create New Page</h1>
        <Button asChild variant="outline">
          <Link href="/admin/pages">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to pages
          </Link>
        </Button>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Page details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPageAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required placeholder="Példa: Hirdetmények" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">URL Path (slug)</Label>
              <Input
                id="slug"
                name="slug"
                required
                placeholder="Példa: onkormanyzat/hirdetmenyek"
              />
              <p className="text-sm text-muted-foreground">
                A kategória/csoport a slug első része lesz (pl. onkormanyzat/...)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="thumbnail">Thumbnail image URL (card image)</Label>
              <Input
                id="thumbnail"
                name="thumbnail"
                placeholder="Példa: /uploads/news/valami.webp"
              />
              <UploadButton
                endpoint="pages"
                onClientUploadComplete={(files) => {
                  const first = files[0];
                  if (!first?.url) return;
                  const input = document.getElementById("thumbnail") as HTMLInputElement | null;
                  if (input) input.value = first.url;
                }}
                onUploadError={(error) => {
                  alert(`Upload Error: ${error.message}`);
                }}
              >
                Upload page image
              </UploadButton>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (Markdown)</Label>
              <Textarea
                id="content"
                name="content"
                required
                className="min-h-[280px]"
                placeholder="# Cím\n\nItt kezdődhet az oldal tartalma."
              />
            </div>

            {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

            <div className="flex justify-end">
              <Button type="submit">Create page</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
