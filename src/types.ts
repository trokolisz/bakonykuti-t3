export type Image = {
  id: number
  title: string
  url: string
  description: string | null
  createdAt: Date
  carousel: boolean
}

export type Page = {
  id: string
  title: string
  content: string | null
  slug: string
  lastModified: Date
}

export type News = {
  id: number
  title: string
  thumbnail: string
  content: string | null
  creatorName: string | null
  createdAt: Date
}

export type Event = {
  id: string
  title: string
  description: string | null
  date: Date
  type: string | null
  createdBy: string | null
  createdAt: Date
}
