
import React from 'react';
import { Metadata } from 'next'
import UploadForm from './UploadForm'
import { getExistingGalleryImages } from '~/server/api/gallery' // You'll need to create this
import { Card, CardHeader, CardTitle, CardDescription } from "~/components/ui/card"

// Force dynamic rendering to ensure we get real database data
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Gallery Upload - Admin',
    description: 'Upload and manage gallery images',
}

export default async function UploadPage() {
    // Fetch existing gallery stats - this runs on the server
    const stats = await getExistingGalleryImages()
    
    return (
        <div className="container mx-auto p-4 space-y-6">
            <h1 className="text-2xl font-bold">Gallery Upload</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Total Images</CardTitle>
                        <CardDescription>{stats.totalImages}</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Carousel Images</CardTitle>
                        <CardDescription>{stats.carouselImages}</CardDescription>
                    </CardHeader>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Storage Used</CardTitle>
                        <CardDescription>{stats.storageUsed}MB</CardDescription>
                    </CardHeader>
                </Card>
            </div>

            <UploadForm  />
        </div>
    )
}
