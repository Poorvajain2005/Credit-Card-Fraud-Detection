
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, ResponsiveContainer, Bar, XAxis, YAxis, Cell, Tooltip } from "recharts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, BarChart2, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/DataTable";
import { type FraudAnalysisResult } from "@/types/fraudTypes";
import { useState } from "react";

interface ResultsDashboardProps {
  results: FraudAnalysisResult | null;
  isAnalyzing: boolean;
}

export const ResultsDashboard = ({ results, isAnalyzing }: ResultsDashboardProps) => {
  const [viewMode, setViewMode] = useState<'summary' | 'table'>('summary');
  
  if (isAnalyzing) {
    return (
      <Card className="min-h-[400px] shadow-md">
        <CardHeader>
          <CardTitle>Analyzing Dataset</CardTitle>
          <CardDescription>
            Please wait while we process your data...
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-sm text-muted-foreground">
              Running fraud detection algorithms
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="min-h-[400px] shadow-md">
        <CardHeader>
          <CardTitle>Results Dashboard</CardTitle>
          <CardDescription>
            Upload and analyze a dataset to see fraud detection results
          </CardDescription>
        </CardHeader>
        <CardContent className="flex h-64 items-center justify-center">
          <div className="text-center text-muted-foreground">
            <Info className="mx-auto mb-2 h-10 w-10 opacity-50" />
            <p>No data to display yet</p>
            <p className="text-sm">Upload a CSV file and click "Detect Frauds" to begin</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const chartData = [
    {
      name: 'Legitimate',
      value: results.totalRows - results.fraudulentRows.length,
    },
    {
      name: 'Suspicious',
      value: results.fraudulentRows.length,
    },
  ];

  return (
    <div className="space-y-4">
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Analysis Results</CardTitle>
              <CardDescription>
                {results.fraudulentRows.length > 0 
                  ? `${results.fraudulentRows.length} potential frauds detected` 
                  : "No fraudulent activity detected"}
              </CardDescription>
            </div>
            <div className="space-x-2">
              <Button 
                variant={viewMode === 'summary' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode('summary')}
              >
                Summary
              </Button>
              <Button 
                variant={viewMode === 'table' ? "default" : "outline"} 
                size="sm"
                onClick={() => setViewMode('table')}
              >
                Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {viewMode === 'summary' ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Dataset Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Total Records:</dt>
                        <dd className="font-medium">{results.totalRows}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Fields Analyzed:</dt>
                        <dd className="font-medium">{results.analyzedColumns.length}</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Column Names:</dt>
                        <dd className="max-w-[180px] truncate font-medium">
                          {results.analyzedColumns.join(", ")}
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Fraud Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <dl className="space-y-2">
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Normal Records:</dt>
                        <dd className="flex items-center gap-1 font-medium">
                          <Check className="h-4 w-4 text-green-500" />
                          {results.totalRows - results.fraudulentRows.length}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Suspicious Records:</dt>
                        <dd className="flex items-center gap-1 font-medium">
                          {results.fraudulentRows.length > 0 ? (
                            <AlertTriangle className="h-4 w-4 text-[hsl(var(--fraud))]" />
                          ) : (
                            <Check className="h-4 w-4 text-green-500" />
                          )}
                          {results.fraudulentRows.length}
                        </dd>
                      </div>
                      <div className="flex justify-between">
                        <dt className="text-muted-foreground">Fraud Rate:</dt>
                        <dd className={`font-medium ${results.fraudulentRows.length > 0 ? "text-[hsl(var(--fraud))]" : "text-green-500"}`}>
                          {((results.fraudulentRows.length / results.totalRows) * 100).toFixed(2)}%
                        </dd>
                      </div>
                    </dl>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-4">
                <CardHeader className="pb-0">
                  <div className="flex items-center">
                    <BarChart2 className="mr-2 h-5 w-5" />
                    <CardTitle className="text-base">Distribution</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip 
                          formatter={(value) => [`${value} records`, "Count"]}
                          contentStyle={{ borderRadius: "6px" }}
                        />
                        <Bar dataKey="value">
                          {chartData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={index === 0 ? "hsl(221, 83%, 53%)" : "hsl(var(--fraud))"}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <>
              {results.fraudulentRows.length > 0 ? (
                <div className="rounded-md bg-[hsl(var(--fraud-light))] p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="h-5 w-5 text-[hsl(var(--fraud))]" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-[hsl(var(--fraud))]">
                        Suspicious Transactions Detected
                      </h3>
                      <div className="mt-2 text-sm text-[hsl(var(--fraud))]">
                        <p>
                          {results.fraudulentRows.length} out of {results.totalRows} transactions were flagged
                          as potentially fraudulent.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-md bg-green-50 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <Check className="h-5 w-5 text-green-500" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">No Suspicious Transactions</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>
                          All {results.totalRows} transactions in the dataset appear to be legitimate.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <ScrollArea className="h-96 rounded-md border">
                <DataTable results={results} />
              </ScrollArea>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
