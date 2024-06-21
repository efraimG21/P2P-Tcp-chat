import {MessageInterface} from "./message-interface";

export interface ChatInterface {
  _id: string;
  usersUid: { first: string, second: string },
  messages: MessageInterface[];
}
