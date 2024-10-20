import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type React from "react";


export const SequencePreview = ({ data }) => {
  const sequenceIds = Object.keys(data.parent2child_details);

  return (
    <Table>
      <TableCaption>Generation Result Table</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Sequence ID</TableHead>
          <TableHead>Sequence</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sequenceIds.map((id) => {
          const concatenatedSequences = data.parent2child_details[id].map((item) => item.sequence).join("");

          return (
            <TableRow key={id}>
              <TableCell>{id}</TableCell>
              <TableCell className="truncate max-w-xs">{concatenatedSequences}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};
