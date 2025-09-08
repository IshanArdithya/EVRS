"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TrendingUp } from "lucide-react";

const provinces = [
  "Western",
  "Central",
  "Southern",
  "Northern",
  "Eastern",
  "North Western",
  "North Central",
  "Uva",
  "Sabaragamuwa",
];

const generateVaccinationData = (
  currentYear: number,
  comparisonYear: number
) => {
  return provinces.map((province) => ({
    province,
    current: Math.floor(Math.random() * 5000) + 1000,
    comparison: Math.floor(Math.random() * 4500) + 800,
    currentYear,
    comparisonYear,
  }));
};

export function VaccinationRecordsChart() {
  const [comparisonYear, setComparisonYear] = useState<string>("2023");

  const currentYear = new Date().getFullYear();
  const data = generateVaccinationData(
    currentYear,
    Number.parseInt(comparisonYear)
  );

  const yearOptions = [];
  for (let i = 1; i <= 5; i++) {
    const year = currentYear - i;
    yearOptions.push(year.toString());
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Vaccination Records by Province</CardTitle>
          <CardDescription>
            Vaccination records comparison across provinces
          </CardDescription>
        </div>
        <Select value={comparisonYear} onValueChange={setComparisonYear}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Compare with" />
          </SelectTrigger>
          <SelectContent>
            {yearOptions.map((year) => (
              <SelectItem key={year} value={year}>
                vs {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            current: {
              label: `${currentYear}`,
              color: "hsl(var(--chart-3))",
            },
            comparison: {
              label: comparisonYear,
              color: "hsl(var(--chart-4))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="province"
                className="text-xs"
                tick={{ fontSize: 11 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis className="text-xs" tick={{ fontSize: 12 }} />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const currentData = payload.find(
                      (p) => p.dataKey === "current"
                    );
                    const comparisonData = payload.find(
                      (p) => p.dataKey === "comparison"
                    );
                    const difference =
                      currentData && comparisonData
                        ? (currentData.value as number) -
                          (comparisonData.value as number)
                        : 0;
                    const percentChange =
                      comparisonData && comparisonData.value
                        ? (
                            (difference / (comparisonData.value as number)) *
                            100
                          ).toFixed(1)
                        : 0;

                    return (
                      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                        <p className="font-medium">{label} Province</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-muted-foreground">
                            {currentYear}:{" "}
                            <span className="font-semibold text-foreground">
                              {currentData?.value}
                            </span>
                          </p>
                          <p className="text-muted-foreground">
                            {comparisonYear}:{" "}
                            <span className="font-semibold text-foreground">
                              {comparisonData?.value}
                            </span>
                          </p>
                          <div className="flex items-center gap-1 pt-1">
                            <TrendingUp className="h-3 w-3" />
                            <span
                              className={`font-semibold ${
                                difference >= 0
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {difference >= 0 ? "+" : ""}
                              {difference} ({percentChange}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar
                dataKey="current"
                fill="var(--color-chart-3)"
                radius={[2, 2, 0, 0]}
                name={`${currentYear}`}
              />
              <Bar
                dataKey="comparison"
                fill="var(--color-chart-4)"
                radius={[2, 2, 0, 0]}
                name={comparisonYear}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
