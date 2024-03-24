import { Injectable } from "@nestjs/common";
import { CreateMessageDto } from "./models/dto/create-message.dto";

@Injectable()
export class MessageService {
  private messages: Map<string, any[]> = new Map(); // Map to store messages for each room
  private rooms: Map<string, Set<string>> = new Map(); // Map to store clients in each room

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
    if (!this.rooms.has(room)) {
      this.rooms.set(room, new Set<string>());
    }

    const clientsInRoom = this.rooms.get(room);
    if (!clientsInRoom.has(client.id)) {
      clientsInRoom.add(client.id);
      client.join(room);
      console.log("join room");
    }else{
      console.log("client already join room");
    }
  }

  async leaveRoom(room: string, client: any) {
    const clientsInRoom = this.rooms.get(room);
    if (clientsInRoom && clientsInRoom.has(client.id)) {
      clientsInRoom.delete(client.id);
      client.leave(room);
      console.log("leave room");
    }else{
      console.log("client already leave room");
    }
  }
}
