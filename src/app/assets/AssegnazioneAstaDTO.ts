import { Ruolo } from "../models/models";

export interface AssegnazioneAstaDTO {
        squadraId: number;
        nome: string;
        cognome: string;
        ruolo: Ruolo;
        prezzoPagato: number;
}