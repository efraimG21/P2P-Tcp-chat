import {Component, ElementRef, ViewChild} from '@angular/core';
import {MessageInterface, MessageStatus} from "../../../../interfaces/message-interface";
import {FrameMessageSocketInterface} from "../../../../interfaces/frame-socket-interface";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {BehaviorSubject} from "rxjs";
import {ChatHandlingService} from "../../../../services/chat/chat-handling.service";
import {WebSocketHandlingService} from "../../../../services/web-socket/web-socket-handling.service";
import {UserHandlingService} from "../../../../services/user/user-handling.service";
import {UsersListHandlingService} from "../../../../services/users-list/users-list-handling.service";

@Component({
  selector: 'app-chat-section',
  templateUrl: './chat-section.component.html',
  styleUrl: './chat-section.component.scss'
})
export class ChatSectionComponent {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messageForm: FormGroup;
  messageInput = new FormControl('', [Validators.required, Validators.min(1)]);
  filesInput = new FormControl([], [Validators.required]);

  messageList$ = new BehaviorSubject<MessageInterface[] | null>(null);

  constructor(private formBuilder: FormBuilder, protected chatHandlingService: ChatHandlingService,
              private webSocketHandlingService: WebSocketHandlingService, private userHandlingService: UserHandlingService, private usersListHandlingService: UsersListHandlingService) {
    this.messageForm = this.formBuilder.group({
      messageInput: this.messageInput,
      filesInput: this.filesInput,
    });
    this.chatHandlingService.messages$.subscribe(this.messageList$)
  }

  ngAfterViewChecked() {
    if (this.chatContainer)
    {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    }
  }

  sendMessage() {
    if (!this.chatHandlingService.selectedChatUid$.value || !this.chatHandlingService.selectedUserUid$.value || !this.messageInput.value) {
      return
    }
    const messageFrame: FrameMessageSocketInterface = {
      chatUid: this.chatHandlingService.selectedChatUid$.value,
      receivedUid: this.chatHandlingService.selectedUserUid$.value,
      content: this.messageInput.value,
      timeStamp: new Date().toString(),
    }
    this.webSocketHandlingService.sendMessage({typeOf: "sendMessage", frame: messageFrame});
    this.messageForm.reset();
    if (this.messageList$.value && this.userHandlingService.currentUserUid$.value) {
      const message: MessageInterface = {
        senderUid: this.userHandlingService.currentUserUid$.value,
        content: messageFrame.content,
        timeStamp: messageFrame.timeStamp,
        status: MessageStatus.Sent
      };
      this.chatHandlingService.messages$.next([...this.chatHandlingService.messages$.value, message]);
    }
    this.usersListHandlingService.moveToTopList(this.chatHandlingService.selectedUserUid$.value)
  }

  protected readonly MessageStatus = MessageStatus;
}
