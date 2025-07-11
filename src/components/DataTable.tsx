
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { type FraudAnalysisResult } from "@/types/fraudTypes";

interface DataTableProps {
  results: FraudAnalysisResult;
}

export const DataTable = ({ results }: DataTableProps) => {
  const { headers, data, fraudulentRows } = results;
  
  // Define a reasonable column limit to display
  const MAX_COLUMNS = 8;
  const displayHeaders = headers.slice(0, MAX_COLUMNS);
  
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12 text-center">#</TableHead>
          <TableHead className="w-16 text-center">Status</TableHead>
          {displayHeaders.map((header, idx) => (
            <TableHead key={idx}>{header}</TableHead>
          ))}
          {headers.length > MAX_COLUMNS && (
            <TableHead>...</TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.slice(0, 100).map((row, rowIdx) => {
          const isFraudulent = fraudulentRows.includes(rowIdx);
          return (
            <TableRow 
              key={rowIdx}
              className={isFraudulent ? "bg-[hsl(var(--fraud-light))]" : ""}
            >
              <TableCell className="text-center">{rowIdx + 1}</TableCell>
              <TableCell className="text-center">
                {isFraudulent ? (
                  <div className="flex justify-center" title="Suspicious transaction">
                    <AlertTriangle className="h-4 w-4 text-[hsl(var(--fraud))]" />
                  </div>
                ) : (
                  <span className="block h-4 w-4"></span>
                )}
              </TableCell>
              {row.slice(0, MAX_COLUMNS).map((cell, cellIdx) => (
                <TableCell key={cellIdx}>{cell}</TableCell>
              ))}
              {row.length > MAX_COLUMNS && (
                <TableCell>...</TableCell>
              )}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
