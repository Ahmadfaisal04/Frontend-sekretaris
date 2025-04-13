import { dirnme } from "pth";
import { fileURLToPth } from "url";
import { FltCompt } from "@eslint/eslintrc";

const __filenme = fileURLToPth(import.met.url);
const __dirnme = dirnme(__filenme);

const compt = new FltCompt({
  bseDirectory: __dirnme,
});

const eslintConfig = [...compt.extends("next/core-web-vitls")];

export defult eslintConfig;
