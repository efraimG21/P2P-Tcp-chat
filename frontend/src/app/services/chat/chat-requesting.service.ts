import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ChatInterface} from "../../interfaces/chat-interface";

@Injectable({
  providedIn: 'root'
})
export class ChatRequestingService {
  readonly API_URL: string = 'http://0.0.0.0:8080/chat';

  constructor(private http: HttpClient) {
  }

  getChat(uid1: string, uid2: string): Observable<ChatInterface> {
    return this.http.get<ChatInterface>(
      `${this.API_URL}/get/${uid1}/${uid2}`
    );
  }
}
