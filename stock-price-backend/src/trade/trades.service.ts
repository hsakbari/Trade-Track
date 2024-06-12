import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStockDto } from './dto/create-stock.dto';

@Injectable()
export class TradesService {
  constructor(private prisma: PrismaService) {}

  async addTrade(data: CreateStockDto) {
    return this.prisma.stock.upsert({
      where: {
        symbol: data.symbol,
      },
      update: {
        price: data.price,
      },
      create: {
        symbol: data.symbol,
        price: data.price,
      },
    });
  }

  async getAllTrades() {
    return this.prisma.stock.findMany();
  }
}
