/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { AdminDashboardLayout } from "@/app/(admin)/admin/components/admin-dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  AlertTriangle,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  Calculator,
  BarChart3,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

const sriLankanDistricts = [
  "Ampara",
  "Anuradhapura",
  "Badulla",
  "Batticaloa",
  "Colombo",
  "Galle",
  "Gampaha",
  "Hambantota",
  "Jaffna",
  "Kalutara",
  "Kandy",
  "Kegalle",
  "Kilinochchi",
  "Kurunegala",
  "Mannar",
  "Matale",
  "Matara",
  "Monaragala",
  "Mullaitivu",
  "Nuwara Eliya",
  "Polonnaruwa",
  "Puttalam",
  "Ratnapura",
  "Trincomalee",
  "Vavuniya",
];

interface RiskData {
  citizenId: string;
  firstName?: string;
  lastName?: string;
  district?: string;
  division?: string;
  riskProb: number;
  riskTier: string;
  doseNumber?: number;
  dueBy?: string;
  recommendedAction?: string;
}

interface RiskStats {
  total: number;
  highPercent: string;
  mediumPercent: string;
  lowPercent: string;
}

interface RiskResponse {
  stats: RiskStats;
  highRisk: RiskData[];
  mediumRisk: RiskData[];
  lowRisk?: RiskData[];
}

export default function ManageRisks() {
  const [risks, setRisks] = useState<RiskData[]>([]);
  const [originalRisks, setOriginalRisks] = useState<RiskData[]>([]);
  const [riskStats, setRiskStats] = useState<RiskStats | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [hasCalculated, setHasCalculated] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [filterDistrict, setFilterDistrict] = useState("");
  const [filterDivision, setFilterDivision] = useState("");
  const [filterRiskScore, setFilterRiskScore] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [hasAppliedFilter, setHasAppliedFilter] = useState(false);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  const [openFilterDistrict, setOpenFilterDistrict] = useState(false);

  const { toast } = useToast();

  const itemsPerPage = 10;
  const totalPages = Math.ceil(risks.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRisks = risks.slice(startIndex, endIndex);

  const handleCalculateRisk = async () => {
    setIsCalculating(true);
    try {
      const response = await api.get("/admin/risks");
      const data: RiskResponse = response.data;

      const allRisks = [
        ...data.highRisk,
        ...data.mediumRisk,
        ...(data.lowRisk || []),
      ];

      setOriginalRisks(allRisks);
      setRisks(allRisks);
      setRiskStats(data.stats);
      setHasCalculated(true);
      setCurrentPage(1);

      toast({
        title: "Risk Calculation Complete",
        description: `Analyzed ${data.stats.total} citizens for vaccination risks`,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to calculate risks. Please try again.";
      toast({
        title: "Risk Calculation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      setHasCalculated(false);
      console.error("Risk calculation error:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleApplyFilter = () => {
    if (!hasCalculated) {
      toast({
        title: "Calculate Risks First",
        description: "Please calculate risks before applying filters",
        variant: "destructive",
      });
      return;
    }

    setIsFilterLoading(true);

    try {
      let filteredRisks = [...originalRisks];

      if (filterDistrict) {
        filteredRisks = filteredRisks.filter(
          (risk) => risk.district === filterDistrict
        );
      }
      if (filterDivision.trim()) {
        filteredRisks = filteredRisks.filter((risk) =>
          risk.division?.toLowerCase().includes(filterDivision.toLowerCase())
        );
      }
      if (filterRiskScore) {
        filteredRisks = filteredRisks.filter(
          (risk) =>
            risk.riskTier.toLowerCase() === filterRiskScore.toLowerCase()
        );
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredRisks = filteredRisks.filter(
          (risk) =>
            risk.citizenId.toLowerCase().includes(query) ||
            risk.firstName?.toLowerCase().includes(query) ||
            risk.lastName?.toLowerCase().includes(query)
        );
      }

      setRisks(filteredRisks);
      setCurrentPage(1);
      setHasAppliedFilter(true);
    } catch (error) {
      toast({
        title: "Filter Error",
        description: "Failed to apply filters. Please try again.",
        variant: "destructive",
      });
      console.error("Filter error:", error);
    } finally {
      setIsFilterLoading(false);
    }
  };

  const handleClearFilter = () => {
    if (!hasCalculated) return;

    setFilterDistrict("");
    setFilterDivision("");
    setFilterRiskScore("");
    setSearchQuery("");
    setHasAppliedFilter(false);
    setCurrentPage(1);

    setRisks(originalRisks);
  };

  const getActiveFilters = () => {
    const filters = [];
    if (filterDistrict) {
      filters.push(`District: ${filterDistrict}`);
    }
    if (filterDivision) {
      filters.push(`Division: ${filterDivision}`);
    }
    if (filterRiskScore) {
      filters.push(`Risk Score: ${filterRiskScore}`);
    }
    if (searchQuery) {
      filters.push(`Search: "${searchQuery}"`);
    }
    return filters;
  };

  const getRiskBadgeVariant = (riskTier: string) => {
    switch (riskTier.toLowerCase()) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <AdminDashboardLayout>
      <div className="space-y-4 md:space-y-6">
        {/* header */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="p-2 bg-red-100 rounded-lg w-fit">
              <AlertTriangle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                Manage Risks
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Calculate and analyze vaccination risk scores for citizens
              </p>
            </div>
          </div>
          <Button
            onClick={handleCalculateRisk}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700"
            disabled={isCalculating}
          >
            {isCalculating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Calculating Risks...
              </>
            ) : (
              <>
                <Calculator className="w-4 h-4 mr-2" />
                Calculate Risk
              </>
            )}
          </Button>
        </div>

        {/* risk stats bar */}
        {riskStats && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="text-center p-3 sm:p-4 bg-red-50 rounded-lg border border-red-200">
                    <div className="text-xl sm:text-2xl font-bold text-red-600">
                      {riskStats.highPercent}%
                    </div>
                    <div className="text-xs sm:text-sm text-red-700">
                      High Risk
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="text-xl sm:text-2xl font-bold text-yellow-600">
                      {riskStats.mediumPercent}%
                    </div>
                    <div className="text-xs sm:text-sm text-yellow-700">
                      Medium Risk
                    </div>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-xl sm:text-2xl font-bold text-green-600">
                      {riskStats.lowPercent}%
                    </div>
                    <div className="text-xs sm:text-sm text-green-700">
                      Low Risk
                    </div>
                  </div>
                </div>

                {/* progress bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 sm:h-4 overflow-hidden">
                  <div className="h-full flex">
                    <div
                      className="bg-red-500"
                      style={{ width: `${riskStats.highPercent}%` }}
                    ></div>
                    <div
                      className="bg-yellow-500"
                      style={{ width: `${riskStats.mediumPercent}%` }}
                    ></div>
                    <div
                      className="bg-green-500"
                      style={{ width: `${riskStats.lowPercent}%` }}
                    ></div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-600 text-center">
                  Total Citizens Analyzed: {riskStats.total}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* filter section */}
        {hasCalculated && (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                Filter Risk Data
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Filter by district, division, risk score, or search by citizen
                details
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4">
                  {/* district filter */}
                  <div className="space-y-2">
                    <Label className="text-sm">District (Optional)</Label>
                    <Popover
                      open={openFilterDistrict}
                      onOpenChange={setOpenFilterDistrict}
                    >
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openFilterDistrict}
                          className="w-full justify-between bg-transparent text-sm h-9"
                        >
                          <span className="truncate">
                            {filterDistrict || "Select district..."}
                          </span>
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search district..." />
                          <CommandList>
                            <CommandEmpty>No district found.</CommandEmpty>
                            <CommandGroup>
                              {sriLankanDistricts.map((district) => (
                                <CommandItem
                                  key={district}
                                  value={district}
                                  onSelect={(currentValue) => {
                                    const selectedDistrict =
                                      currentValue === filterDistrict
                                        ? ""
                                        : currentValue;
                                    setFilterDistrict(selectedDistrict);
                                    setOpenFilterDistrict(false);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      filterDistrict === district
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {district}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* division filter */}
                  <div className="space-y-2">
                    <Label className="text-sm">Division (Optional)</Label>
                    <Input
                      placeholder="Enter division..."
                      value={filterDivision}
                      onChange={(e) => setFilterDivision(e.target.value)}
                      className="h-9 text-sm"
                    />
                  </div>

                  {/* risk score filter */}
                  <div className="space-y-2">
                    <Label className="text-sm">Risk Score (Optional)</Label>
                    <Select
                      value={filterRiskScore}
                      onValueChange={setFilterRiskScore}
                    >
                      <SelectTrigger className="h-9 text-sm">
                        <SelectValue placeholder="Select risk level..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* search filter */}
                  <div className="space-y-2">
                    <Label className="text-sm">Search (Optional)</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search by ID, name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-9 text-sm"
                      />
                    </div>
                  </div>

                  {/* bction btns */}
                  <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                    <Label className="text-sm invisible">Actions</Label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleApplyFilter}
                        className="flex-1 bg-red-600 hover:bg-red-700 h-9 text-sm"
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
                            Apply
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleClearFilter}
                        disabled={!hasAppliedFilter}
                        className="h-9 text-sm bg-transparent"
                      >
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>

                {/* active filters display */}
                {hasAppliedFilter && getActiveFilters().length > 0 && (
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs sm:text-sm font-medium text-blue-800 mb-2">
                      Active Filters:
                    </p>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {getActiveFilters().map((filter, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 text-xs"
                        >
                          {filter}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* results section */}
        {!hasCalculated ? (
          <Card>
            <CardContent className="py-8 sm:py-12">
              <div className="text-center space-y-3 sm:space-y-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <Calculator className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-medium text-gray-900">
                    No Risk Data Available
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mt-1">
                    Click &quot;Calculate Risk&quot; to analyze vaccination
                    risks for all citizens.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isCalculating || isFilterLoading ? (
          <Card>
            <CardHeader>
              <div className="h-5 sm:h-6 bg-gray-200 rounded animate-pulse w-1/4"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-3 sm:space-x-4">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-20 sm:w-24"></div>
                    <div className="h-3 sm:h-4 bg-gray-200 rounded animate-pulse w-24 sm:w-32"></div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader className="pb-3 sm:pb-6">
              <CardTitle className="text-lg sm:text-xl">
                Risk Analysis Results
                {getActiveFilters().length > 0 && (
                  <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-2 block sm:inline">
                    ({getActiveFilters().join(", ")})
                  </span>
                )}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {risks.length === 0
                  ? "No citizens found matching your criteria"
                  : `Found ${risks.length} citizen${
                      risks.length !== 1 ? "s" : ""
                    } matching your criteria`}
              </p>
            </CardHeader>
            <CardContent className="pt-0">
              {risks.length === 0 ? (
                <div className="text-center py-6 sm:py-8">
                  <p className="text-sm sm:text-base text-gray-500">
                    No risk data found. Try adjusting your search criteria.
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <div className="inline-block min-w-full align-middle">
                      <Table className="min-w-full">
                        <TableHeader>
                          <TableRow>
                            <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                              Citizen ID
                            </TableHead>
                            <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                              First Name
                            </TableHead>
                            <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                              Last Name
                            </TableHead>
                            <TableHead className="hidden md:table-cell whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                              District
                            </TableHead>
                            <TableHead className="hidden md:table-cell whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                              Division
                            </TableHead>
                            <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                              Risk Number
                            </TableHead>
                            <TableHead className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                              Score
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {currentRisks.map((risk) => (
                            <TableRow key={risk.citizenId}>
                              <TableCell className="font-medium whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                {risk.citizenId}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                {risk.firstName || "N/A"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                {risk.lastName || "N/A"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                {risk.district || "N/A"}
                              </TableCell>
                              <TableCell className="hidden md:table-cell whitespace-nowrap text-xs sm:text-sm px-2 sm:px-4">
                                {risk.division || "N/A"}
                              </TableCell>
                              <TableCell className="whitespace-nowrap font-mono text-xs sm:text-sm px-2 sm:px-4">
                                {risk.riskProb.toFixed(5)}
                              </TableCell>
                              <TableCell className="whitespace-nowrap px-2 sm:px-4">
                                <Badge
                                  variant={getRiskBadgeVariant(risk.riskTier)}
                                  className="text-xs"
                                >
                                  {risk.riskTier}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* pagination */}
                  <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3 sm:gap-4">
                    <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, risks.length)} of {risks.length}{" "}
                      citizens
                    </p>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 px-2 sm:px-3"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        <span className="sr-only sm:not-sr-only ml-1">
                          Previous
                        </span>
                      </Button>
                      <span className="text-xs sm:text-sm whitespace-nowrap">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 px-2 sm:px-3"
                      >
                        <span className="sr-only sm:not-sr-only mr-1">
                          Next
                        </span>
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </AdminDashboardLayout>
  );
}
