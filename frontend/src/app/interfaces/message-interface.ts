export interface MessageInterface {
  senderUid: string,
  content: string,
  timeStamp: String,
  status: MessageStatus,
}

export enum MessageStatus {
  Sent ,
  Received,
  Read,
}
