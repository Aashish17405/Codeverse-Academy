"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { X, Download, Sparkles, ZapOff } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { createPortal } from "react-dom";

export function DemoTicket({
  ticketData,
  onClose,
}: {
  ticketData: any;
  onClose: () => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [hasDownloaded, setHasDownloaded] = useState(false);
  const [qrData, setQrData] = useState<string | null>(null);
  const courseName = ticketData.course === "regular" ? "Regular" : "Fast-Track";

  useEffect(() => {
    handleGenerate();
  }, [ticketData]);

  useEffect(() => {
    if (qrData && !hasDownloaded) {
      downloadTicket();
      setHasDownloaded(true);
    }
  }, [qrData, hasDownloaded]);

  const downloadTicket = async () => {
    if (!ticketRef.current) return;
    try {
      setDownloading(true);

      // Just make minimal adjustments for download - don't change UI appearance
      const ticketClone = ticketRef.current.cloneNode(true) as HTMLElement;
      ticketClone.style.position = "absolute";
      ticketClone.style.left = "-9999px";
      document.body.appendChild(ticketClone);

      // Create a completely new ticket ID element with proper styling for download
      const ticketIdElement = ticketClone.querySelector(
        ".inline-block.bg-white\\/10"
      );
      if (ticketIdElement && ticketIdElement.parentNode) {
        // Get the ticket ID text
        const ticketIdText = ticketIdElement.textContent;

        // Create a new element with explicit styling
        const newTicketIdElement = document.createElement("div");
        newTicketIdElement.textContent = ticketIdText;
        newTicketIdElement.style.marginTop = "0px";
        newTicketIdElement.style.display = "inline-block";
        newTicketIdElement.style.padding = "2px 4px";
        newTicketIdElement.style.paddingTop = "2px";
        newTicketIdElement.style.fontFamily = "monospace";
        newTicketIdElement.style.fontSize = "0.75rem";
        newTicketIdElement.style.color = "white";
        newTicketIdElement.style.whiteSpace = "nowrap";
        newTicketIdElement.style.overflow = "visible";
        newTicketIdElement.style.textAlign = "center";

        // Replace the original element with our new one
        ticketIdElement.parentNode.replaceChild(
          newTicketIdElement,
          ticketIdElement
        );
      }

      // Fix email display if needed (but preserve UI)
      const emailElement = ticketClone.querySelector("[title]");
      if (emailElement && emailElement.textContent?.includes("...")) {
        emailElement.textContent = emailElement.getAttribute("title");
      }

      // Ensure the parent container of ticket ID is properly styled
      const headerContainer = ticketClone.querySelector(
        ".relative.z-10.mb-4.flex.items-center"
      );
      if (headerContainer) {
        (headerContainer as HTMLElement).style.display = "flex";
        (headerContainer as HTMLElement).style.alignItems = "center";
        (headerContainer as HTMLElement).style.width = "100%";
      }

      // Also ensure the container holding the ticket ID has proper styling
      const ticketIdParent = ticketClone.querySelector(
        ".flex.flex-col.items-start"
      );
      if (ticketIdParent) {
        (ticketIdParent as HTMLElement).style.display = "flex";
        (ticketIdParent as HTMLElement).style.flexDirection = "column";
        (ticketIdParent as HTMLElement).style.alignItems = "flex-start";
        (ticketIdParent as HTMLElement).style.width = "100%";
        (ticketIdParent as HTMLElement).style.minWidth = "0";
        (ticketIdParent as HTMLElement).style.overflow = "visible";
      }

      // Process the image with minimal changes
      const canvas = await html2canvas(ticketClone, {
        scale: 3,
        backgroundColor: null,
        useCORS: true,
        allowTaint: true,
        logging: false,
      });

      // Clean up
      document.body.removeChild(ticketClone);

      // Download the image
      const image = canvas.toDataURL("image/png", 1.0);
      const link = document.createElement("a");
      link.href = image;
      link.download = `CodeVerse-ai-ticket-${ticketData.ticketId.substring(
        0,
        8
      )}.png`;
      link.click();
      setDownloading(false);
    } catch (error) {
      console.error("Download error:", error);
      setDownloading(false);
      alert("Download failed!");
    }
  };

  const handleGenerate = () => {
    const dataToEncode = JSON.stringify({
      ticketId: ticketData.ticketId,
      name: ticketData.name,
      email: ticketData.email,
      Date: ticketData.date,
      status: ticketData.status,
    });
    setQrData(dataToEncode);
  };

  useEffect(() => {
    handleGenerate();
  }, [ticketData]);

  return typeof window === "object"
    ? createPortal(
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-lg flex items-center justify-center z-[9999] p-3"
          style={{ isolation: "isolate" }}
        >
          {/* Party mode elements removed */}

          <div className="w-full max-w-sm overflow-hidden bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 rounded-xl shadow-[0_10px_40px_rgba(0,0,255,0.3)]">
            {/* Controls */}
            {/* Close button (right) */}
            <div className="absolute top-3 right-3 z-20">
              <button
                onClick={onClose}
                className="text-white/70 hover:text-white bg-black/20 hover:bg-black/30 p-1.5 rounded-full transition-all"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            {/* Ticket Content */}
            <div ref={ticketRef} className="relative p-4">
              {/* Holographic background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-purple-400/10 to-blue-400/10"></div>

              {/* Header */}
              <div className="relative z-10 mb-4 flex items-center">
                <div className="mr-3">
                  <div className="w-14 h-14 rounded-md flex items-center justify-center shadow-glow overflow-hidden border-2 border-blue-300/30">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="w-14 h-14 object-contain rounded transition-transform duration-300 hover:scale-110"
                    />
                  </div>
                </div>
                <div className="flex flex-col items-start min-w-0">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-blue-200 mb-0">
                    CodeVerse Academy
                  </h3>
                  <h2 className="text-xl font-extrabold text-white">
                    {courseName} Class
                  </h2>
                  <div className="mt-1 inline-block bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-full text-xs font-mono text-white border border-white/20 whitespace-nowrap overflow-hidden text-ellipsis max-w-full">
                    #{ticketData.ticketId}
                  </div>
                </div>
              </div>

              {/* Main Info Grid */}
              <div className="relative z-10 grid grid-cols-2 gap-3 mb-4">
                <div className="bg-black/30 backdrop-blur-md rounded-lg p-2.5 border border-white/10">
                  <p className="text-xs text-blue-200 mb-1">DATE</p>
                  <p className="text-sm font-bold text-white">
                    {format(ticketData.date, "MMM d")}
                  </p>
                  <p className="text-xs text-white/80">
                    {format(ticketData.date, "yyyy")}
                  </p>
                </div>
                <div className="bg-black/30 backdrop-blur-md rounded-lg p-2.5 border border-white/10">
                  <p className="text-xs text-blue-200 mb-1">TIME</p>
                  <p className="text-sm font-bold text-white">
                    {ticketData.timeSlot}
                  </p>
                  <p className="text-xs text-white/80">Check-in 15mins early</p>
                </div>
                <div className="bg-black/30 backdrop-blur-md rounded-lg p-2.5 border border-white/10 col-span-2">
                  <p className="text-xs text-blue-200 mb-1">ATTENDEE</p>
                  <p className="text-sm font-bold text-white">
                    {ticketData.name}
                  </p>
                  <p
                    className="text-xs text-white/80 break-words"
                    title={ticketData.email}
                    style={{ wordBreak: "break-all" }}
                  >
                    {ticketData.email}
                  </p>
                </div>
              </div>

              {/* QR Code */}
              <div className="relative z-10 flex justify-center mb-3">
                <div className="bg-white p-2 rounded-lg shadow-glow transition-all duration-300">
                  <QRCodeSVG
                    value={qrData || ""}
                    size={110}
                    level="H"
                    includeMargin={false}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                </div>
              </div>

              {/* Venue Info */}
              <div className="relative z-10 mt-3 bg-black/30 backdrop-blur-md rounded-lg p-2.5 border border-white/10">
                <p className="text-xs text-blue-200 mb-1 text-center">VENUE</p>
                <p className="text-sm text-white text-center leading-tight">
                  Suman Tower, 3rd Floor, Above ICICI Bank,
                  <br />
                  Adityapur 1, Jamshedpur
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="bg-black/40 backdrop-blur-md border-t border-white/10 p-3">
              <button
                onClick={downloadTicket}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-colors"
              >
                {downloading ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Download size={16} />
                    <span>Download Ticket</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* CSS for animations and effects */}
          <style jsx global>{`
            .shadow-glow {
              box-shadow: 0 0 15px rgba(59, 130, 246, 0.5);
            }

            /* Ensure the ticket modal is always on top */
            body:has(.fixed.z-\[9999\]) {
              overflow: hidden;
              position: relative;
            }
          `}</style>
        </div>,
        document.body
      )
    : null;
}
