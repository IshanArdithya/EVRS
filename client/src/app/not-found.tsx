import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <FileQuestion className="w-24 h-24 mx-auto text-gray-400 mb-4" />
            <h1 className="text-6xl font-bold text-gray-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 mb-8">
              Sorry, we couldn&apos;t find the page you&apos;re looking for. The
              page might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>

            <Button variant="outline" asChild className="w-full bg-transparent">
              <Link href="javascript:history.back()">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Link>
            </Button>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need help? Contact our{" "}
              <Link href="/support" className="text-blue-600 hover:underline">
                support team
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
