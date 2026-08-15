import { AstaNotificationDTO } from "../assets/AstaNotificationDTO";

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

export interface NotificaEvent {
  type: 'ACQUISTO' | 'ELIMINAZIONE' | 'INIT',
  payload: AstaNotificationDTO
}