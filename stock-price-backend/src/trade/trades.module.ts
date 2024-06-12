import { Module, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TradesService } from './trades.service';
import { TradesController } from './trades.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { TradesGateway } from './trades.gateway';

@Module({
  imports: [PrismaModule],
  providers: [TradesService, TradesGateway],
  controllers: [TradesController],
  exports: [TradesService],
})
export class TradesModule {}
