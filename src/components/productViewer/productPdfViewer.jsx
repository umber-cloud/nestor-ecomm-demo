"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText,
  ExternalLink,
  Download,
  AlertCircle,
  Loader2,
  Maximize2,
  Minimize2,
  X,
  ZoomIn,
  ZoomOut,
  RefreshCw,
} from "lucide-react";

const PDFJS_PRIMARY_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
const PDFJS_FALLBACK_CDN = "https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.min.js";
const PDFJS_WORKER_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

/**
 * Loads Mozilla PDF.js dynamically into the browser window with CDN fallback.
 * Bypasses npm dependencies completely to meet strict zero-library requirements.
 */
function loadPdfJsEngine() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Window is not available"));
  }

  if (window.pdfjsLib) {
    return Promise.resolve(window.pdfjsLib);
  }

  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[data-pdfjs="true"]`);
    if (existing) {
      if (window.pdfjsLib) {
        resolve(window.pdfjsLib);
      } else {
        existing.addEventListener("load", () => resolve(window.pdfjsLib));
        existing.addEventListener("error", reject);
      }
      return;
    }

    const script = document.createElement("script");
    script.setAttribute("data-pdfjs", "true");
    script.src = PDFJS_PRIMARY_CDN;
    script.async = true;

    script.onload = () => {
      if (window.pdfjsLib) {
        try {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER_CDN;
        } catch {
          // Worker fallback to fake-worker handled automatically
        }
        resolve(window.pdfjsLib);
      } else {
        reject(new Error("pdfjsLib not defined"));
      }
    };

    script.onerror = () => {
      // Fallback to unpkg CDN if cdnjs fails
      const fallbackScript = document.createElement("script");
      fallbackScript.setAttribute("data-pdfjs", "true");
      fallbackScript.src = PDFJS_FALLBACK_CDN;
      fallbackScript.async = true;
      fallbackScript.onload = () => {
        if (window.pdfjsLib) {
          resolve(window.pdfjsLib);
        } else {
          reject(new Error("Fallback PDF.js failed"));
        }
      };
      fallbackScript.onerror = () => reject(new Error("Failed to load PDF.js from all CDNs"));
      document.head.appendChild(fallbackScript);
    };

    document.head.appendChild(script);
  });
}

/**
 * Converts a Base64 string into a Uint8Array byte array for PDF.js parsing
 */
function base64ToUint8Array(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Individual Page Canvas Renderer with high-DPI crisp scaling
 */
function PdfPageCanvas({ doc, pageNum, containerWidth, zoom = 1.0 }) {
  const canvasRef = useRef(null);
  const renderTaskRef = useRef(null);

  useEffect(() => {
    let isCancelled = false;

    async function renderPage() {
      if (!doc || !canvasRef.current || !containerWidth) return;

      try {
        if (renderTaskRef.current) {
          renderTaskRef.current.cancel();
        }

        const page = await doc.getPage(pageNum);
        if (isCancelled) return;

        const unscaledViewport = page.getViewport({ scale: 1.0 });
        const targetWidth = Math.max(containerWidth - 28, 240);
        const fitScale = (targetWidth / unscaledViewport.width) * zoom;
        const dpr = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;
        const viewport = page.getViewport({ scale: fitScale * dpr });

        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);
        canvas.style.width = `${Math.floor(viewport.width / dpr)}px`;
        canvas.style.height = `${Math.floor(viewport.height / dpr)}px`;

        const ctx = canvas.getContext("2d", { alpha: false });
        const renderTask = page.render({ canvasContext: ctx, viewport });
        renderTaskRef.current = renderTask;
        await renderTask.promise;
      } catch (err) {
        if (err?.name !== "RenderingCancelledException") {
          console.error(`[PDF Viewer] Page ${pageNum} render error:`, err);
        }
      }
    }

    renderPage();

    return () => {
      isCancelled = true;
      if (renderTaskRef.current) {
        try {
          renderTaskRef.current.cancel();
        } catch {
          // Render cancel is safe to ignore
        }
      }
    };
  }, [doc, pageNum, containerWidth, zoom]);

  return (
    <div className="relative flex flex-col items-center bg-white shadow-xl rounded-none overflow-hidden my-2 border border-neutral-300">
      <canvas ref={canvasRef} className="block" />
      <div className="w-full py-1 px-3 bg-neutral-100 border-t border-neutral-200 text-center font-mono text-[9px] font-bold text-neutral-500 uppercase tracking-widest select-none">
        PAGE {pageNum}
      </div>
    </div>
  );
}

/**
 * Embedded High-Definition PDF Viewer Component
 * Features:
 * - Direct Base64 streaming to bypass IDM interception
 * - Clean top HUD without cluttering page info/zoom controls
 * - Continuous vertical multi-page scrolling
 * - Full-screen expanded modal view option
 */
export default function ProductPdfViewer({ url }) {
  const [loading, setLoading] = useState(true);
  const [loadingStage, setLoadingStage] = useState("INITIALIZING...");
  const [errorMsg, setErrorMsg] = useState(null);
  const [numPages, setNumPages] = useState(0);
  const [blobUrl, setBlobUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalZoom, setModalZoom] = useState(1.0);
  const [containerWidth, setContainerWidth] = useState(400);
  const [modalContainerWidth, setModalContainerWidth] = useState(800);

  const containerRef = useRef(null);
  const modalContainerRef = useRef(null);
  const pdfDocRef = useRef(null);

  /**
   * Loads document bytes via Base64 JSON API to prevent IDM download interception
   */
  const loadDocument = useCallback(async () => {
    if (!url) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setErrorMsg(null);
    setLoadingStage("CONNECTING TO DOCUMENT STREAM...");

    try {
      // Fetch PDF as Base64 JSON to bypass IDM extension
      const previewEndpoint = `/api/pdf-preview?url=${encodeURIComponent(url)}`;
      const res = await fetch(previewEndpoint);
      if (!res.ok) {
        throw new Error(`Failed to retrieve document stream: HTTP ${res.status}`);
      }

      const payload = await res.json();
      if (!payload.base64) {
        throw new Error("Invalid document stream payload received");
      }

      setLoadingStage("INITIALIZING PDF ENGINE...");
      const pdfjs = await loadPdfJsEngine();

      setLoadingStage("PARSING DOCUMENT DATA...");
      const pdfBytes = base64ToUint8Array(payload.base64);

      // Local blob URL for external tab and download buttons
      const localBlob = new Blob([pdfBytes], { type: "application/pdf" });
      const localUrl = URL.createObjectURL(localBlob);
      setBlobUrl(localUrl);

      // Parse document in memory with PDF.js
      const loadingTask = pdfjs.getDocument({
        data: pdfBytes,
        cMapUrl: "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/cmaps/",
        cMapPacked: true,
      });

      const doc = await loadingTask.promise;
      pdfDocRef.current = doc;
      setNumPages(doc.numPages || 1);
      setLoading(false);
    } catch (err) {
      console.error("[PDF Viewer] Initialization failed:", err);
      setErrorMsg(err.message || "Failed to render document preview");
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    loadDocument();

    return () => {
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [loadDocument]);

  // Track container width for responsive canvas scaling
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
      if (modalContainerRef.current) {
        setModalContainerWidth(modalContainerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [loading, isModalOpen]);

  // Lock body scroll and listen for Escape key when modal is open
  useEffect(() => {
    if (!isModalOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsModalOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isModalOpen]);

  if (!url) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-card text-center text-muted-foreground font-mono text-xs">
        <FileText className="w-10 h-10 mb-2 opacity-50" />
        <p className="font-bold uppercase tracking-wider">NO PDF SPECIFICATION AVAILABLE</p>
      </div>
    );
  }

  const actionUrl = blobUrl || `/api/pdf-proxy?url=${encodeURIComponent(url)}`;

  return (
    <div className="relative w-full h-full flex flex-col bg-neutral-950 border border-border select-none overflow-hidden">
      {/* Top HUD Control Strip (Clean: no pages info or zoom clutter) */}
      <div className="h-10 px-3 bg-neutral-900 border-b border-border/80 flex items-center justify-between gap-2 shrink-0 z-10">
        {/* Left: Badge & Title */}
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          <span className="px-1.5 py-0.5 rounded-xs bg-red-600 text-white font-mono text-[10px] font-bold tracking-wider uppercase shrink-0">
            PDF
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider text-neutral-200 truncate font-bold">
            USER MANUAL {"//"} SPEC SHEET
          </span>
        </div>

        {/* Right: Expand Modal & Direct Actions */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-white bg-primary/80 hover:bg-primary transition-colors rounded-xs shadow-xs"
            title="Expand to Fullscreen Modal"
          >
            <Maximize2 className="w-3 h-3" />
            <span className="hidden xs:inline">Expand</span>
          </button>

          <a
            href={actionUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/10 transition-colors rounded-xs"
            title="Open in new window"
          >
            <span>Open</span>
            <ExternalLink className="w-3 h-3" />
          </a>

          <a
            href={actionUrl}
            download="user-manual.pdf"
            className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-primary hover:text-accent hover:bg-primary/10 transition-colors rounded-xs font-bold uppercase tracking-wider"
            title="Download PDF"
          >
            <span>Download</span>
            <Download className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Main Document Scrollable Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full h-full bg-neutral-900/95 overflow-y-auto overflow-x-hidden flex flex-col items-center justify-start p-3 sm:p-4 scrollbar-thin scrollbar-thumb-neutral-700"
      >
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-neutral-300 gap-3 bg-neutral-950/80 backdrop-blur-xs">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="font-mono text-xs font-bold uppercase tracking-widest text-neutral-300">
              {loadingStage}
            </p>
          </div>
        ) : errorMsg ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-neutral-300 gap-3 bg-neutral-950">
            <AlertCircle className="w-10 h-10 text-red-500" />
            <p className="font-mono text-xs max-w-xs leading-relaxed font-bold uppercase text-red-400">
              {errorMsg}
            </p>
            <button
              type="button"
              onClick={loadDocument}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-neutral-800 text-neutral-200 border border-neutral-700 font-mono text-xs font-bold uppercase tracking-wider hover:bg-neutral-700 transition-colors mt-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center">
            {/* Render all pages vertically so user can scroll down seamlessly */}
            {Array.from({ length: numPages }).map((_, index) => (
              <PdfPageCanvas
                key={index + 1}
                doc={pdfDocRef.current}
                pageNum={index + 1}
                containerWidth={containerWidth}
                zoom={1.0}
              />
            ))}
          </div>
        )}
      </div>

      {/* BIGGER MODAL VIEW DIALOG */}
      {isModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 md:p-8 animate-in fade-in-0 duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="relative w-full max-w-5xl h-[92vh] bg-neutral-950 border border-primary/50 flex flex-col shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Header Strip */}
            <div className="h-12 px-4 bg-neutral-900 border-b border-border flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="px-2 py-0.5 rounded-xs bg-red-600 text-white font-mono text-xs font-bold uppercase tracking-wider">
                  PDF
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-neutral-200 truncate font-bold">
                  USER MANUAL {"//"} FULL DOCUMENT PREVIEW ({numPages} PAGES)
                </span>
              </div>

              {/* Modal Controls */}
              <div className="flex items-center gap-2 shrink-0">
                {/* Zoom inside modal */}
                <div className="hidden sm:flex items-center gap-1 bg-neutral-950/80 px-2 py-1 rounded-xs border border-white/10">
                  <button
                    type="button"
                    onClick={() => setModalZoom((z) => Math.max(Number((z - 0.2).toFixed(1)), 0.6))}
                    disabled={modalZoom <= 0.6}
                    className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalZoom(1.0)}
                    className="font-mono text-[10px] text-neutral-300 px-1 font-semibold hover:text-white"
                    title="Reset Zoom"
                  >
                    {Math.round(modalZoom * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalZoom((z) => Math.min(Number((z + 0.2).toFixed(1)), 2.5))}
                    disabled={modalZoom >= 2.5}
                    className="p-0.5 text-neutral-400 hover:text-white disabled:opacity-30 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                <a
                  href={actionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-white/10 transition-colors rounded-xs"
                  title="Open in new window"
                >
                  <span>Open</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={actionUrl}
                  download="user-manual.pdf"
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-primary hover:text-accent hover:bg-primary/10 transition-colors rounded-xs font-bold uppercase tracking-wider"
                  title="Download PDF"
                >
                  <span>Download</span>
                  <Download className="w-3.5 h-3.5" />
                </a>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-neutral-400 hover:text-white hover:bg-red-950/60 transition-colors rounded-xs ml-1"
                  title="Close Modal (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Scrollable Document Body */}
            <div
              ref={modalContainerRef}
              className="flex-1 w-full h-full bg-neutral-900/95 overflow-y-auto overflow-x-auto flex flex-col items-center p-4 sm:p-6 scrollbar-thin scrollbar-thumb-neutral-700"
            >
              <div className="w-full flex flex-col items-center max-w-4xl">
                {Array.from({ length: numPages }).map((_, index) => (
                  <PdfPageCanvas
                    key={`modal-${index + 1}`}
                    doc={pdfDocRef.current}
                    pageNum={index + 1}
                    containerWidth={modalContainerWidth}
                    zoom={modalZoom}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
