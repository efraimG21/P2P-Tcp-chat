import {MessageInterface} from "./message-interface";
import {UserInterface} from "./user-interface";

export interface FrameSocketInterface {
  typeOf: 'userLogIn' | 'userLogOut' | 'message' | 'sendMessage'  | 'messageReceived' | 'messageRead';
  frame: string | FrameMessageSocketInterface | UserInterface | MessageInterface | FrameMessageStatusUpdateSocketInterface;
}

export interface FrameMessageSocketInterface {
  chatUid: string,
  receivedUid: string,
  content: string,
  timeStamp: string,
}

export interface FrameMessageStatusUpdateSocketInterface {
  chatUid: string,
  senderUid: string,
}
