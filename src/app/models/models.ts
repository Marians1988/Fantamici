import { CalciatoreDTO } from "../assets/CalciatoreDTO";

export interface Calciatore {
  squadraId?: number,
  nome: string;
  cognome: string;
  prezzoPagato: number;
  ruolo: Ruolo;
}

export interface Ruolo {
  value:'Portiere' | 'Difensore' | 'Centrocampista' | 'Attaccante';
  type : 'P' | 'D' | 'C' | 'A';
}