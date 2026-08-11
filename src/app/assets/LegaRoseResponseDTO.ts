import { RosaSquadraDTO } from "./RosaSquadraDTO";

export interface LegaRoseResponseDTO {
  legaId: number; // Nota: in TypeScript si usa la convenzione camelCase (id minuscolo) per allinearsi al JSON
  nomeLega: string;
  budgetIniziale: number;
  squadre: RosaSquadraDTO[];
}