import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {MessageInterface} from "../../interfaces/message-interface";
import {ChatRequestingService} from "./chat-requesting.service";
import {UserHandlingService} from "../user/user-handling.service";
import {UsersListHandlingService} from "../users-list/users-list-handling.service";

@Injectable({
  providedIn: 'root'
})
export class ChatHandlingService {
  selectedUserUid$ = new BehaviorSubject<string | null>(null);
  selectedChatUid$ = new BehaviorSubject<string | null>(null);
  messages$ = new BehaviorSubject<MessageInterface[]>([]);


  constructor(
    private chatRequestingService: ChatRequestingService, private userHandlingService: UserHandlingService, private usersListHandlingService: UsersListHandlingService) {
    this.selectedUserUid$.subscribe(selectedUserUid => {
      let currentUserUid = this.userHandlingService.currentUserUid$.getValue()
      if (currentUserUid && selectedUserUid) {
        this.getChat(currentUserUid, selectedUserUid);
      }
    })
  }

  private getChat(currUserUid: string, otherUserUid: string) {
    this.chatRequestingService.getChat(currUserUid, otherUserUid)
      .subscribe(value => {
        this.selectedChatUid$.next(value._id);
        this.messages$.next(value.messages);
      })
  }

  messageReceived(message: MessageInterface) {
    this.usersListHandlingService.moveToTopList(message.senderUid)
    if (this.selectedUserUid$.value === message.senderUid)
    {
      this.messages$.next([...this.messages$.value, message])
    }
  }
}
