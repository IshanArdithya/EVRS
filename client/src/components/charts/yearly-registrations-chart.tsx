"use client";

import { Bar, BarChart, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import api from "@/lib/api";

const chartConfig = {
  registrations: {
    label: "Total Registrations",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function YearlyRegistrationsChart() {
  const [data, setData] = useState<{ year: string; registrations: number }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/admin/yearly-registrations");
        const apiData = response.data;

        const transformedData = apiData.map(
          (item: { label: string; value: number }) => ({
            year: item.label,
            registrations: item.value,
          })
        );
        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch yearly registrations");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <Card>
        <CardContent>Loading...</CardContent>
      </Card>
    );
  if (error)
    return (
      <Card>
        <CardContent className="text-red-600">Error: {error}</CardContent>
      </Card>
    );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Yearly Registrations</CardTitle>
        <CardDescription>
          Total citizen registrations by year (Last 5 years)
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-hidden">
        <ChartContainer config={chartConfig} className="w-full h-[300px]">
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              left: 0,
              right: 20,
            }}
          >
            <XAxis type="number" dataKey="registrations" hide />
            <YAxis
              dataKey="year"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="registrations" fill="grey" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
