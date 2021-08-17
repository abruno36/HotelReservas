import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { City } from '../models/City';

@Injectable({
  providedIn: 'root'
})
export class CitiesService
{
  constructor(private httpClient: HttpClient) { }

   getCities(): Observable<any>
  {
    return this.httpClient.get<any>("http://localhost:7000/cities");
  }
 
}
