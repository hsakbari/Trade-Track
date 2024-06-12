import { Controller, Get } from '@nestjs/common';
import { StockService } from './stock.service';

@Controller('stocks')
export class StockController {
  constructor(private stockService: StockService) {}

  @Get()
  async getStocks() {
    return this.stockService.getAllStocks();
  }
}
