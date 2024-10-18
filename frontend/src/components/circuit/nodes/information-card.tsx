import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { RiText } from "@remixicon/react";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { PARTS_ID2NAME } from "@/components/circuit/nodes/constants";


const ControlSection = ({ data, direction }) => {
  const controlData = direction === "by" ? data.controlBy : data.controlTo;

  if (!controlData || controlData.length === 0) return null;

  const renderControlIcon = (controlType) => {
    switch (controlType) {
      case "Repression":
        return <RiText className="rotate-90" />;
      case "Activation":
        return <MoveRight />;
      default:
        return null;
    }
  };

  return (
    <>
      {controlData.map((control, index) => (
        <Button
          key={index}
          variant="default"
          className="space-x-4"
        >
          {direction === "by" ? (
            <>
              <span>{PARTS_ID2NAME[control.partsId]}</span>
              {renderControlIcon(control.controlType)}
              <span>{data.nodePartsName}</span>
            </>
          ) : (
            <>
              <span>{data.nodePartsName}</span>
              {renderControlIcon(control.controlType)}
              <span>{PARTS_ID2NAME[control.partsId]}</span>
            </>
          )}
        </Button>
      ))}
    </>
  );
};


export const InformationCard = ({ data }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{data.nodePartsName}</CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <ControlSection data={data} direction="by" />
        <ControlSection data={data} direction="to" />
      </CardContent>
    </Card>
  )
}
