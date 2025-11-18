"use client"
import { useState } from "react"
import { formatDate } from "~/lib/utils"
import { type Image as imageType} from "~/server/db/schema"
import RobustImage from "~/components/ui/robust-image"

export default function GalleryPageClient({ 
  images,
  onDelete,
  onUpdate 
}: { 
  images: imageType[]
  onDelete: (id: number) => Promise<void>
  onUpdate: (id: number, data: Partial<imageType>) => Promise<void>
}) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [title, setTitle] = useState("")
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const startEdit = (image: imageType) => {
    setEditingId(image.id)
    setTitle(image.title)
  }

  const handleUpdate = async (image: imageType) => {
    await onUpdate(image.id, { title, gallery: image.gallery })
    setEditingId(null)
  }

  const toggleGallery = async (image: imageType) => {
    await onUpdate(image.id, { gallery: !image.gallery })
  }

  const toggleVisibility = async (image: imageType) => {
    await onUpdate(image.id, { visible: !image.visible })
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this image? This action cannot be undone.')) {
      await onDelete(id)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((img) => (
        <div
          key={img.id}
          className="overflow-hidden bg-secondary p-4 rounded-lg shadow-md"
        >
          <div className="relative aspect-square mb-4">
            <RobustImage
              src={img.url}
              alt={img.title}
              fill
              className="object-cover"
              showErrorDetails={true}
            />
          </div>

          {editingId === img.id ? (
            <div className="space-y-2">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded text-gray-900 bg-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleUpdate(img)}
                  className="px-4 py-2 bg-green-500 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 bg-gray-500rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <h3 className="font-bold">{img.title}</h3>
              <p className="text-sm ">
                Added on {formatDate(img.createdAt)}
              </p>

              {/* Status badges */}
              <div className="flex gap-2 mb-2">
                <span className={`px-2 py-1 text-xs rounded ${
                  img.visible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {img.visible ? 'Public' : 'Hidden'}
                </span>
                {img.gallery && (
                  <span className="px-2 py-1 text-xs rounded bg-blue-100 text-blue-800">
                    Gallery
                  </span>
                )}
                {img.carousel && (
                  <span className="px-2 py-1 text-xs rounded bg-purple-100 text-purple-800">
                    Carousel
                  </span>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => startEdit(img)}
                  className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(img.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                >
                  Delete
                </button>
                <button
                  onClick={() => toggleGallery(img)}
                  className={`px-3 py-1 text-sm rounded ${
                    img.gallery ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                  }`}
                >
                  {img.gallery ? 'In Gallery' : 'Not in Gallery'}
                </button>
                <button
                  onClick={() => toggleVisibility(img)}
                  className={`px-3 py-1 text-sm rounded ${
                    img.visible ? 'bg-orange-500 text-white' : 'bg-green-500 text-white'
                  }`}
                >
                  {img.visible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
