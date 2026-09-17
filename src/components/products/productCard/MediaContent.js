// components/MediaContent.jsx
import React, { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
// Set PDF worker path
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

function MediaContent({ url, mimeType, alt }) {
    const [numPages, setNumPages] = useState(null);

    // Handle PDF loading
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
    }

    // Render different media based on MIME type
    if (mimeType?.startsWith('image/')) {
        return <img src={url} alt={alt || 'Product image'} className="w-full h-auto object-cover" />;
    }
    if (mimeType?.startsWith('audio/')) {
        return (
            <audio controls className="w-full mt-2">
                <source src={url} type={mimeType} />
                Your browser does not support audio playback.
            </audio>
        );
    }

    // For documents like Word, Excel, etc.
    else if (
        mimeType === 'application/msword' ||
        mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
        return (
            <div className="document-preview border p-4 text-center">
                <p>Word Document</p>
                <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
                    View Document
                </a>
            </div>
        );
    }
    else if (mimeType?.startsWith('video/')) {
        return (
            <video
                controls
                className="w-full h-auto"
                preload="metadata"
            >
                <source src={url} type={mimeType} />
                Your browser does not support video playback.
            </video>
        );
    }

    else if (mimeType === 'application/pdf') {
        return (
            <div className="pdf-container w-full">
                <Document
                    file={url}
                    onLoadSuccess={onDocumentLoadSuccess}
                    className="w-full"
                >
                    <Page pageNumber={1} width={300} />
                </Document>
                {numPages && <p className="text-xs text-gray-500">Page 1 of {numPages}</p>}
            </div>
        );
    }

    // Fallback for unsupported media types
    return <div className="p-4 border rounded bg-gray-100">Unsupported media type: {mimeType}</div>;
}

export default MediaContent;
