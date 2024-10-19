import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RiText } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { PARTS_ID2NAME, PARTS_NAME2CATEGORY } from "@/components/circuit/nodes/constants";

const CATEGORY_COLORS = {
  promoter: "text-blue-800",
  protein: "text-green-800",
  terminator: "text-red-800",
};

const CONTROL_TYPE_ICONS = {
  Repression: <RiText className="rotate-90" />,
  Activation: <MoveRight />,
};

const renderControlIcon = (controlType) => CONTROL_TYPE_ICONS[controlType] || null;

const renderPartsName = (partsId) => {
  const partsName = PARTS_ID2NAME[partsId];
  if (!partsName) return null;

  const category = PARTS_NAME2CATEGORY[partsName];
  const colorClass = CATEGORY_COLORS[category];

  if (!colorClass) return null;

  return <span className={`${colorClass} font-semibold`}>{partsName}</span>;
};

const ControlSection = ({ data, direction }) => {
  const controlData = direction === "by" ? data.controlBy : data.controlTo;

  if (!controlData || controlData.length === 0) return null;

  return (
    <>
      {controlData.map((control) => {
        const { partsId, controlType, id } = control;
        const [sourcePartsId, targetPartsId] =
          direction === "by"
            ? [partsId, data.partsId]
            : [data.partsId, partsId];

        return (
          <Button key={id || partsId} variant="secondary" className="space-x-2">
            {renderPartsName(sourcePartsId)}
            {renderControlIcon(controlType)}
            {renderPartsName(targetPartsId)}
          </Button>
        );
      })}
    </>
  );
};

export const InformationCard = ({ data }) => {
  const titleColor = CATEGORY_COLORS[data.nodeCategory] || '';

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className={`${titleColor}`}>{data.nodePartsName}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center">
        <ControlSection data={data} direction="by" />
        <ControlSection data={data} direction="to" />
      </CardContent>
    </Card>
  );
};
