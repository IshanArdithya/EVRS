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
import { format, subMonths } from "date-fns";

const generateMockData = () => {
  const data = [];
  const endDate = new Date();
  for (let i = 23; i >= 0; i--) {
    const date = subMonths(endDate, i);
    const monthName = format(date, "MMM yyyy");
    const registrations = Math.floor(Math.random() * 500) + 200;

    data.push({
      month: monthName,
      registrations,
      date: format(date, "yyyy-MM"),
    });
  }
  return data;
};

export function CitizenRegistrationsChart() {
  const data = generateMockData();

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
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
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
