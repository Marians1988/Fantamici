import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { LegaCreateDTO } from "../assets/LegaCreateDTO";
import { LegaResponseDTO } from "../assets/LegaResponseDTO";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { AggiungiSquadraDTO } from "../assets/AggiungiSquadraDTO";
import { LegaRoseResponseDTO } from "../assets/LegaRoseResponseDTO";
import { RosaSquadraDTO } from "../assets/RosaSquadraDTO";


@Injectable({
  providedIn: 'root'
})
export class LegaService {
    private readonly http = inject(HttpClient);  
    legaResponseDTO = signal<LegaResponseDTO | undefined>(undefined);
    roseSquadraDTO = signal<RosaSquadraDTO[] | undefined>(undefined);
        
    public getLeghe(): Observable<LegaResponseDTO> {
        return this.http.get<LegaResponseDTO>(`${environment.apiUrl}/api/leghe`);
    }

    public getRose(legaId: number): Observable<LegaRoseResponseDTO> {
        return this.http.get<LegaRoseResponseDTO>(`${environment.apiUrl}/api/leghe/${legaId}/rose`);
    }

    public createLega(legaData: LegaCreateDTO): Observable<LegaResponseDTO> {
        return this.http.post<LegaResponseDTO>(`${environment.apiUrl}/api/admin/leghe`, legaData);
    }

    public eliminaLega(): Observable<void> {
        return this.http.delete<void>(`${environment.apiUrl}/api/admin/leghe/${this.legaResponseDTO()?.id}`);
    }
        
    public aggiungiSquadra(newSquadra: AggiungiSquadraDTO): Observable<string> {
        return this.http.post(`${environment.apiUrl}/api/leghe`, newSquadra,{ responseType: 'text'});
    }

    public setLegaResponseDTO(lega: LegaResponseDTO | undefined): void {
        this.legaResponseDTO.set(lega);
    }

    
    public updateLegaResponseDTO(lega: LegaResponseDTO | undefined): void {
        this.legaResponseDTO.update(() => lega);
    }

    public getLegaResponseDTO(): LegaResponseDTO | undefined {
        return this.legaResponseDTO()
    }
    public setRosaSquadraDTO(rose: RosaSquadraDTO[] | undefined): void {
        this.roseSquadraDTO.set(rose);
    }
    public getRosaSquadraDTO(): RosaSquadraDTO[] | undefined {        
        return this.roseSquadraDTO()
    }
}