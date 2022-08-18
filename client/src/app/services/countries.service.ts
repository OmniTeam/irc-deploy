import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

/**
 * Reference for this
 * https://documenter.getpostman.com/view/1134062/T1LJjU52#4829d16f-0f4e-43ec-886e-68ebad1221d8
 * */

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  countriesUrl = 'https://countriesnow.space/api/v0.1'

  constructor(private http: HttpClient) { }

  getCitiesForCountry(country): Observable<any> {
    return this.http.post(`${this.countriesUrl}/countries/cities`, {country:country});
  }

  getCountriesAndCities(): Observable<any> {
    return this.http.get(`${this.countriesUrl}/countries`);
  }

  getCountryDailCodes(country): Observable<any> {
    return this.http.post(`${this.countriesUrl}/countries/codes`, {country:country});
  }

  getListOfAllCountries():any[] {
    let countries = []
    this.getCountriesAndCities().subscribe((response)=>{
      if (response.data !== null && response.data !== undefined) {
        response.data.forEach((d)=>{
          countries.push(d.country);
        })
        return countries
      }
    }, error => console.log(error))
    return countries
  }

  getListOfAvailableCountries():any[] {
    let available = ["Uganda","Kenya","Tanzania","Ethiopia"]
    let countries = []
    this.getCountriesAndCities().subscribe((response)=>{
      if (response.data !== null && response.data !== undefined) {
        response.data.forEach((d)=>{
          if(available.includes(d.country)) countries.push(d.country);
        })
        return countries
      }
    }, error => console.log(error))
    return countries
  }
}

