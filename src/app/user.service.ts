import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { Trip } from './trip';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  _url = 'http://localhost:3000/';
  constructor(private _http : HttpClient) { }

  login(email : string, password : string){
    return this._http.post<any>(this._url+'login',{email,password});
  }

  register(body : any){
    return this._http.post<any>(this._url+'addUser',body);
  }

  getTrips(email: string){
    return this._http.get<any>(this._url+"getTripsByUser/"+email);
  }

  getUserDetails(email:string){
    return this._http.get<any>(this._url+"getById/"+email);
  }

  addTrip(trip : any){
    return this._http.post<any>(this._url+"addTrip",trip);
  }
}
