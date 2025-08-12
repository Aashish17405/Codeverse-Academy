"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Video, Shield, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function CheckoutPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const workshopDetails = {
    title: "3 Day Workshop for Digital Coaches - Crore Champion Secrets",
    originalPrice: 1999,
    discountedPrice: 49,
    savings: 1950,
    date: "(7th Mon | 8th Tue | 9th Wed) JULY 2025",
    time: "7 PM - 9PM IST",
    mode: "Zoom Live (English)",
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Please enter a valid 10-digit phone number"
    }
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.state.trim()) newErrors.state = "State is required"
    if (!formData.zipcode.trim()) newErrors.zipcode = "Zipcode is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const generateTransactionId = () => {
    return `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)

    try {
      const txnid = generateTransactionId()

      // PayU configuration
      const payuData = {
        key: process.env.NEXT_PUBLIC_PAYU_KEY || "YOUR_PAYU_KEY", // Replace with your PayU key
        txnid: txnid,
        amount: workshopDetails.discountedPrice.toString(),
        productinfo: workshopDetails.title,
        firstname: formData.firstName,
        lastname: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address1: formData.address,
        city: formData.city,
        state: formData.state,
        zipcode: formData.zipcode,
        country: "India",
        udf1: "workshop_registration",
        udf2: "",
        udf3: "",
        udf4: "",
        udf5: "",
        pg: "",
        surl: `${window.location.origin}/get-internship/checkout/payment/success`,
        furl: `${window.location.origin}/get-internship/checkout/payment/failure`,
        curl: `${window.location.origin}/get-internship/checkout/payment/cancel`,
      }

      // Generate hash on server side (you'll need to implement this)
      const response = await fetch("/api/generate-payu-hash", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payuData),
      })

      const { hash } = await response.json()

      // Create form and submit to PayU
      const form = document.createElement("form")
      form.method = "POST"
      form.action = process.env.NEXT_PUBLIC_PAYU_URL || "https://test.payu.in/_payment" // Use https://secure.payu.in/_payment for production

      // Add all PayU parameters to form
      Object.entries({ ...payuData, hash }).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = value as string
        form.appendChild(input)
      })

      document.body.appendChild(form)
      form.submit()
    } catch (error) {
      console.error("Payment initiation failed:", error)
      setIsProcessing(false)
      alert("Payment initiation failed. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-slate-800 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Workshop Details
          </Link>
          <h1 className="text-3xl font-bold text-white">Complete Your Registration</h1>
          <p className="text-gray-300 mt-2">Secure your spot in the Crore Champion Secrets Workshop</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="lg:order-2">
            <Card className="bg-slate-700 border-slate-600 sticky top-8">
              <CardHeader>
                <CardTitle className="text-white">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Workshop Details */}
                <div>
                  <h3 className="font-semibold text-orange-400 mb-3">{workshopDetails.title}</h3>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span>{workshopDetails.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Clock className="w-4 h-4 text-orange-400" />
                      <span>{workshopDetails.time}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-300">
                      <Video className="w-4 h-4 text-orange-400" />
                      <span>{workshopDetails.mode}</span>
                    </div>
                  </div>
                </div>

                <Separator className="bg-slate-600" />

                {/* Pricing */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Workshop Fee</span>
                    <span className="text-gray-400 line-through">₹{workshopDetails.originalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Special Discount</span>
                    <span className="text-green-400">-₹{workshopDetails.savings}</span>
                  </div>
                  <Separator className="bg-slate-600" />
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span className="text-white">Total Amount</span>
                    <span className="text-orange-400">₹{workshopDetails.discountedPrice}</span>
                  </div>
                </div>

                {/* Guarantee Badge */}
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="font-semibold text-green-400">100% Money Back Guarantee</span>
                  </div>
                  <p className="text-sm text-gray-300">
                    If you don't like what you learn, get your money back - no questions asked!
                  </p>
                </div>

                {/* What's Included */}
                <div>
                  <h4 className="font-semibold text-white mb-3">What's Included:</h4>
                  <ul className="space-y-2 text-sm text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>3 Days Live Interactive Workshop</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>Access to Workshop Recordings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>Exclusive Crore Champion Frameworks</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>Q&A Sessions with Manjunath</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-400 mt-1">✓</span>
                      <span>Digital Marketing Templates</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div className="lg:order-1">
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Billing Information</CardTitle>
                <p className="text-gray-300 text-sm">Please fill in your details to complete the registration</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePayment} className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-white">
                        First Name *
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="bg-slate-600 border-slate-500 text-white mt-1"
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-white">
                        Last Name *
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="bg-slate-600 border-slate-500 text-white mt-1"
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>}
                    </div>
                  </div>

                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email" className="text-white">
                        Email Address *
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="bg-slate-600 border-slate-500 text-white mt-1"
                        placeholder="Enter your email"
                      />
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-white">
                        Phone Number *
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="bg-slate-600 border-slate-500 text-white mt-1"
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && <p className="text-red-400 text-sm mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Address Information */}
                  <div>
                    <Label htmlFor="address" className="text-white">
                      Address *
                    </Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="bg-slate-600 border-slate-500 text-white mt-1"
                      placeholder="Enter your full address"
                    />
                    {errors.address && <p className="text-red-400 text-sm mt-1">{errors.address}</p>}
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-white">
                        City *
                      </Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="bg-slate-600 border-slate-500 text-white mt-1"
                        placeholder="City"
                      />
                      {errors.city && <p className="text-red-400 text-sm mt-1">{errors.city}</p>}
                    </div>
                    <div>
                      <Label htmlFor="state" className="text-white">
                        State *
                      </Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="bg-slate-600 border-slate-500 text-white mt-1"
                        placeholder="State"
                      />
                      {errors.state && <p className="text-red-400 text-sm mt-1">{errors.state}</p>}
                    </div>
                    <div>
                      <Label htmlFor="zipcode" className="text-white">
                        Zipcode *
                      </Label>
                      <Input
                        id="zipcode"
                        name="zipcode"
                        value={formData.zipcode}
                        onChange={handleInputChange}
                        className="bg-slate-600 border-slate-500 text-white mt-1"
                        placeholder="Zipcode"
                      />
                      {errors.zipcode && <p className="text-red-400 text-sm mt-1">{errors.zipcode}</p>}
                    </div>
                  </div>

                  {/* Payment Button */}
                  <div className="pt-6">
                    <Button
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-6 rounded-xl"
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                          Processing...
                        </div>
                      ) : (
                        `Complete Payment - ₹${workshopDetails.discountedPrice}`
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-400">
                      <Shield className="w-4 h-4" />
                      <span>Secured by PayU - Your payment information is safe</span>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
