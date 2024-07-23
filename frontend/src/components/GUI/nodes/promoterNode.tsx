import { onDragStart } from "@/components/GUI/Bottombar";
import icon from "@public/images/node-promoter.svg";
import Image from "next/image";
import React from "react";

const iconUrl = "/images/node-promoter.svg";
const nodeCategory = "promoter";
const leftHandleStyle = { top: 68, left: 5 };
const rightHandleStyle = { top: 68, left: 180 };
const commandPaletteButtonStyle = { top: 47, left: 11, right: 10 };

export const promoterCommandPaletteOptions = [
  {
    name: "PameR",
    description: "Regulated Promoter repressed by AmeR",
    subcategory: "RepressivePromoter",
    sequence: "gatagtgacaaacttgacaactcatcacttcctaggtataatgctagc",
    partsId: "3185f745eb818a94545e9a8607a4541ef31e47ba6a246ad8eb73fe078fc1542c",
    controlBy: [
      {
        partsId: "89369dbb6260c55bde1634ef497efb19f26f7e8eeb19bf949500a9575209b4a6",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
  {
    name: "PamtR",
    description: "Regulated Promoter repressed by AmtR",
    subcategory: "RepressivePromoter",
    sequence: "gattcgttaccaattgacagtttctatcgatctatagataatgctagc",
    partsId: "a2a19f6c01bc404d9b3245dce99546cf8b39a79c5f24c2d6811c658142981d39",
    controlBy: [
      {
        partsId: "d268d4dcfc6f9d3d0053560ef4863b10504c88ee5b2bb1cad823e860c919bb04",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
  {
    name: "Pbetl",
    description: "Regulated Promoter repressed by BetI",
    subcategory: "RepressivePromoter",
    sequence: "agcgcgggtgagagggattcgttaccaattgacaattgattggacgttcaatataatgctagc",
    partsId: "468d92f750bef157b9bd89ffd62518cb4db9fcd32a706f15fc6d1200b0b23bf7",
    controlBy: [
      {
        partsId: "c6206e07cbdd06d7055dd69b0152658ccae92c405a7d0a6335cd42f4a83b7e82",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
  {
    name: "Pbm3r1",
    description: "Regulated Promoter repressed by BM3R1",
    subcategory: "RepressivePromoter",
    sequence: "tctgattcgttaccaattgacggaatgaacgttcattccgataatgctagc",
    partsId: "3aa865db07b14c56e1a95166d36b27819cacf657d350d8b85fb3b88e74d04f3c",
    controlBy: [
      {
        partsId: "8e962d8c0de8f20c5dc9047784fc10f3b55053a300cf987bfca6f9c2f3a3d62a",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
  {
    name: "PhyllR",
    description: "Regulated Promoters repressed by HylIR",
    subcategory: "RepressivePromoter",
    sequence: "gattcgttaccaattgacatatttaaaattcttgtttaaaatgctagc",
    partsId: "c3b51399403871aaf80ff1a40a5a981acfa730a7c9993b70bca0084e6da58849",
    controlBy: [
      {
        partsId: "88b85923d6cfb27657a49553e6ac931a0eea55af3e7fa236fa10ff98960164d4",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
  {
    name: "PlcaRA",
    description: "Regulated Promoters repressed by LcaRA",
    subcategory: "RepressivePromoter",
    sequence: "tctgattcgttaccaattgacaattcacctacctttcgttaggttaggttgt",
    partsId: "0ca92788a7ec220bd01176f55500545a7df2474de8064901b415ecb25cd5e382",
    controlBy: [
      {
        partsId: "c94cd50febe15f41bb44ed5f7dbba31af42432387b5967f3f144ffc35fa7b071",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
  {
    name: "PlitR",
    description: "Regulated Promoter repressed by LitR",
    subcategory: "RepressivePromoter",
    sequence: "gattcgttaccaattgacaaatttataaattgtcagtataatgctagc",
    partsId: "843d99e4224bb7b1e44bf225df65a2559e830bebbfb9e923b29930e2741bf551",
    controlBy: [
      {
        partsId: "7ddb11c77de0a8b38cd66c71afa3ed5fc84bac082fee16dd37ad383b85470419",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
  {
    name: "PlmrA",
    description: "Regulated Promoter repressed by LmrA",
    subcategory: "RepressivePromoter",
    sequence: "tctgattcgttaccaattgacaactggtggtcgaatcaagataatagaccagtcactatattt",
    partsId: "7f07390615e62a6c104023fcdd035bdc407c126670778f63426da903c9bf2ede",
    controlBy: [
      {
        partsId: "bdd5ed6a07dbe000976d8bd8c58d6c44b6342637790225660a63bf7d49dce8a6",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
  {
    name: "PphlF",
    description: "Regulated Promoter repressed by PhlF",
    subcategory: "RepressivePromoter",
    sequence: "tctgattcgttaccaattgacatgatacgaaacgtaccgtatcgttaaggt",
    partsId: "ed38591d3933370cbbb83626321e8697c22ea97463a82cba32973b92935292e6",
    controlBy: [
      {
        partsId: "bf7ad70f95d6d9e0c72ebb1d27ee4447212ed20e0d44a4d2eb3049d41f56bfa9",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
  {
    name: "PpsrA",
    description: "Regulated Promoter repressed by PsrA",
    subcategory: "RepressivePromoter",
    sequence: "aggaacaaacgtttgattgacagctagctcagtcctaggtataatgctagc",
    partsId: "4bcf1beb58b8a87b468461cc176531c2d57f449a82cabab993e735b6ce923ba8",
    controlBy: [
      {
        partsId: "9e4b753cfb335236f75d4d0ab6155d2f8694bf7039fd8a0dc7136afdb5c95e41",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
  {
    name: "PqacR",
    description: "Regulated Promoter repressed by QacR",
    subcategory: "RepressivePromoter",
    sequence: "cgttaccaattgacagctagctcagtcctactttagtatatagaccgtgcgatcggtctata",
    partsId: "9c0781baa6c9c52013e3435b9d79e727d0bcfbedf067805d8e7918e1835df5bb",
    controlBy: [
      {
        partsId: "77848d5b1ef1a1c5b3b852e0dbb978440cbfb610d97cd22b35f057b49b25d9e3",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
  {
    name: "PsrpR",
    description: "Regulated Promoter repressed by SrpR",
    subcategory: "RepressivePromoter",
    sequence: "gattcgttaccaattgacagctagctcagtcctaggtatatacatacatgcttgtttgtttgtaaac",
    partsId: "5e69da185a5bcf8b40c526acaa2bb3238a7db8d35b09ed56e2b54e726d738c2c",
    controlBy: [
      {
        partsId: "38c274bddd4f3f58b4b8badae5a64eb0a84f48e6d3bbb1f5b0ecf4b8e289403c",
        controlType: "Repression",
      },
    ],
    controlTo: null,
    meta: null,
  },
];

/*
  Since dragging and dropping icons in Tauri apps can trigger file operations,
  we disable the drag event for the image and enable it for the parent div instead.
  To properly handle drag events via Tauri, set `tauri.windows.fileDropEnabled` to false in `tauri.conf.json`.
*/
const enableDragging = (event) => {
  event.currentTarget.draggable = true;
};

export const promoterNode = (
  <div
    className="cursor-pointer flex items-end justify-center"
    onDragStart={(event) =>
      onDragStart(event, iconUrl, nodeCategory, leftHandleStyle, rightHandleStyle, commandPaletteButtonStyle)
    }
    draggable
    onMouseDown={enableDragging}
  >
    <Image src={icon} alt={nodeCategory} draggable={false} />
  </div>
);
