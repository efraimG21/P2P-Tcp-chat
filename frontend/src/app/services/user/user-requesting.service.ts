import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {UserFormInterface} from "../../interfaces/user-interface";
import {ApiResponseInterface} from "../../interfaces/api-response-interface";

@Injectable({
  providedIn: 'root'
})
export class UserRequestingService {
  private readonly API_Url: string = 'http://0.0.0.0:8080/user-handling';

  constructor(private http: HttpClient) {
  }

  doseUserExists(uid: string): Observable<boolean> {
    return this.http.get<boolean>(
      `${this.API_Url}/is-exists/${uid}`
    )
  }

  createNewUser(user: UserFormInterface): Observable<ApiResponseInterface> {
    return this.http.post<ApiResponseInterface>(
      `${this.API_Url}/sign-on`, user
    )
  }
}
