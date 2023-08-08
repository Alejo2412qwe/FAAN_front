import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { Fundacion } from '../Models/fundacion';
import { Observable } from 'rxjs';
import { environment } from '../../environment/enviroment';
import { PeyloadNumeroAdopcionRaza } from '../Payloads/peyloadNumeroAdopcionRaza';
import { PeyloadNumeroAdopcionFecha } from '../Payloads/peyloadNumeroAdopcionFecha';
import { EnfermedadAnimales } from '../Payloads/payloadEnfermedadAnimal';
import { AlergiaAnimales } from '../Payloads/payloadAlergiaAnimal';
import { TratamientoAnimales } from '../Payloads/payloadTratamientoAnimal';
import { VacunasAnimales } from '../Payloads/payloadVacunasAnimal';
// import { ExamenFisico } from '../Models/examenFisico';
import { ExamenFisicoAnimales } from '../Payloads/payloadExamenFisicoAnimal';
import { NumeroAnimalTipo } from '../Payloads/PayloadNumeroAnimalTipo';

@Injectable({
  providedIn: 'root',
})
export class PayloadService {
  constructor(
    private http: HttpClient,
    private storageService: StorageService
  ) {}
  // PAYLOADAS

  public getAllPeyloadNumeroAdopcionRaza(): Observable<
    PeyloadNumeroAdopcionRaza[]
  > {
    return this.http.get<PeyloadNumeroAdopcionRaza[]>(
      environment.apiuri + `/animal/lista/PeyloadNumeroAdopcionRaza`
    );
  }

  public getAllPeyloadNumeroAdopcionFecha(): Observable<
    PeyloadNumeroAdopcionFecha[]
  > {
    return this.http.get<PeyloadNumeroAdopcionFecha[]>(
      environment.apiuri + `/animal/lista/PeyloadNumeroAdopcionFecha`
    );
  }

  public getAllPeyloadNumeroAnimalTipo(): Observable<NumeroAnimalTipo[]> {
    return this.http.get<NumeroAnimalTipo[]>(
      environment.apiuri + `/tipoanimal/numeroAnimalesTipo`
    );
  }

  public getPeyloadEnfermedadAnimalById(
    idFichaMedica: number
  ): Observable<EnfermedadAnimales[]> {
    return this.http.get<EnfermedadAnimales[]>(
      environment.apiuri + '/enfermedad/fichamedicaEnfermedad/' + idFichaMedica
    );
  }
  public getPeyloadAlergiaAnimalById(
    idFichaMedica: number
  ): Observable<AlergiaAnimales[]> {
    return this.http.get<AlergiaAnimales[]>(
      environment.apiuri + '/alergias/fichamedicaAlergias/' + idFichaMedica
    );
  }
  public getPeyloadPeyloadTratamientoAnimalById(
    idFichaMedica: number
  ): Observable<TratamientoAnimales[]> {
    return this.http.get<TratamientoAnimales[]>(
      environment.apiuri +
        '/tratamiento/fichamedicaTratamiento/' +
        idFichaMedica
    );
  }
  public getPeyloadVacunasAnimalById(
    idFichaMedica: number
  ): Observable<VacunasAnimales[]> {
    return this.http.get<VacunasAnimales[]>(
      environment.apiuri + '/vacuna/fichamedicaVacuna/' + idFichaMedica
    );
  }
  public getPeyloadExamenFisicoAnimalById(
    idFichaMedica: number
  ): Observable<ExamenFisicoAnimales[]> {
    return this.http.get<ExamenFisicoAnimales[]>(
      environment.apiuri +
        '/examenFisico/fichamedicaExamenFisico/' +
        idFichaMedica
    );
  }
}
