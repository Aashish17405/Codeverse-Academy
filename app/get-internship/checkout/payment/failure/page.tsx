"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { XCircle, RefreshCw, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function PaymentFailurePage() {
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
      error: urlParams.get("error"),
      error_Message: urlParams.get("error_Message"),
    }
    setPaymentDetails(details)
  }, [])

  return (
    <div className="min-h-screen bg-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Payment Failed</h1>
          <p className="text-gray-300">
            Unfortunately, your payment could not be processed. Don't worry, you can try again.
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
                    <span className="text-gray-300">Amount:</span>
                    <span className="text-orange-400 font-bold">₹{paymentDetails.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Payment Status:</span>
                    <span className="text-red-400 font-semibold">Failed</span>
                  </div>
                  {paymentDetails.error_Message && (
                    <div className="flex justify-between">
                      <span className="text-gray-300">Error:</span>
                      <span className="text-red-400 text-sm">{paymentDetails.error_Message}</span>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Common Reasons */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white">Common Reasons for Payment Failure</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-gray-300 text-sm space-y-2">
                <p>• Insufficient balance in your account</p>
                <p>• Incorrect card details or expired card</p>
                <p>• Network connectivity issues</p>
                <p>• Bank server temporarily down</p>
                <p>• Transaction limit exceeded</p>
                <p>• Card not enabled for online transactions</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What to do next */}
        <Card className="bg-slate-700 border-slate-600 mt-8">
          <CardHeader>
            <CardTitle className="text-white">What Should You Do Next?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">🔄 Try Again</h3>
                <p className="text-gray-300 text-sm">
                  Most payment failures are temporary. Please try the payment again with the same or different payment
                  method.
                </p>
              </div>
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">💳 Check Your Card</h3>
                <p className="text-gray-300 text-sm">
                  Ensure your card is enabled for online transactions and has sufficient balance.
                </p>
              </div>
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">🏦 Contact Your Bank</h3>
                <p className="text-gray-300 text-sm">
                  If the problem persists, contact your bank to ensure there are no restrictions on your account.
                </p>
              </div>
              <div>
                <h3 className="text-orange-400 font-semibold mb-2">📞 Contact Support</h3>
                <p className="text-gray-300 text-sm">
                  If you continue to face issues, our support team is here to help you complete your registration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Link href="/checkout">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Payment Again
            </Button>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-slate-600 text-white hover:bg-slate-700 bg-transparent">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 p-6 bg-slate-700 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Need Immediate Help?</h3>
          <p className="text-gray-300 text-sm mb-4">
            Our support team is available to help you complete your workshop registration:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
            <a href="mailto:support@targethub.com" className="text-orange-400 hover:text-orange-300">
              📧 support@targethub.com
            </a>
            <a href="tel:+919876543210" className="text-orange-400 hover:text-orange-300">
              📞 +91 98765 43210
            </a>
            <a href="https://wa.me/919876543210" className="text-orange-400 hover:text-orange-300">
              💬 WhatsApp Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
