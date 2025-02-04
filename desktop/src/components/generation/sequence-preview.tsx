import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const SequencePreview = ({ chainSequences }: { chainSequences: Record<string, string> }) => {
  return (
    <Table data-testid="sequence-preview">
      <TableCaption>Generation Result Table</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Chain ID</TableHead>
          <TableHead>Sequence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(chainSequences).map(([id, sequence]) => (
          <TableRow key={id}>
            <TableCell>{id}</TableCell>
            <TableCell className="truncate max-w-xs">{sequence}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
