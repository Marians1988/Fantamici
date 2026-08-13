import { SquadraInizialeDTO } from "./SquadraInizialeDTO";


export interface LegaCreateDTO {
  nome: string;
  squadre: SquadraInizialeDTO[];
  budgetIniziale: number;
  numeroSquadre: number;
  numeroPortieri: number;
  numeroDifensori: number;
  numeroCentrocampisti: number;
  numeroAttaccanti: number;
}