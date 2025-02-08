"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Search, FileText, Download, Trash } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import type { Document } from "~/server/db/schema"
import { SignedIn } from "@clerk/nextjs"
import {deleteDocument} from "./action"


const categories = {
  Rendeletek: "Rendeletek",
  Hatarozatok: "Határozatok",
  Jegyzokonyvek: "Jegyzőkönyvek",
  Nyomtatvanyok: "Nyomtatványok",
  Palyazatok: "Pályázatok"
}

export function DocumentArchive({ documents }: { documents: Document[] }) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)

  const years = Array.from(
    new Set(documents.map(doc => doc.date.getFullYear().toString()))
  ).sort((a, b) => b.localeCompare(a))

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = !selectedCategory || doc.category === selectedCategory
    if (selectedYear === "-1") return matchesSearch && matchesCategory
    const matchesYear = !selectedYear || doc.date.getFullYear().toString() === selectedYear
    return matchesSearch && matchesCategory && matchesYear
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Keresés a dokumentumok között..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select
          value={selectedCategory ?? undefined}
          onValueChange={setSelectedCategory}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Kategória" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(categories).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={selectedYear ?? undefined}
          onValueChange={setSelectedYear}
        >
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="Év" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="-1" value="-1">Minden Év</SelectItem>
            {years.map(year => (
              <SelectItem key={year} value={year}>
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4">
        {filteredDocuments.map((doc) => (
          <Card key={doc.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-lg">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {doc.title}
                </div>
              </CardTitle>
              <div className="flex gap-4">
              <SignedIn>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-red-500 hover:bg-red-300"
                  onClick={() => deleteDocument(doc.id)}
                >
                  <Trash className="mr-2 h-4 w-4" />
                  Törlés
                </Button>
              </SignedIn>
                <Button variant="outline" size="sm" asChild>
                <a href={doc.fileUrl} download={doc.title} target="_blank" rel="noopener noreferrer">
                  <Download className="mr-2 h-4 w-4" />
                  Letöltés
                </a>
              </Button>
              
              </div>
             
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
                <div>Kategória: {categories[doc.category as keyof typeof categories]}</div>
         
                <div>Méret: {doc.fileSize}</div>
                <div>Dátum: {doc.date.toLocaleDateString('hu-HU')}</div>
              </div>
            </CardContent>
            
          </Card>
        ))}
      </div>
    </div>
  )
}