import { Module } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { TicketsController } from './tickets.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
@Module({
  providers: [TicketsService],
  controllers: [TicketsController],
  imports: [PrismaModule, HttpModule], 
})
export class TicketsModule {}
