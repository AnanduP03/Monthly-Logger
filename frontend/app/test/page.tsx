"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableHeader,
  TableRow,
  TableCell,
  TableBody,
} from "@/components/ui/table";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", production: 400, usage: 240 },
  { month: "Feb", production: 300, usage: 139 },
  // Add more sample data here
];

export default function Page() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      {/* Top Section with Chart and Buttons */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-2 rounded-2xl shadow-md p-4">
          <CardContent className="p-0">
            <h2 className="text-xl font-semibold mb-4">
              Monthly Solar Production vs Usage
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="production" stroke="#8884d8" />
                <Line type="monotone" dataKey="usage" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <div className="flex flex-col gap-4">
          <Card className="rounded-2xl shadow-md p-4">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold">Units in Reserve</h3>
              <p className="text-base mt-2">1500 kWh</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-md p-4">
            <CardContent className="p-0">
              <h3 className="text-xl font-semibold">Last Month Production</h3>
              <p className="text-base mt-2">420 kWh</p>
            </CardContent>
          </Card>
          <Button className="rounded-2xl shadow-md">Add</Button>
        </div>
      </div>

      {/* Table Section */}
      <Card className="rounded-2xl shadow-md p-4">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell>Sl no</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Production (kWh)</TableCell>
                <TableCell>Usage (kWh)</TableCell>
                <TableCell>Print</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Example row */}
              <TableRow>
                <TableCell>1</TableCell>
                <TableCell>2025-06-01</TableCell>
                <TableCell>420</TableCell>
                <TableCell>300</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">
                    Print
                  </Button>
                </TableCell>
                <TableCell>
                  <Button variant="destructive" size="sm">
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
              {/* More rows can go here */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
