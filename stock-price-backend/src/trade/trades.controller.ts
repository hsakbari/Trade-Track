import { Controller, Get } from '@nestjs/common';
import { TradesService } from './trades.service';

@Controller('trades')
export class TradesController {
  constructor(private tradesService: TradesService) {}

  @Get()
  async getAllTrades() {
    return this.tradesService.getAllTrades();
  }
}
