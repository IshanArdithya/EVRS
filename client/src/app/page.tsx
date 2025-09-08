import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Shield,
  Syringe,
  QrCode,
  Clock,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* header */}
      <header className="bg-white border-b border-primary/20 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary-DEFAULT" />
              <span className="text-xl font-bold text-primary-DEFAULT">
                EVRS
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline">
                <Link href="/login">Patient Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* hero section */}
      <section className="bg-gradient-to-r from-primary-DEFAULT to-primary-600 text-white py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-balance">
              Electronic Vaccination Record System
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 text-balance max-w-3xl mx-auto">
              Secure, digital vaccination records for Sri Lankan citizens.
              Access your vaccination history anytime, anywhere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                asChild
                size="lg"
                className="bg-white text-primary-DEFAULT hover:bg-primary-50 shadow-lg h-12 text-lg"
              >
                <Link href="/login" className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Access Your Records
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* features section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-DEFAULT">
              Your Health, Digitally Protected
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              EVRS provides secure, instant access to your vaccination records
              with high level security and privacy protection.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-l-4 border-l-primary-DEFAULT hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <QrCode className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <CardTitle className="text-primary-DEFAULT">
                      QR Code Access
                    </CardTitle>
                    <CardDescription>
                      Generate secure QR codes for healthcare providers
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Instantly share your vaccination records with healthcare
                  providers using secure, time-limited QR codes.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-green-600 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Syringe className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-primary-DEFAULT">
                      Real-time Updates
                    </CardTitle>
                    <CardDescription>
                      Automatic record updates after vaccinations
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Your vaccination records are automatically updated when you
                  receive vaccines at registered healthcare facilities.
                </p>
              </CardContent>
            </Card>

            <Card className="border-l-4 border-l-blue-500 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-primary-DEFAULT">
                      24/7 Access
                    </CardTitle>
                    <CardDescription>
                      Access your records anytime, anywhere
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  View your vaccination history, upcoming reminders, and health
                  information whenever you need it.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* how it works section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-DEFAULT">
              How EVRS Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, secure, and efficient vaccination record management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-DEFAULT">
                Login Securely
              </h3>
              <p className="text-muted-foreground">
                Access your account using your Citizen ID and secure password
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-DEFAULT">
                Generate QR Code
              </h3>
              <p className="text-muted-foreground">
                Create a secure QR code to share with your healthcare provider
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto">
                <span className="text-2xl font-bold text-orange-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-primary-DEFAULT">
                Automatic Updates
              </h3>
              <p className="text-muted-foreground">
                Your records are automatically updated after each vaccination
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-r from-primary-50 to-green-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-DEFAULT">
              Ready to Access Your Records?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of Sri Lankan citizens who trust EVRS with their
              vaccination records. Secure, reliable, and always accessible.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button
                asChild
                size="lg"
                className="bg-primary-DEFAULT hover:bg-primary-600 shadow-lg h-12 text-lg"
              >
                <Link href="/login" className="flex items-center">
                  <Shield className="mr-2 h-5 w-5" />
                  Patient Login
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-DEFAULT text-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6" />
                <span className="text-xl font-bold">EVRS</span>
              </div>
              <p className="text-primary-100">
                Electronic Vaccination Record System - Keeping Sri Lanka healthy
                with secure, digital vaccination records.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Quick Links</h3>
              <div className="space-y-2">
                <Link
                  href="/login"
                  className="block text-primary-100 hover:text-white transition-colors"
                >
                  Patient Login
                </Link>
                <Link
                  href="#"
                  className="block text-primary-100 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="#"
                  className="block text-primary-100 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <Link
                  href="#"
                  className="block text-primary-100 hover:text-white transition-colors"
                >
                  Support
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Security & Trust</h3>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-primary-100">Data Encrypted</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-400" />
                  <span className="text-primary-100">Privacy Protected</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-600 mt-8 pt-8 text-center">
            <p className="text-primary-100">
              © 2025 EVRS. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
