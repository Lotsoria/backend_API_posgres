import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { TicketsService } from './tickets.service';

@Controller('tickets')
export class TicketsController {
    constructor(
        private readonly ticketsService: TicketsService
    ) {}
    @Get('find')
    getTickets() {
        return this.ticketsService.getTickets();
    }

    @Get('findOne')
    getTicketByCorrelativo(
        @Body() data: any,
    ) {
        return this.ticketsService.getTicketByCorrelativo(data);
    }

    @Post('create')
    createTicket(
        @Body() data: any,
    ) {
        return this.ticketsService.createTicket(data);
    }

    @Put('update')
    updateTicket(
        @Body() data: any,
    ) {
        return this.ticketsService.updateTicket(data);
    }

    @Get('mongo')
    getMongoTickets() {
        return this.ticketsService.getMongoTickets();
    }   
}
