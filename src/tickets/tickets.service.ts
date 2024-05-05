import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { send } from 'process';
import { map, Observable } from 'rxjs';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(
    private prisma: PrismaService,
    private httpService: HttpService,
  ) {} // Inyección del PrismaService

  async getTickets() {
    try {
      const result = await this.prisma.ticket.findMany();
      return result;
    } catch (error) {
      console.error('Error al obtener los tickets:', error);
      throw error;
    }
  }

  async getTicketByCorrelativo(data: any) {
    try {
      const result = await this.prisma.ticket.findFirst({
        where: {
          correlativo: data.correlativo, // Directamente aquí, sin anidación
        },
      });
      if (result && result.createdat) {
        const createdAtDate = new Date(result.createdat);
        const currentDate = new Date();

        const diferenciaEnMinutos =
          currentDate.getMinutes() - createdAtDate.getMinutes();
        const total = Math.floor(diferenciaEnMinutos) * 0.084;

        let data2 = {
          correlativo: data.correlativo,
          tiempo: Math.floor(diferenciaEnMinutos),
          total: total.toFixed(0),
        };
        this.sendTicket(data2);
        return `Tiempo en el parqueo: ${Math.floor(diferenciaEnMinutos)}, el total es: Q${total.toFixed(0)}`;
      }
      return 'No se encontró el ticket';
    } catch (error) {
      throw error;
    }
  }

  async createTicket(data: any) {
    const parameter = data.centro; // Ejemplo de parámetro para el procedimiento almacenado
    const estado:number = 0;
    try {
      await this.prisma.$executeRaw`CALL generarticket(${parameter}, ${estado})`; // Ejecutar el procedimiento
      const result = await this.prisma.ticket.findFirst({
        orderBy: {
          id: 'desc',
        },
        take: 1, 
      });
      this.sendTicket(result);
      console.log(result);

    } catch (error) {
      console.error('Error al crear el ticket:', error);
      throw error;
    }
  }

  async updateTicket(data: any) {
    const {correlativo, estado} = data;
    try {
      const result = await this.prisma.ticket.updateMany({
        where: {
          correlativo: correlativo ,
        },
        data: {
          status: estado,
        },
      }); 
      return result;
    } catch (error) {
      console.error('Error al actualizar el ticket:', error);   
      throw error;
    }
  }

  getMongoTickets(): Observable<AxiosResponse<any>> {
    return this.httpService.get('http://localhost:3002/').pipe(
      map((response) => response.data), // Extraer solo los datos
    );
  }
  //funcion que manda la data del ticket en formato json
  async sendTicket(data: any) {
    try {
      const result = await this.httpService.post('http://localhost:3002/logs_crear', data).toPromise();
      return result.data;
    } catch (error) {
      console.error('Error al enviar el ticket:', error);
      throw error;
    }
  }
  
}
