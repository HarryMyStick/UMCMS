import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./models/dto/create-message.dto";

@Injectable()
export class MessageService {
  messages: Map<string, any[]> = new Map(); // Map to store messages for each room

  createMessage(createMessageDto: CreateMessageDto, roomId: string) {
    const message = { ...createMessageDto };
    const roomMessages = this.messages.get(roomId) || [];
    roomMessages.push(message);
    this.messages.set(roomId, roomMessages);
    return message;
  }

  async getAllMessages(roomId: string) {
    return this.messages.get(roomId) || [];
  }

  async getClientRoom(client: any) {
    const rooms = client.rooms;
    return [...rooms].find(room => room !== client.id); // Find the room ID
  }

  async joinRoom(room: string, client: any) {
    client.join(room);
  }
}
