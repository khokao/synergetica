import { useParts } from "@/components/circuit/parts/parts-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiText } from "@remixicon/react";
import { MoveRight } from "lucide-react";

const CATEGORY_COLORS = {
  Promoter: "text-promoter-800",
  Protein: "text-protein-800",
  Terminator: "text-terminator-800",
};

const CONTROL_TYPE_ICONS = {
  Repression: <RiText className="rotate-90" />,
  Activation: <MoveRight />,
};

const renderControlIcon = (type) => CONTROL_TYPE_ICONS[type];

const renderPartsName = (name) => {
  const { parts } = useParts();

  const category = parts[name].category;
  const colorClass = CATEGORY_COLORS[category];

  return <span className={`${colorClass} font-semibold`}>{name}</span>;
};

const ControlSection = ({ data, direction }) => {
  const controlData = direction === "by" ? data.controlBy : data.controlTo;

  if (controlData.length === 0) return null;

  return (
    <>
      {controlData.map((control) => {
        const { name, type, id } = control;
        const [sourceName, targetName] = direction === "by" ? [name, data.name] : [data.name, name];

        return (
          <Button
            key={id || name}
            variant="secondary"
            className="flex items-center justify-center space-x-2 w-[175px] hover:bg-neutral-100/100"
          >
            <div className="flex-1 text-center">{renderPartsName(sourceName)}</div>
            <div className="flex flex-col items-center">{renderControlIcon(type)}</div>
            <div className="flex-1 text-center">{renderPartsName(targetName)}</div>
          </Button>
        );
      })}
    </>
  );
};

export const InformationCard = ({ data }) => {
  const titleColor = CATEGORY_COLORS[data.category] || "";

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className={`${titleColor}`}>{data.name}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center space-y-2">
        <ControlSection data={data} direction="by" />
        <ControlSection data={data} direction="to" />
      </CardContent>
    </Card>
  );
};
