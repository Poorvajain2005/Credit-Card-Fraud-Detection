
export interface FraudAnalysisResult {
  headers: string[];
  data: string[][];
  totalRows: number;
  analyzedColumns: string[];
  fraudulentRows: number[];
}
