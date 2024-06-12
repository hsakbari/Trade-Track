import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { TradesService } from './trades.service';
import { CreateStockDto } from './dto/create-stock.dto';

@WebSocketGateway({ cors: true })
export class TradesGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly tradesService: TradesService) {}

  @SubscribeMessage('addTrade')
  async handleAddTrade(@MessageBody() data: CreateStockDto) {
    const trade = await this.tradesService.addTrade(data);
    this.server.emit('tradeUpdate', trade);
    return trade;
  }
}
