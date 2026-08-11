import { CalciatoreDTO } from "./CalciatoreDTO";

export interface RosaSquadraDTO {
  squadraId: number;
  nomeSquadra: string;
  budgetRimanente: number;
  utenteKeycloakId: string; // Nota: ho mantenuto il tuo typo originale "Keycloack" presente nel DTO Java
  calciatori: CalciatoreDTO[];
}