
import { useState } from "react";
import { FileUploader } from "@/components/FileUploader";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { FraudDetectionHeader } from "@/components/FraudDetectionHeader";
import { type FraudAnalysisResult } from "@/types/fraudTypes";

const Index = () => {
  const [results, setResults] = useState<FraudAnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <FraudDetectionHeader />
        
        <div className="mt-8 grid gap-8 md:grid-cols-[1fr_2fr] lg:grid-cols-[1fr_3fr]">
          <div>
            <FileUploader 
              setResults={setResults} 
              isAnalyzing={isAnalyzing} 
              setIsAnalyzing={setIsAnalyzing} 
            />
          </div>
          <div>
            <ResultsDashboard 
              results={results} 
              isAnalyzing={isAnalyzing} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
