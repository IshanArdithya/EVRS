"use client";

import { Bar, BarChart, XAxis, YAxis, ResponsiveContainer } from "recharts";
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

const generateYearlyData = () => {
  const data = [];
  const currentYear = new Date().getFullYear();

  for (let i = 4; i >= 0; i--) {
    const year = currentYear - i;
    const totalRegistrations = Math.floor(Math.random() * 8000) + 7000; // Random between 3000-11000

    data.push({
      year: year.toString(),
      registrations: totalRegistrations,
    });
  }
  return data;
};

const chartConfig = {
  registrations: {
    label: "Total Registrations",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function YearlyRegistrationsChart() {
  const data = generateYearlyData();

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
