import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, CircleCheck } from "lucide-react";

type ValidationError = { message: string; line: number };

export const EditorConsole = ({ error }: { error: ValidationError[] }) => {
  if (!error || error.length === 0) {
    return <NoErrorDisplay />;
  }
  return <ErrorDisplay errors={error} />;
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

const ErrorDisplay = ({ errors }: { errors: ValidationError[] }) => {
  return (
    <div className="h-[125px]">
      <Alert variant="destructive" className="h-full border-none">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Validation Errors</AlertTitle>
        <ScrollArea className="h-5/6">
          <AlertDescription>
            <ul className="list-disc pl-5">
              {errors.map((error) => (
                <li key={`${error.line}-${error.message}`}>
                  Line {error.line}: {error.message}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </ScrollArea>
      </Alert>
    </div>
  );
};
