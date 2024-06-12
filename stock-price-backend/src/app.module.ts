import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { TradesModule } from './trade/trades.module';
import { PrismaModule } from './prisma/prisma.module';
import { StockModule } from './stock/stock.module';

@Module({
  imports: [TradesModule, PrismaModule, StockModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
