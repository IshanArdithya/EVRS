import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <Card className="w-full max-w-md shadow-lg rounded-lg overflow-hidden">
        <CardContent className="p-8 text-center bg-white">
          <div className="mb-8">
            <FileQuestion className="w-20 h-20 mx-auto text-gray-500 mb-6" />
            <h1 className="text-5xl font-extrabold text-gray-800 mb-3 tracking-tight">
              404
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-5">
              Page Not Found
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
              {
                "Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong address."
              }
            </p>
          </div>

          <div className="space-y-4">
            <Button asChild className="w-full py-2.5 text-base font-medium">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Go to Homepage
              </Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="w-full py-2.5 text-base font-medium bg-transparent"
            >
              <Link href="javascript:history.back()">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Link>
            </Button>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Need further assistance? Please contact our{" "}
              <Link
                href="/dashboard/support"
                className="text-blue-600 hover:underline font-medium"
              >
                support team
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
