"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { format, endOfMonth } from "date-fns";
import api from "@/lib/api";

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

export function CitizenRegistrationsByProvinceChart() {
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [data, setData] = useState<
    { province: string; registrations: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const formattedEndDate = format(endDate, "yyyy-MM");
        const response = await api.get(
          `/admin/registrations-by-province?endDate=${formattedEndDate}`
        );
        const apiData = response.data;
        const transformedData = provinces.map((province) => {
          const record = apiData.find(
            (item: { label: string }) => item.label === province
          ) || {
            label: province,
            value: 0,
          };
          return {
            province: record.label,
            registrations: record.value,
          };
        });
        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch registrations by province");
        setLoading(false);
      }
    };

    fetchData();
  }, [endDate]);

  if (loading)
    return (
      <Card className="w-full">
        <CardContent>Loading...</CardContent>
      </Card>
    );
  if (error)
    return (
      <Card className="w-full">
        <CardContent className="text-red-600">Error: {error}</CardContent>
      </Card>
    );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Citizen Registrations by Province</CardTitle>
          <CardDescription>
            Total citizen registrations by province (Last 12 months)
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            registrations: {
              label: "Registrations",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="h-[350px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 0 }}
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
                    return (
                      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                        <p className="font-medium">{label} Province</p>
                        <p className="text-sm text-muted-foreground">
                          Total Registrations:{" "}
                          <span className="font-semibold text-foreground">
                            {payload[0].value}
                          </span>
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="registrations"
                fill="var(--color-chart-2)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
