import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle } from "lucide-react";
import { CircleCheck } from "lucide-react";

export const EditorConsole = ({ error }) => {
  if (!error) {
    return <NoErrorDisplay />;
  }
  return <ErrorDisplay error={error} />;
};

const NoErrorDisplay = () => {
  return (
    <div className="h-[125px]">
      <Alert variant="default" className="h-full border-none">
        <CircleCheck className="h-4 w-4 !text-green-600" />
        <AlertTitle className="!text-green-600">All Good!</AlertTitle>
        <AlertDescription className="!text-green-600">No syntax issues found in YAML file</AlertDescription>
      </Alert>
    </div>
  );
};

const ErrorDisplay = ({ error }) => {
  return (
    <div className="h-[125px]">
      <Alert variant="destructive" className="h-full border-none">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <ScrollArea className="h-5/6">
          <AlertDescription>{error}</AlertDescription>
        </ScrollArea>
      </Alert>
    </div>
  );
};
