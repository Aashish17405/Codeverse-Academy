"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";

interface Ticket {
  id: string;
  status: string;
  user?: { name: string; email: string };
  session?: { date: string };
}

export default function StatusManagement() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [scanning, setScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [scannedTicket, setScannedTicket] = useState<Ticket | null>(null);

  useEffect(() => {
    QrScanner.hasCamera().then((hasCamera) => {
      if (!hasCamera) {
        toast.error("No camera found on this device or it's blocked.", {
          position: "top-center",
        });
      }
    });
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const qrScanner = new QrScanner(
      videoRef.current,
      (result) => {
        // console.log("QR Scan Result:", result.data);
        handleScan(result.data);
        qrScanner.stop();
        setScanning(false);
      },
      {
        returnDetailedScanResult: true,
        highlightScanRegion: true,
      }
    );

    setScanner(qrScanner);

    return () => {
      qrScanner.destroy();
    };
  }, []);

  const handleScan = async (scanned: string) => {
    setIsLoading(true);
    try {
      const parsed = JSON.parse(scanned);
      const ticketId = parsed.ticketId || scanned;

      const res = await fetch(`/api/admin/tickets/${ticketId}`);
      const data = await res.json();

      setScannedTicket(data);
      toast.success("Ticket fetched successfully", { position: "top-center" });
    } catch {
      try {
        const res = await fetch(`/api/admin/tickets/${scanned}`);
        const data = await res.json();
        setScannedTicket(data);
        toast.success("Ticket fetched (fallback)", { position: "top-center" });
      } catch {
        toast.error("Invalid QR or fetch failed", { position: "top-center" });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!scannedTicket) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/tickets/${scannedTicket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();
      toast.success("Status updated", { position: "top-center" });

      // Reset for next scan
      setScannedTicket(null);
    } catch {
      toast.error("Failed to update status", { position: "top-center" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="bg-gray-900 border-gray-800 shadow-lg">
      <CardHeader className="px-4 sm:px-6">
        <CardTitle className="text-lg sm:text-xl text-cyan-400">
          Status Management
        </CardTitle>
        <CardDescription className="text-sm sm:text-base text-gray-400">
          Update the status of demo sessions and manage attendee information.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 sm:px-6">
        <div className="w-full flex justify-center">
          <video
            ref={videoRef}
            className="w-full max-w-[320px] aspect-square rounded border border-gray-700 shadow-md object-cover"
          />
        </div>

        {/* <div className="flex justify-center">
          <Button
            onClick={() => {
              if (scanning) {
                scanner?.stop();
                setScanning(false);
              } else {
                scanner?.start();
                setScanning(true);
              }
            }}
            disabled={isLoading}
            className={`${
              scanning
                ? "bg-red-600 hover:bg-red-700"
                : "bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            }`}
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : scanning ? (
              "Stop Scanner"
            ) : (
              "Start Scanner"
            )}
          </Button>
        </div> */}

        {!scannedTicket ? (
          <div className="flex justify-center">
            <Button
              onClick={() => {
                scanner?.start();
                setScanning(true);
              }}
              disabled={isLoading}
              className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
              ) : (
                "📷 Start Scan"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm sm:text-base bg-gray-800 p-4 rounded-lg border border-gray-700">
              <p>
                <strong className="text-cyan-400">🎟 Ticket ID:</strong>{" "}
                {scannedTicket.id}
              </p>
              <p>
                <strong className="text-cyan-400">📌 Status:</strong>{" "}
                {scannedTicket.status}
              </p>
              <p>
                <strong className="text-cyan-400">👤 User:</strong>{" "}
                {scannedTicket.user?.name} ({scannedTicket.user?.email})
              </p>
              <p>
                <strong className="text-cyan-400">📅 Session:</strong>{" "}
                {scannedTicket.session?.date}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
              <Button
                onClick={() => handleStatusUpdate("ATTENDED")}
                className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm sm:text-base py-2 sm:py-3"
                disabled={isUpdating}
              >
                ✅ Mark as Attended
              </Button>
              <Button
                onClick={() => handleStatusUpdate("NOT_ATTENDED")}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-sm sm:text-base py-2 sm:py-3"
                disabled={isUpdating}
              >
                ❌ Mark as Not Attended
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
