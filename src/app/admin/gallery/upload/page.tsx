'use client';

import { UploadButton } from "~/utils/uploadthing";

import React from 'react';

export default function UploadPage() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Upload Gallery Images</h1>

            <UploadButton
                className="bg-primary text-foreground font-semibold py-3 px-6 rounded-md hover:bg-muted active:bg-muted transition-colors duration-200 shadow-sm"
                endpoint="bakonykutiGalleryImageUploader"
                
                onClientUploadComplete={(res) => {
                    // Do something with the response
                    console.log("Files: ", res);
                    alert(("Upload Completed: " + res[0]?.url));
                }}
                onUploadError={(error: Error) => {
                    // Do something with the error.
                    alert(`ERROR! ${error.message}`);
                }}
            />

        </div>
    );
}