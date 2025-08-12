"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Clock, Video, Download } from "lucide-react"
import Link from "next/link"

export default function PaymentSuccessPage() {
  const [paymentDetails, setPaymentDetails] = useState<any>(null)

  useEffect(() => {
    // Get payment details from URL parameters (sent by PayU)
    const urlParams = new URLSearchParams(window.location.search)
    const details = {
      txnid: urlParams.get("txnid"),
      amount: urlParams.get("amount"),
      firstname: urlParams.get("firstname"),
      email: urlParams.get("email"),
      status: urlParams.get("status"),
      payuMoneyId: urlParams.get("payuMoneyId"),
    }
    setPaymentDetails(details)
  }, [])

  return (
    <div className="min-h-screen bg-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
          <p className="text-gray-300">
            Congratulations! You've successfully registered for the Crore Champion Secrets Workshop.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Payment Details */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Payment Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentDetails && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Transaction ID:</span>
                    <span className="text-white font-mono text-sm">{paymentDetails.txnid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Amount Paid:</span>
                    <span className="text-orange-400 font-bold">₹{paymentDetails.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Payment Status:</span>
                    <span className="text-green-400 font-semibold">Success</span>
                  </div>
                  {paymentDetails.payuMoneyId && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">PayU Money ID:</span>
                      <span className="text-white font-mono text-sm">{paymentDetails.payuMoneyId}</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Workshop Details */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Workshop Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-white font-semibold">3 Day Live Workshop</p>
                  <p className="text-gray-300 text-sm">(7th Mon | 8th Tue | 9th Wed) JULY 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-white font-semibold">Time</p>
                  <p className="text-gray-300 text-sm">7 PM - 9PM IST</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Video className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-white font-semibold">Mode</p>
                  <p className="text-gray-300 text-sm">Zoom Live (English)</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Next Steps */}
        <Card className="bg-slate-700 border-slate-600 mt-8">
          <CardHeader>
            <CardTitle className="text-white">What Happens Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">📧 Check Your Email</h3>
                <p className="text-gray-300 text-sm">
                  You'll receive a confirmation email with your workshop access details and Zoom link within 5 minutes.
                </p>
              </div>
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">📱 WhatsApp Group</h3>
                <p className="text-gray-300 text-sm">
                  You'll be added to our exclusive WhatsApp group for workshop updates and networking.
                </p>
              </div>
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">📚 Pre-Workshop Material</h3>
                <p className="text-gray-300 text-sm">
                  Access your pre-workshop preparation materials and bonus content in your email.
                </p>
              </div>
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">🎯 Workshop Reminder</h3>
                <p className="text-gray-300 text-sm">
                  We'll send you reminders before each workshop session so you don't miss out.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button className="bg-orange-500 hover:bg-orange-600 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Receipt
          </Button>
          <Link href="/">
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 bg-transparent">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 p-6 bg-slate-700 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Need Help?</h3>
          <p className="text-gray-300 text-sm mb-4">
            If you have any questions or didn't receive your confirmation email, please contact us:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a href="mailto:support@targethub.com" className="text-orange-400 hover:text-orange-300">
              📧 support@targethub.com
            </a>
            <a href="tel:+919876543210" className="text-orange-400 hover:text-orange-300">
              📞 +91 98765 43210
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
