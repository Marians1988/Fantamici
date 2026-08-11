import { SquadreSummaryDTO } from "./SquadreSummaryDTO";

export interface LegaResponseDTO {
  id: number; // Nota: in TypeScript si usa la convenzione camelCase (id minuscolo) per allinearsi al JSON
  nome: string;
  budgetIniziale: number;
  adminKeycloackId: string;
  numeroSquadre: number;
  squadre: SquadreSummaryDTO[];
}