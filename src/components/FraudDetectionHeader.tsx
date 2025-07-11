
import { AlertTriangle, Database } from "lucide-react";

export const FraudDetectionHeader = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-4 py-2 text-primary-foreground">
        <AlertTriangle className="h-6 w-6" />
        <h1 className="text-xl font-bold sm:text-2xl md:text-3xl">Fraud Detection System</h1>
        <Database className="h-6 w-6" />
      </div>
      <p className="mt-4 text-muted-foreground md:text-lg">
        Upload your dataset to identify potential fraudulent activities
      </p>
    </header>
  );
};
