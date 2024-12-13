import { CircuitPreview } from "@/components/generation/circuit-preview";
import { ExportButton } from "@/components/generation/export-button";
import { ParameterPreview } from "@/components/generation/parameter-preview";
import { SequencePreview } from "@/components/generation/sequence-preview";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

export const GenerationResultModal = ({ data, snapshot, isOpen, setIsOpen }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent
        className="max-w-none h-[80vh] w-[80vw] flex flex-col"
        aria-describedby={undefined}
        onOpenAutoFocus={(event) => event.preventDefault()}
        onCloseAutoFocus={(event) => event.preventDefault()}
        data-testid="generation-result-modal"
      >
        <DialogHeader>
          <DialogTitle className="text-2xl text-center tracking-wide space-x-2">
            <span>Generation</span>
            <span>Summary</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-row flex-1">
          <div className="flex flex-col flex-1 p-2">
            <div className="flex-grow-[9] pb-4 pl-2 pr-2">
              <CircuitPreview snapshot={snapshot} />
            </div>
            <Separator orientation="horizontal" />
            <div className="flex-grow-[1]">
              <ParameterPreview snapshot={snapshot} />
            </div>
          </div>
          <Separator orientation="vertical" />
          <div className="flex flex-col flex-1 p-2">
            <div className="flex-grow-[11]">
              <SequencePreview data={data} />
            </div>
            <div className="flex-grow-[1] flex justify-center items-center">
              <ExportButton data={data} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
