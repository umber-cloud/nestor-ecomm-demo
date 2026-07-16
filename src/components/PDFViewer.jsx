"use client";
import { FileX2, FileText } from "lucide-react";

export function PDFViewer({ url }) {
  // If no PDF URL provided, show a polished "No documentation available" state
  if (!url) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center justify-center gap-4 py-20 px-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-center">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-gray-100">
          <FileX2 className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-700">No Documentation Available</h3>
          <p className="text-sm text-gray-400 mt-1">
            This product does not have any documentation attached.
          </p>
        </div>
      </div>
    );
  }

  // Stream the PDF through a proxy to avoid CORS issues
  // The ADN media URL is: https://adn.umbercloud.io/api/vi/<domainId>/<collectionId>/<assetId>/dev/generic
  // We proxy it through /api/pdf-proxy?url=<encoded_url>
  const proxyUrl = `/api/pdf-proxy?url=${encodeURIComponent(url)}`;

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-3">
      {/* Header bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
        <FileText className="w-4 h-4 text-red-500 flex-shrink-0" />
        <span className="text-sm font-medium text-gray-600 truncate">Product Documentation</span>
        <a
          href={proxyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-auto text-xs text-blue-600 hover:underline flex-shrink-0"
        >
          Open in new tab ↗
        </a>
      </div>

      {/* PDF embed */}
      <object
        data={proxyUrl}
        type="application/pdf"
        width="100%"
        height="600px"
        className="rounded-lg border border-gray-200 shadow-sm"
      >
        {/* Fallback for browsers that can't embed PDFs */}
        <div className="w-full flex flex-col items-center justify-center gap-3 py-16 text-center">
          <FileText className="w-10 h-10 text-gray-400" />
          <p className="text-gray-600 text-sm">
            Your browser cannot display this PDF inline.
          </p>
          <a
            href={proxyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            Download PDF
          </a>
        </div>
      </object>
    </div>
  );
}
