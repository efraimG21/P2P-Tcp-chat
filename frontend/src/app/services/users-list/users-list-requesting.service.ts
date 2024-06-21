import { Injectable } from '@angular/core';
import {UserInterface} from "../../interfaces/user-interface";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {UsersListInterface} from "../../interfaces/users-list-interface";

@Injectable({
  providedIn: 'root'
})
export class UsersListRequestingService {
  private readonly API_Url: string = 'http://0.0.0.0:8080/user-handling';

  constructor(private http: HttpClient) {
  }

  getSortedUsersList(uid: string): Observable<UsersListInterface> {
    return this.http.get<UsersListInterface>(`${this.API_Url}/sorted-user-list/${uid}`)
  }

  getUsersList(): Observable<UserInterface[]> {
    return this.http.get<UserInterface[]>(`${this.API_Url}/user-list`)
  }
}
