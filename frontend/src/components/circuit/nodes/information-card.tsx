import { ALL_PARTS } from "@/components/circuit/parts/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiText } from "@remixicon/react";
import { MoveRight } from "lucide-react";

const CATEGORY_COLORS = {
  promoter: "text-blue-800",
  protein: "text-green-800",
  terminator: "text-red-800",
};

const CONTROL_TYPE_ICONS = {
  repression: <RiText className="rotate-90" />,
  activation: <MoveRight />,
};

const renderControlIcon = (type) => CONTROL_TYPE_ICONS[type];

const renderPartsName = (name) => {
  const category = ALL_PARTS[name].category;
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
          <Button key={id || name} variant="secondary" className="space-x-2">
            {renderPartsName(sourceName)}
            {renderControlIcon(type)}
            {renderPartsName(targetName)}
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
      <CardContent className="flex flex-col justify-center items-center">
        <ControlSection data={data} direction="by" />
        <ControlSection data={data} direction="to" />
      </CardContent>
    </Card>
  );
};
