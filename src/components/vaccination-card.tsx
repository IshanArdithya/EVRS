"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Syringe, Calendar, MapPin, User, Hash, AlertTriangle, FileText, ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

interface Vaccination {
  id: number
  name: string
  date: string
  batchNumber: string
  location: string
  administrator: string
  nextDue: string | null
  status: string
  sideEffects: string
  notes: string
}

interface VaccinationCardProps {
  vaccination: Vaccination
}

export default function VaccinationCard({ vaccination }: VaccinationCardProps) {
  const [expanded, setExpanded] = useState(false)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const isUpcoming = vaccination.nextDue && new Date(vaccination.nextDue) > new Date()

  return (
    <Card className="transition-all duration-200 hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Syringe className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">
                <Link
                  href={`/dashboard/vaccinations/${vaccination.id}`}
                  className="hover:text-primary transition-colors"
                >
                  {vaccination.name}
                </Link>
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(vaccination.date)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge
              variant="secondary"
              className={`${
                vaccination.status === "Complete" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {vaccination.status}
            </Badge>
            {isUpcoming && (
              <Badge variant="outline" className="border-orange-300 text-orange-700">
                Due: {formatDate(vaccination.nextDue!)}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span>{vaccination.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span>{vaccination.administrator}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span>Batch: {vaccination.batchNumber}</span>
          </div>
          {vaccination.nextDue && (
            <div className="flex items-center space-x-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Next due: {formatDate(vaccination.nextDue)}</span>
            </div>
          )}
        </div>

        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="w-full justify-between">
          <span>View Details</span>
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>

        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div>
              <h4 className="font-medium text-sm flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                Side Effects
              </h4>
              <p className="text-sm text-muted-foreground pl-6">{vaccination.sideEffects}</p>
            </div>

            <div>
              <h4 className="font-medium text-sm flex items-center mb-2">
                <FileText className="h-4 w-4 mr-2 text-primary" />
                Clinical Notes
              </h4>
              <p className="text-sm text-muted-foreground pl-6">{vaccination.notes}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
