import DashboardLayout from "@/components/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  MessageCircle,
  Clock,
  MapPin,
  HelpCircle,
  Send,
  ExternalLink,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* header */}
        <div>
          <h1 className="text-2xl font-bold text-primary">Help & Support</h1>
          <p className="text-muted-foreground">
            Get assistance with your health portal and vaccination records
          </p>
        </div>

        {/* emergency contact */}
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="flex items-center text-red-800">
              <AlertCircle className="mr-2 h-5 w-5" />
              Emergency Medical Assistance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-700 mb-4">
              For medical emergencies, call 1990 immediately. This portal is for
              non-emergency health record access only.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button variant="destructive" size="sm">
                <Phone className="mr-2 h-4 w-4" />
                Call 1990
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700"
              >
                EVRS Online
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* contact methods */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Health Authority</CardTitle>
                <CardDescription>
                  Get in touch with our support team
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Phone Support</h4>
                    <p className="text-sm text-muted-foreground">
                      011 123 4567
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mon-Fri: 8AM-6PM, Sat: 9AM-1PM
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Email Support</h4>
                    <p className="text-sm text-muted-foreground">
                      support@evrs.gov.lk
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Response within 24 hours
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 border rounded-lg">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-medium">Live Chat</h4>
                    <p className="text-sm text-muted-foreground">
                      Available during business hours
                    </p>
                    <Button size="sm" className="mt-2">
                      Start Chat
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* office locations */}
            <Card>
              <CardHeader>
                <CardTitle>Office Locations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <MapPin className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">MOH</h4>
                      <p className="text-sm text-muted-foreground">
                        123 street Colombo
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Clock className="inline h-3 w-3 mr-1" />
                        Mon-Fri: 8AM-6PM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* contact form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                We&apos;ll get back to you as soon as possible
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue="FName" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue="LName" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="email@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your question or issue in detail..."
                    rows={5}
                  />
                </div>

                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ section */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  question: "How do I access my vaccination certificate?",
                  answer:
                    "You can download your vaccination certificate from the Vaccinations page by clicking the 'Export PDF' button.",
                },
                {
                  question:
                    "What should I do if my vaccination record is incorrect?",
                  answer:
                    "Please contact our support team immediately with details of the error. We'll investigate and correct any inaccuracies.",
                },
                {
                  question: "How do I schedule a new vaccination appointment?",
                  answer: "///////////",
                },
                {
                  question:
                    "Can I access my records on behalf of a family member?",
                  answer:
                    "You can only access records for dependents under 16 or if you have legal guardianship. Contact support for assistance.",
                },
              ].map((faq, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <h4 className="font-medium flex items-center mb-2">
                    <HelpCircle className="mr-2 h-4 w-4 text-primary" />
                    {faq.question}
                  </h4>
                  <p className="text-sm text-muted-foreground pl-6">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* system status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Portal Access</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Vaccination Records</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">PDF Export</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Operational
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
