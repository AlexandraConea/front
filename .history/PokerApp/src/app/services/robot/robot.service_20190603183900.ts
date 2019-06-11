import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const url1 = 'http://127.0.0.1:5000/blind/';
const url2 = 'http://127.0.0.1:5000/flop/';
const url4 = 'http://127.0.0.1:5000/turn/';
const url5 = 'http://127.0.0.1:5000/river/';
const url3 = 'http://127.0.0.1:5000/evaluate';

@Injectable({
  providedIn: 'root'
})
export class RobotService {

  constructor(private http: HttpClient) { }

  public blindMove(id: string, json:any): Observable<any>{
    const httpOptions = {
      observe: 'response' as 'response',
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<any>(url1+id, json, httpOptions);
  
  }
  public flopMove(id: string, json:any): Observable<any>{
    const httpOptions = {
      observe: 'response' as 'response',
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<any>(url2+id, json, httpOptions);
  }

  public turnMove(id: string, json:any): Observable<any>{
    const httpOptions = {
      observe: 'response' as 'response',
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<any>(url4+id, json, httpOptions);
  }

  public riverMove(id: string, json:any): Observable<any>{
    const httpOptions = {
      observe: 'response' as 'response',
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<any>(url5+id, json, httpOptions);
  }


  public evaluate(json: any): Observable<any>{
    const httpOptions = {
      observe: 'response' as 'response',
      headers: new HttpHeaders({'Content-Type': 'application/json'})
    };
    return this.http.post<any>(url3, json, httpOptions);
  }
}
