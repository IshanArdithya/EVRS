"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Syringe,
  Calendar,
  MapPin,
  User,
  Hash,
  AlertTriangle,
  FileText,
  ChevronDown,
  ChevronUp,
  Hospital,
} from "lucide-react";
import { useState } from "react";
import { Vaccination } from "@/types";
import { format } from "date-fns";

interface VaccinationCardProps {
  vaccination: Vaccination;
}

export default function VaccinationCard({ vaccination }: VaccinationCardProps) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return format(date, "dd MMMM yyyy");
    } catch {
      return dateString;
    }
  };

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
                {/* <Link
                  href={`/dashboard/vaccinations/${vaccination.vaccinationId}`}
                  className="hover:text-primary transition-colors"
                ></Link> */}
                {vaccination.vaccineName}
              </CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                {formatDate(vaccination.date)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Completed
            </Badge>
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
            {vaccination.administratorRole === "hcp" ? (
              <User className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Hospital className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{vaccination.administrator}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span>Batch: {vaccination.batchNumber}</span>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="w-full justify-between"
        >
          <span>View Details</span>
          {expanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>

        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            <div>
              <h4 className="font-medium text-sm flex items-center mb-2">
                <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
                Possible Side Effects
              </h4>
              <p className="text-sm text-muted-foreground pl-6">
                {vaccination.sideEffects}
              </p>
            </div>

            {vaccination.notes?.trim() && (
              <div>
                <h4 className="font-medium text-sm flex items-center mb-2">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  Clinical Notes
                </h4>
                <p className="text-sm text-muted-foreground pl-6">
                  {vaccination.notes}
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
