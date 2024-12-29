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
  Repression: <RiText className="rotate-90" data-testid="repression-icon" />,
  Activation: <MoveRight data-testid="activation-icon" />,
};

const renderControlIcon = (type) => CONTROL_TYPE_ICONS[type];

const renderPartsName = (name) => {
  const { parts } = useParts();

  const category = parts[name].category;
  const colorClass = CATEGORY_COLORS[category];

  return <span className={`${colorClass} font-semibold`}>{name}</span>;
};

const ControlSection = ({ name, category }) => {
  const { interactionStore } = useParts();

  let controls: Array<{
    sourceName: string;
    targetName: string;
    type: string;
  }> = [];

  if (category === "Promoter") {
    const sources = interactionStore.getProteinsByPromoter(name);
    controls = sources.map((item) => ({
      sourceName: item.from,
      targetName: name,
      type: item.type,
    }));
  } else if (category === "Protein") {
    const targets = interactionStore.getPromotersByProtein(name);
    controls = targets.map((item) => ({
      sourceName: name,
      targetName: item.to,
      type: item.type,
    }));
  }

  if (controls.length === 0) return null;

  return (
    <div data-testid="information-card-control-section">
      {controls.map(({ sourceName, targetName, type }) => {
        return (
          <Button
            key={`${sourceName}-${targetName}`}
            variant="secondary"
            className="flex items-center justify-center space-x-2 w-[175px] hover:bg-neutral-100/100"
          >
            <div className="flex-1 text-center">{renderPartsName(sourceName)}</div>
            <div className="flex flex-col items-center">{renderControlIcon(type)}</div>
            <div className="flex-1 text-center">{renderPartsName(targetName)}</div>
          </Button>
        );
      })}
    </div>
  );
};

export const InformationCard = ({ data }) => {
  const titleColor = CATEGORY_COLORS[data.category] || "";

  return (
    <Card className="h-full w-full">
      <CardHeader>
        <CardTitle className={`${titleColor}`} data-testid="information-card-title">
          {data.name}
        </CardTitle>
        <CardDescription data-testid="information-card-description">{data.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-center items-center space-y-2">
        <ControlSection name={data.name} category={data.category} />
      </CardContent>
    </Card>
  );
};
