// src/websocket.gateway.ts

import { WebSocketGateway, WebSocketServer, SubscribeMessage, MessageBody, ConnectedSocket } from '@nestjs/websockets';
import { MessageService } from './message.service';
import { CreateMessageDto } from './models/dto/create-message.dto';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true,
  },
  allowEIO3: true,
})
export class MessageGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly messageService: MessageService) { }

  @SubscribeMessage('createMessage')
  async create(@MessageBody() createMessageDto: CreateMessageDto, @ConnectedSocket() client: Socket) {
    const roomId = await this.messageService.getClientRoom(client);
    const message = this.messageService.createMessage(createMessageDto, roomId);
    this.server.to(roomId).emit('message', message);
    return message;
  }

  @SubscribeMessage('getAllMessages')
  async getAllMessages(@ConnectedSocket() client: Socket) {
    const roomId = await this.messageService.getClientRoom(client);
    const message = await this.messageService.getAllMessages(roomId);
    this.server.to(roomId).emit('messages', message);
    return message;
  }

  @SubscribeMessage('join')
  joinRoom(@ConnectedSocket() client: Socket, @MessageBody('room') room: string) {
    this.messageService.joinRoom(room, client);
    console.log("join room");
  }

  // @SubscribeMessage('typing')
  // async typing(@MessageBody('isTypeing') isTyping: boolean, @ConnectedSocket() client: Socket) {
  //   const name = await this.messageService.getClientName(client.id);
  //   client.broadcast.emit('typing', {name, isTyping});
  // }
}