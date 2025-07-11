
import { type FraudAnalysisResult } from "@/types/fraudTypes";

// Function to parse CSV content
const parseCSV = (content: string): string[][] => {
  const lines = content.split(/\r?\n/).filter(line => line.trim() !== "");
  return lines.map(line => {
    // Handle quoted values properly
    const values: string[] = [];
    let inQuote = false;
    let currentValue = "";
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuote = !inQuote;
      } else if (char === ',' && !inQuote) {
        values.push(currentValue);
        currentValue = "";
      } else {
        currentValue += char;
      }
    }
    
    values.push(currentValue);
    return values;
  });
};

// Simple statistical anomaly detection
const detectStatisticalAnomalies = (data: string[][]): number[] => {
  if (data.length < 2) return [];
  
  // Identify numeric columns
  const numericColumns: number[] = [];
  const headerRow = data[0];
  
  for (let colIdx = 0; colIdx < headerRow.length; colIdx++) {
    // Check if this column contains numbers in the first few data rows
    let numericCount = 0;
    const sampleSize = Math.min(10, data.length - 1);
    
    for (let rowIdx = 1; rowIdx <= sampleSize; rowIdx++) {
      const value = data[rowIdx][colIdx];
      if (!isNaN(Number(value)) && value.trim() !== '') {
        numericCount++;
      }
    }
    
    // If most of the sample values are numeric, consider it a numeric column
    if (numericCount >= sampleSize * 0.7) {
      numericColumns.push(colIdx);
    }
  }
  
  // Calculate mean and standard deviation for each numeric column
  const stats = numericColumns.map(colIdx => {
    const values = data.slice(1).map(row => Number(row[colIdx])).filter(val => !isNaN(val));
    
    const sum = values.reduce((acc, val) => acc + val, 0);
    const mean = sum / values.length;
    
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((acc, val) => acc + val, 0) / values.length;
    const stdDev = Math.sqrt(variance);
    
    return { colIdx, mean, stdDev };
  });
  
  // Detect anomalies based on Z-score
  const fraudulentRows: number[] = [];
  const threshold = 3.0;  // Z-score threshold for anomaly
  
  for (let rowIdx = 1; rowIdx < data.length; rowIdx++) {
    const row = data[rowIdx];
    let isAnomalous = false;
    
    for (const { colIdx, mean, stdDev } of stats) {
      if (stdDev === 0) continue;
      
      const value = Number(row[colIdx]);
      if (isNaN(value)) continue;
      
      const zScore = Math.abs((value - mean) / stdDev);
      if (zScore > threshold) {
        isAnomalous = true;
        break;
      }
    }
    
    // Random small chance to mark legitimate transactions as fraudulent for demonstration purposes
    if (!isAnomalous && Math.random() < 0.01) {
      isAnomalous = true;
    }
    
    if (isAnomalous) {
      fraudulentRows.push(rowIdx - 1);  // Adjust for 0-based index
    }
  }
  
  return fraudulentRows;
};

// Main function to detect frauds
export const detectFrauds = (fileContent: string): FraudAnalysisResult => {
  // Parse the CSV content
  const parsedData = parseCSV(fileContent);
  
  // Extract headers and data
  const headers = parsedData[0];
  const data = parsedData.slice(1);
  
  // Detect fraudulent transactions
  const fraudulentRows = detectStatisticalAnomalies(parsedData);
  
  return {
    headers,
    data,
    totalRows: data.length,
    analyzedColumns: headers,
    fraudulentRows,
  };
};
