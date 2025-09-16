"use client";

import {
  Line,
  LineChart,
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
import { format } from "date-fns";
import { useEffect, useState } from "react";
import api from "@/lib/api";

export function CitizenRegistrationsChart() {
  const [data, setData] = useState<
    { month: string; registrations: number; date: string }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get("/admin/citizen-registrations");
        const apiData = response.data;

        const transformedData = apiData.map(
          (item: { label: string; value: number }) => {
            const [month, year] = item.label.split("/").map(Number);
            const date = new Date(year, month - 1);
            return {
              month: format(date, "MMM yyyy"),
              registrations: item.value,
              date: format(date, "yyyy-MM"),
            };
          }
        );
        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError(err.message || "Failed to fetch citizen registrations");
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
        <CardTitle>Citizen Registrations</CardTitle>
        <CardDescription>
          Monthly citizen registrations for the last 24 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            registrations: {
              label: "Registrations",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="w-full h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="month"
                className="text-xs"
                tick={{ fontSize: 12 }}
              />
              <YAxis className="text-xs" tick={{ fontSize: 12 }} />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border rounded-lg shadow-lg p-3">
                        <p className="font-medium">{label}</p>
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
              <Line
                type="monotone"
                dataKey="registrations"
                stroke="var(--color-chart-1)"
                strokeWidth={2}
                dot={{ fill: "var(--color-chart-1)", strokeWidth: 2, r: 4 }}
                activeDot={{
                  r: 6,
                  stroke: "var(--color-chart-1)",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
