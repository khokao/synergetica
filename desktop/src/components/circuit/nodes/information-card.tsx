import { CATEGORY_CONFIG } from "@/components/circuit/constants";
import { useParts } from "@/components/circuit/parts/parts-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RiText } from "@remixicon/react";
import { MoveRight } from "lucide-react";

const CONTROL_TYPE_ICONS = {
  Repression: <RiText className="rotate-90" data-testid="repression-icon" />,
  Activation: <MoveRight data-testid="activation-icon" />,
};

export const InformationCard = ({ data }) => {
  const { name, category, description, sequence } = data;
  const { iconColor } = CATEGORY_CONFIG[category];

  const { parts, interactionStore } = useParts();

  const interactions =
    category === "Promoter"
      ? interactionStore.getProteinsByPromoter(name)
      : category === "Protein"
        ? interactionStore.getPromotersByProtein(name)
        : [];

  return (
    <Card className="h-full w-full overflow-hidden whitespace-normal break-words">
      <CardHeader>
        <CardTitle className={`${iconColor}`} data-testid="information-card-title">
          {name}
        </CardTitle>
        <CardDescription data-testid="information-card-description">{description}</CardDescription>
      </CardHeader>
      <CardContent
        className="flex flex-col justify-center items-center space-y-2"
        data-testid="information-card-content"
      >
        {category === "Terminator" && sequence && (
          <div className="w-full space-y-2">
            <Badge variant="secondary">Sequence</Badge>
            <p className="px-4 font-mono text-xs break-words">{sequence}</p>
          </div>
        )}
        {interactions.map(({ from, to, type }) => {
          return (
            <Button
              key={`${from}-${to}`}
              variant="secondary"
              className="flex items-center justify-center space-x-2 w-[200px] hover:bg-neutral-100/100"
            >
              <div className={`flex-1 text-center font-semibold ${CATEGORY_CONFIG[parts[from].category].iconColor}`}>
                {from}
              </div>
              <div className="flex flex-col items-center">{CONTROL_TYPE_ICONS[type]}</div>
              <div className={`flex-1 text-center font-semibold ${CATEGORY_CONFIG[parts[to].category].iconColor}`}>
                {to}
              </div>
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
};
