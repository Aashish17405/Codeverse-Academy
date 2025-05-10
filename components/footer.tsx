import Link from "next/link"
import { Facebook, Instagram, Twitter, Linkedin, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CodeVerse Academy
            </h3>
            <p className="text-gray-400 mb-6">Transform your future with cutting-edge tech education.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Facebook size={20} />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Instagram size={20} />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Twitter size={20} />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Linkedin size={20} />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="#features" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Program Highlights
                </Link>
              </li>
              <li>
                <Link href="#curriculum" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Curriculum
                </Link>
              </li>
              <li>
                <Link href="#enrollment" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  Enrollment
                </Link>
              </li>
              <li>
                <Link href="#faq" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <Phone className="h-5 w-5 text-cyan-400 mr-3 mt-0.5" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  +91 12345 42783
                </a>
              </li>
              <li className="flex items-start">
                <Mail className="h-5 w-5 text-cyan-400 mr-3 mt-0.5" />
                <a href="mailto:info@techinstitute.com" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  info@techinstitute.com
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-cyan-400 mr-3 mt-0.5" />
                <span className="text-gray-400 hover:text-cyan-400 transition-colors">Hyderabad, Telangana-123564</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Office Hours</h3>
            <ul className="space-y-3 text-gray-400">
              <li>Monday - Friday: 9:00 AM - 6:00 PM</li>
              <li>Saturday: 10:00 AM - 2:00 PM</li>
              <li>Sunday: Closed</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} CodeVerse Academy. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link href="#" className="text-gray-400 hover:text-cyan-400 text-sm">
                Privacy Policy
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 text-sm">
                Terms of Service
              </Link>
              <Link href="#" className="text-gray-400 hover:text-cyan-400 text-sm">
                Refund Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
