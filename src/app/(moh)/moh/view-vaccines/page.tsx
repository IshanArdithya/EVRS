/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MOHLayout } from "@/components/moh-layout";

// mock vaccine data
const allVaccines = [
  {
    id: "V001",
    name: "BCG Vaccine",
    description: "Tuberculosis prevention",
    sideEffects:
      "Common: Mild soreness at injection site, small scar formation. Rare: Severe local reaction, lymph node swelling.",
  },
  {
    id: "V002",
    name: "Hepatitis B Vaccine",
    description: "Hepatitis B prevention",
    sideEffects:
      "Common: Mild pain at injection site, fatigue. Rare: Allergic reaction, fever.",
  },
  {
    id: "V003",
    name: "DPT Vaccine",
    description: "Diphtheria, Pertussis, Tetanus prevention",
    sideEffects:
      "Common: Redness and swelling at injection site, mild fever. Rare: High fever, seizures.",
  },
  {
    id: "V004",
    name: "Polio Vaccine",
    description: "Poliomyelitis prevention",
    sideEffects:
      "Common: Mild soreness at injection site. Rare: Allergic reaction.",
  },
  {
    id: "V005",
    name: "MMR Vaccine",
    description: "Measles, Mumps, Rubella prevention",
    sideEffects:
      "Common: Mild fever, rash. Rare: High fever, joint pain, temporary low platelet count.",
  },
  {
    id: "V006",
    name: "COVID-19 Vaccine",
    description: "COVID-19 prevention",
    sideEffects:
      "Common: Pain at injection site, fatigue, headache, muscle pain. Rare: Severe allergic reaction.",
  },
  {
    id: "V007",
    name: "Influenza Vaccine",
    description: "Seasonal flu prevention",
    sideEffects:
      "Common: Mild soreness at injection site, low-grade fever. Rare: Severe allergic reaction.",
  },
  {
    id: "V008",
    name: "Pneumococcal Vaccine",
    description: "Pneumococcal disease prevention",
    sideEffects:
      "Common: Redness and pain at injection site, mild fever. Rare: Severe local reaction.",
  },
  {
    id: "V009",
    name: "Rotavirus Vaccine",
    description: "Rotavirus gastroenteritis prevention",
    sideEffects:
      "Common: Mild diarrhea, vomiting. Rare: Intussusception (very rare).",
  },
  {
    id: "V010",
    name: "Varicella Vaccine",
    description: "Chickenpox prevention",
    sideEffects:
      "Common: Mild rash, fever. Rare: Severe rash, pneumonia in immunocompromised individuals.",
  },
  {
    id: "V011",
    name: "HPV Vaccine",
    description: "Human Papillomavirus prevention",
    sideEffects:
      "Common: Pain at injection site, headache, fatigue. Rare: Fainting, severe allergic reaction.",
  },
  {
    id: "V012",
    name: "Meningococcal Vaccine",
    description: "Meningococcal disease prevention",
    sideEffects:
      "Common: Redness and pain at injection site, mild fever. Rare: Severe allergic reaction.",
  },
];

export default function ViewVaccines() {
  const [vaccines, setVaccines] = useState<typeof allVaccines>([]);
  const [currentPage, setCurrentPage] = useState(1);

  // filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // view details dialog
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState<any>(null);

  const { toast } = useToast();

  const itemsPerPage = 8;
  const totalPages = Math.ceil(vaccines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentVaccines = vaccines.slice(startIndex, endIndex);

  // apply filters
  const handleApplyFilter = () => {
    setIsFilterLoading(true);

    // simulate API call delay
    setTimeout(() => {
      let filteredVaccines = [...allVaccines];

      // apply search filter if search query exists
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredVaccines = filteredVaccines.filter(
          (vaccine) =>
            vaccine.name.toLowerCase().includes(query) ||
            vaccine.id.toLowerCase().includes(query) ||
            vaccine.description.toLowerCase().includes(query)
        );
      }

      setVaccines(filteredVaccines);
      setCurrentPage(1);
      setHasAppliedFilter(true);
      setIsFilterLoading(false);
    }, 1000);
  };

  // clear filters
  const handleClearFilter = () => {
    setSearchQuery("");
    setVaccines([]);
    setHasAppliedFilter(false);
    setCurrentPage(1);
  };

  // get active filter description
  const getActiveFilters = () => {
    const filters = [];
    if (searchQuery) {
      filters.push(`Search: "${searchQuery}"`);
    } else {
      filters.push("All Vaccines");
    }
    return filters;
  };

  const handleViewDetails = (vaccine: any) => {
    setSelectedVaccine(vaccine);
    setIsViewDialogOpen(true);
  };

  return (
    <MOHLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Eye className="w-8 h-8 mr-3 text-primary" />
            View Vaccines
          </h1>
          <p className="text-gray-600">
            Browse and view detailed information about available vaccines
          </p>
        </div>

        {/* filter section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 mr-2 text-primary" />
              Filter Vaccines
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Search by vaccine name, ID, or description, or view all vaccines
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* search filter */}
              <div className="space-y-2 md:col-span-2">
                <Label>Search (Optional)</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by name, ID, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* action buttons */}
              <div className="space-y-2">
                <Label className="invisible">Actions</Label>
                <div className="flex gap-2">
                  <Button
                    onClick={handleApplyFilter}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={isFilterLoading}
                  >
                    {isFilterLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        <Filter className="w-4 h-4 mr-2" />
                        Apply Filter
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleClearFilter}
                    disabled={!hasAppliedFilter}
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* active filters display */}
            {hasAppliedFilter && getActiveFilters().length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm font-medium text-blue-800 mb-1">
                  Active Filters:
                </p>
                <div className="flex flex-wrap gap-2">
                  {getActiveFilters().map((filter, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-blue-100 text-blue-800"
                    >
                      {filter}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* results section */}
        {!hasAppliedFilter ? (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    No Filter Applied
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Click &quot;Apply Filter&quot; to view all vaccines or
                    search for specific vaccines.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isFilterLoading ? (
          <Card>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-4">
                    <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>
                Available Vaccines
                {getActiveFilters().length > 0 && (
                  <span className="text-sm font-normal text-muted-foreground ml-2">
                    ({getActiveFilters().join(", ")})
                  </span>
                )}
              </CardTitle>
              <CardDescription>
                {vaccines.length === 0
                  ? "No vaccines found matching your criteria"
                  : `Found ${vaccines.length} vaccine${
                      vaccines.length !== 1 ? "s" : ""
                    } matching your criteria`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {vaccines.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    No vaccines found. Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <Table className="min-w-full">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="whitespace-nowrap">
                            Vaccine ID
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Vaccine Name
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Description
                          </TableHead>
                          <TableHead className="hidden md:table-cell whitespace-nowrap">
                            Status
                          </TableHead>
                          <TableHead className="text-right whitespace-nowrap">
                            Actions
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentVaccines.map((vaccine) => (
                          <TableRow key={vaccine.id}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {vaccine.id}
                            </TableCell>
                            <TableCell className="hidden md:table-cell whitespace-nowrap">
                              {vaccine.name}
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <div className="max-w-[200px] truncate">
                                {vaccine.description}
                              </div>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                              <Badge variant="secondary">Active</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleViewDetails(vaccine)}
                              >
                                <Eye className="w-4 h-4" />
                                <span className="sr-only">View Details</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {/* pagination */}
                  <div className="flex flex-col md:flex-row items-center justify-between mt-4 gap-4">
                    <p className="text-sm text-gray-600">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, vaccines.length)} of {vaccines.length}{" "}
                      vaccines
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="sr-only md:not-sr-only">Previous</span>
                      </Button>
                      <span className="text-sm">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <span className="sr-only md:not-sr-only">Next</span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* view details dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Vaccine Details</DialogTitle>
              <DialogDescription>
                Complete information about the selected vaccine
              </DialogDescription>
            </DialogHeader>
            {selectedVaccine && (
              <div className="space-y-4">
                <div className="grid gap-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Vaccine ID</Label>
                      <p className="text-sm">{selectedVaccine.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">
                        Vaccine Name
                      </Label>
                      <p className="text-sm font-semibold">
                        {selectedVaccine.name}
                      </p>
                    </div>
                  </div>

                  <div className="p-3 bg-gray-50 rounded-lg">
                    <Label className="text-sm font-medium">Description</Label>
                    <p className="text-sm mt-1">
                      {selectedVaccine.description}
                    </p>
                  </div>

                  <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <Label className="text-sm font-medium text-yellow-800">
                      Side Effects
                    </Label>
                    <p className="text-sm mt-1 text-yellow-700 whitespace-pre-line">
                      {selectedVaccine.sideEffects}
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Status</Label>
                      <Badge variant="secondary">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="flex justify-end">
              <Button onClick={() => setIsViewDialogOpen(false)}>Close</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MOHLayout>
  );
}
