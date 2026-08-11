import { SquadraInizialeDTO } from "./SquadraInizialeDTO";


export interface LegaCreateDTO {
  nome: string;
  squadre: SquadraInizialeDTO[];
  budgetIniziale: number;
  numeroSquadre: number;
}