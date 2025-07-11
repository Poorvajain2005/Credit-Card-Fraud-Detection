
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AlertTriangle, FileText, Upload } from "lucide-react";
import { detectFrauds } from "@/utils/fraudDetection";
import { type FraudAnalysisResult } from "@/types/fraudTypes";

interface FileUploaderProps {
  setResults: (results: FraudAnalysisResult | null) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (isAnalyzing: boolean) => void;
}

export const FileUploader = ({ setResults, isAnalyzing, setIsAnalyzing }: FileUploaderProps) => {
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type === "text/csv" || selectedFile.name.endsWith(".csv")) {
        setFile(selectedFile);
        toast.success("File successfully uploaded");
      } else {
        toast.error("Please upload a CSV file");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload a file first");
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Simulating async operation
      const fileContent = await file.text();
      const results = detectFrauds(fileContent);
      setResults(results);
      
      if (results.fraudulentRows.length > 0) {
        toast.warning(`Detected ${results.fraudulentRows.length} potential frauds`, {
          icon: <AlertTriangle className="h-5 w-5 text-[hsl(var(--fraud))]" />,
        });
      } else {
        toast.success("No fraudulent activity detected");
      }
    } catch (error) {
      console.error("Error analyzing file:", error);
      toast.error("Error analyzing file. Please check the format.");
      setResults(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setResults(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Dataset Upload
        </CardTitle>
        <CardDescription>
          Upload a CSV file containing transaction data
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            accept=".csv"
            ref={fileInputRef}
            id="file-upload"
            disabled={isAnalyzing}
          />
          <label
            htmlFor="file-upload"
            className="flex cursor-pointer flex-col items-center justify-center"
          >
            <Upload className="mb-2 h-8 w-8 text-gray-400" />
            <span className="mb-1 font-medium">Click to upload</span>
            <span className="text-sm text-muted-foreground">
              CSV files only
            </span>
          </label>
        </div>

        {file && (
          <div className="mt-4 rounded-md bg-blue-50 p-3">
            <p className="font-medium">Selected file:</p>
            <p className="text-sm text-gray-600">{file.name}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={!file || isAnalyzing}
        >
          Reset
        </Button>
        <Button 
          onClick={handleAnalyze} 
          disabled={!file || isAnalyzing}
          className="relative"
        >
          {isAnalyzing ? "Analyzing..." : "Detect Frauds"}
          {isAnalyzing && (
            <span className="absolute right-2 top-2 h-2 w-2 animate-ping rounded-full bg-white"></span>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};
