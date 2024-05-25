export interface Message {
  createdAt: string,
  author: string,
}

export interface MessageObject {
  messages: Message[],
  total: number,
}
