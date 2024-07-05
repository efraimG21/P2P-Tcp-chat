import {Component, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {UserHandlingService} from "../../../services/user/user-handling.service";
import {ActivatedRoute} from "@angular/router";
import {WebSocketHandlingService} from "../../../services/web-socket/web-socket-handling.service";
import {UsersListHandlingService} from "../../../services/users-list/users-list-handling.service";
import {ChatHandlingService} from "../../../services/chat/chat-handling.service";
import {UserInterface} from "../../../interfaces/user-interface";
import {MessageInterface} from "../../../interfaces/message-interface";

@Component({
  selector: 'app-chat-page',
  templateUrl: './chat-page.component.html',
  styleUrl: './chat-page.component.scss'
})
export class ChatPageComponent implements OnInit {
  private destroy$ = new Subject<void>();

  constructor(
    protected userHandlingService: UserHandlingService,
    private activatedRoute: ActivatedRoute,
    private webSocketHandlingService: WebSocketHandlingService,
    private usersListHandlingService: UsersListHandlingService,
    private chatHandlingService: ChatHandlingService
  ) {

    userHandlingService.currentUserUid$.next(this.activatedRoute.snapshot.paramMap.get('uid'));
    this.webSocketHandlingService.startSocket()
  }

  ngOnInit() {
    this.webSocketHandlingService.getMessage().pipe(takeUntil(this.destroy$)).subscribe({
      next: frame => {
        if (frame.typeOf === 'userLogIn') {
          this.usersListHandlingService.addUserToList(frame.frame as UserInterface)
        } else if (frame.typeOf === 'userLogOut') {
          this.usersListHandlingService.removeUserFromList(frame.frame as string)
        } else if (frame.typeOf === 'sendMessage') {
          this.chatHandlingService.messageReceived(frame.frame as MessageInterface)
        } else if (frame.typeOf === 'messageReceived' || frame.typeOf === 'messageRead') {
          console.log('frame of messageReceived', frame)
        }
      },
      error: err => {
        console.log(err)
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.webSocketHandlingService.onClose()
  }
}
