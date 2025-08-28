"use client";

import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { X, Download } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { createPortal } from "react-dom";

export function DemoTicket({
  ticketData,
  setTicketUrl,
  onClose,
}: {
  ticketData: any;
  onClose: () => void;
  setTicketUrl: React.Dispatch<React.SetStateAction<string | null>>;
}) {
  const [downloading, setDownloading] = useState(false);
  const ticketRef = useRef<HTMLDivElement>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [hasAutoDownloaded, setHasAutoDownloaded] = useState(false);
  const [shouldDownloadNow, setShouldDownloadNow] = useState(false);
  const [isDownloadMode, setIsDownloadMode] = useState(false);

  useEffect(() => {
    const dataToEncode = JSON.stringify({
      ticketId: ticketData.ticketId,
      name: ticketData.name,
      email: ticketData.email,
      Date: ticketData.date,
      status: ticketData.status,
    });
    setQrData(dataToEncode);
  }, [ticketData]);

  useEffect(() => {
    if (!hasAutoDownloaded && ticketRef.current && qrData) {
      const timer = setTimeout(() => {
        downloadTicket();
        setHasAutoDownloaded(true);
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [hasAutoDownloaded, qrData]);

  const downloadTicket = async () => {
    setIsDownloadMode(true);
    setShouldDownloadNow(true);
  };

  useEffect(() => {
    const capture = async () => {
      if (!ticketRef.current) return;
      try {
        setDownloading(true);
        await new Promise((resolve) => setTimeout(resolve, 200));
        await document.fonts.ready;

        const canvas = await html2canvas(ticketRef.current, {
          scale: 5, // Increased scale for higher resolution
          useCORS: true,
          backgroundColor: null,
          logging: false,
          allowTaint: true,
          imageTimeout: 0, // No timeout for images
        });

        // Use maximum quality for PNG
        const image = canvas.toDataURL("image/png");

        // Save the ticket URL for potential email sending
        setTicketUrl(image);

        // Create a download link with a more descriptive filename
        const link = document.createElement("a");
        link.href = image;
        // Create a more descriptive filename with the person's name and date
        const formattedDate = format(ticketData.date, "dd-MMM-yyyy");
        const sanitizedName = ticketData.name
          .replace(/[^a-zA-Z0-9]/g, "-")
          .substring(0, 20);
        link.download = `Codeverse-Golden-Ticket-${sanitizedName}-${formattedDate}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Send the ticket to the server for email
        await sendTicketToServer(image);
      } catch (err) {
        console.error("Capture failed:", err);
      } finally {
        setIsDownloadMode(false);
        setShouldDownloadNow(false);
        setDownloading(false);
      }
    };

    if (shouldDownloadNow) {
      capture();
    }
  }, [shouldDownloadNow]);

  // Function to optimize image before sending - improved for higher quality
  const optimizeImage = async (dataUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        // Resize to a larger size while maintaining aspect ratio for better quality
        const maxWidth = 1200; // Increased from 800
        const maxHeight = 900; // Increased from 600
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }

        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Enable image smoothing for better quality
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, width, height);
        }

        // Use PNG for better quality, especially for the QR code
        const optimizedDataUrl = canvas.toDataURL("image/png", 1.0);
        resolve(optimizedDataUrl);
      };
      img.src = dataUrl;
    });
  };

  // Function to check if ticket already has an image URL
  const checkTicketImageStatus = async (): Promise<boolean> => {
    try {
      // Check if the ticket already has an image URL
      const response = await fetch(`/api/tickets/${ticketData.ticketId}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.ticket?.qrCodeUrl && data.ticket.qrCodeUrl !== "") {
          // console.log("Ticket already has an image URL, skipping upload");
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error checking ticket status:", error);
      // If we can't check the status, assume we need to upload
      // This ensures we don't skip the upload due to a network error
      return false;
    }
  };

  // Function to send the ticket to the server
  const sendTicketToServer = async (imageDataUrl: string) => {
    try {
      // First check if the ticket already has an image URL
      const hasImage = await checkTicketImageStatus();
      if (hasImage) {
        // console.log("Ticket already has an image, skipping upload");
        return;
      }

      // console.log("Optimizing image before sending...");
      const optimizedImage = await optimizeImage(imageDataUrl);
      console.log(
        "🖼️ Image optimized for upload, size:",
        optimizedImage.length
      );
      console.log("🚀 Sending ticket to server with image...");

      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 second timeout

      try {
        // Send the ticket image to the new API endpoint
        const serverResponse = await fetch("/api/sendTicketEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticketImage: optimizedImage,
            email: ticketData.email,
            name: ticketData.name,
            phone: ticketData.phone, // Add phone number
            sessionId: ticketData.sessionId,
            ticketId: ticketData.ticketId,
            courseName: ticketData.course || "Demo Session",
          }),
          signal: controller.signal,
        });

        clearTimeout(timeoutId); // Clear the timeout if request completes

        if (!serverResponse.ok) {
          const errorData = await serverResponse.json();
          console.error("❌ Server response error:", errorData);
          throw new Error(errorData.error || "Failed to send ticket to server");
        }

        const responseData = await serverResponse.json();
        console.log("✅ Ticket sent to server successfully");
        console.log("📧 Server confirmed image URL:", responseData.imageUrl);
      } catch (fetchError: any) {
        if (fetchError.name === "AbortError") {
          // console.log("Request timed out");
          return;
        }
        throw fetchError; // Re-throw other errors
      }
    } catch (error) {
      console.error("Error sending ticket to server:", error);
      // Show a message to the user that the email might be delayed
      alert(
        "Your ticket has been created, but there might be a delay in receiving the email. Please check your inbox later."
      );
    }
  };

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted
    ? createPortal(
        <div className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex flex-col items-center justify-center p-4">
          <div
            ref={ticketRef}
            className="relative w-[850px] max-w-full overflow-visible rounded-lg shadow-2xl bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-black flex items-center p-4"
          >
            <div className="w-1/3 py-4 px-5 border-r-2 border-black/20 flex flex-col items-center justify-between">
              <div className="w-full flex justify-center mb-2">
                <img
                  src="/logo.webp"
                  className="w-16 h-16 rounded-full border-2 border-black/20 object-cover"
                  alt="Codeverse Logo"
                  crossOrigin="anonymous"
                />
              </div>

              <div className="flex justify-center items-center p-2 rounded-lg border-2 border-black/30 bg-white overflow-visible">
                <QRCodeSVG
                  value={qrData || ""}
                  size={120}
                  level="H"
                  className="block"
                />
              </div>
              <div className="text-center mt-3 w-full break-words">
                <p className="text-base font-semibold">{ticketData.name}</p>
                <p className="text-xs max-w-[90%] mx-auto break-all leading-snug">
                  {ticketData.email}
                </p>
                <p className="text-xs opacity-75 mt-0.5">
                  #{ticketData.ticketId}
                </p>
              </div>
            </div>

            <div className="w-2/3 py-4 px-5 flex flex-col justify-between">
              <div className="w-full text-center px-6">
                {!isDownloadMode && (
                  <div className="flex items-center justify-center gap-2 w-full">
                    <div className="h-px bg-black flex-1" />
                    <div className="bg-black text-yellow-400 px-4 py-1 rounded-sm font-bold text-sm inline-block">
                      DEMO SESSION
                    </div>
                    <div className="h-px bg-black flex-1" />
                  </div>
                )}

                {isDownloadMode && (
                  <div className="text-sm font-bold uppercase text-black mb-2">
                    DEMO SESSION
                  </div>
                )}

                <h1 className="text-3xl mt-3 font-bold tracking-wide text-black">
                  GOLDEN TICKET
                </h1>
              </div>

              <div className="text-center mb-3">
                <p className="text-lg font-bold">
                  {format(ticketData.date, "EEEE do MMMM").toUpperCase()} •{" "}
                  {ticketData.timeSlot.toUpperCase()}
                </p>
                <p className="text-base">
                  <span className="font-semibold">
                    FOR CODEVERSE ACADEMY DEMO SESSION
                  </span>
                </p>
                <div className="mt-2 p-2 bg-black/10 rounded-lg text-sm">
                  <p className="font-semibold">VENUE</p>
                  <p>Suman Tower, 2nd Floor, Above HDFC Bank</p>
                  <p>Adityapur 1, Hyderabad 831013</p>
                </div>
              </div>

              <div className="italic text-xs text-center border-t border-black/20 pt-2">
                The first step toward mastering technology starts with this
                ticket!
              </div>
            </div>

            <div className="absolute top-0 left-0 w-full h-2 bg-black/20"></div>
            <div className="absolute bottom-0 left-0 w-full h-2 bg-black/20"></div>
          </div>

          <div className="flex gap-4 mt-6 w-full max-w-3xl">
            <button
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
              aria-label="Close"
            >
              <X size={18} />
              Close Ticket
            </button>

            <button
              onClick={downloadTicket}
              disabled={downloading}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-lg transition flex items-center justify-center gap-2"
            >
              {downloading ? (
                "Preparing Download..."
              ) : (
                <>
                  <Download size={18} />
                  Download Golden Ticket
                </>
              )}
            </button>
          </div>
        </div>,
        document.body
      )
    : null;
}
