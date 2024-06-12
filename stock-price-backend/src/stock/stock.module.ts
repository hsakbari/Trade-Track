import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StockService } from './stock.service';
import { StockController } from './stock.controller';

@Module({
  providers: [StockService, PrismaService],
  controllers: [StockController],
})
export class StockModule {}
