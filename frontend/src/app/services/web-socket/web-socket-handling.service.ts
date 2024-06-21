import { Injectable } from '@angular/core';
import {FrameSocketInterface} from "../../interfaces/frame-socket-interface";
import {WebSocketSubject} from "rxjs/internal/observable/dom/WebSocketSubject";
import {UserHandlingService} from "../user/user-handling.service";
import {Observable} from "rxjs";
import {webSocket} from "rxjs/internal/observable/dom/webSocket";

@Injectable({
  providedIn: 'root'
})
export class WebSocketHandlingService {
  private readonly API_URL = 'ws://localhost:8080/socket';
  private socket$!: WebSocketSubject<any>

  constructor(private userHandlingService: UserHandlingService) {
  }

  startSocket(): void {
    const socketURL = `${this.API_URL}/${this.userHandlingService.currentUserUid$.getValue()}`;
    this.socket$ = webSocket(socketURL);
    this.userHandlingService.isActive$.next(true);
    console.log('socket is active:', this.socket$);
  }

  sendMessage(frameSocketInterface: FrameSocketInterface): void {
    this.socket$.next(frameSocketInterface);
  }

  getMessage(): Observable<FrameSocketInterface> {
    return this.socket$.asObservable();
  }

  onClose() {
    this.socket$.complete()
    this.userHandlingService.isActive$.next(false);
    console.log('socket closed');
  }
}
