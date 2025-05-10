"use client";

import { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { position } from "html2canvas/dist/types/css/property-descriptors/position";

interface Ticket {
  id: string;
  status: string;
  user?: { name: string; email: string };
  session?: { date: string };
}

export default function StatusManagement() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [scanner, setScanner] = useState<QrScanner | null>(null);
  const [scanning, setScanning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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
        console.log("QR Scan Result:", result.data);
        handleScan(result.data);
        qrScanner.stop();
        setScanning(false);
      },
      { returnDetailedScanResult: true }
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

      setTicket(data);
      console.log("Fetched Ticket Details:", data);
      toast.success("Ticket fetched successfully", { position: "top-center" });
    } catch (err) {
      try {
        // Fallback: Treat scanned as raw ticketId
        const res = await fetch(`/api/admin/tickets/${scanned}`);
        const data = await res.json();
        setTicket(data);
        console.log("Fetched Ticket Details (fallback):", data);
        toast.success("Ticket fetched via fallback", {
          position: "top-center",
        });
      } catch (innerErr) {
        toast.error("Invalid QR code or failed fetch", {
          position: "top-center",
        });
        console.error("Fallback scan error:", innerErr);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus: string) => {
    if (!ticket) return;

    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/tickets/${ticket.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error();
      const updated = await res.json();
      setTicket(updated);
      console.log(`Updated ticket to status "${newStatus}"`, updated);
      toast.success("Status updated", { position: "top-center" });
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status", { position: "top-center" });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl sm:text-2xl text-center">
          Status Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="w-full flex justify-center">
          <video
            ref={videoRef}
            className="w-full sm:w-[400px] aspect-video rounded border shadow"
          />
        </div>

        <div className="flex justify-center">
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
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
            ) : scanning ? (
              "Stop Scanner"
            ) : (
              "Start Scanner"
            )}
          </Button>
        </div>

        {ticket && (
          <div className="space-y-2 text-sm sm:text-base">
            <div>
              <strong>🎟️ Ticket ID:</strong> {ticket.id}
            </div>
            <div>
              <strong>📌 Status:</strong> {ticket.status}
            </div>
            <div>
              <strong>👤 User:</strong> {ticket.user?.name} (
              {ticket.user?.email})
            </div>
            <div>
              <strong>📅 Session:</strong> {ticket.session?.date}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button
                onClick={() => handleStatusUpdate("ATTENDED")}
                variant="default"
                className="w-full sm:w-auto"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  "✅ Mark as Attended"
                )}
              </Button>
              <Button
                onClick={() => handleStatusUpdate("NOT_ATTENDED")}
                variant="destructive"
                className="w-full sm:w-auto"
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                ) : (
                  "❌ Mark as Not Attended"
                )}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
