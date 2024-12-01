import * as momentTZ from 'moment-timezone';
import { IFecha } from 'src/Models/fecha.model';
import { Logger } from '@nestjs/common';

class DateMomentsUtils {
  private readonly logger = new Logger(DateMomentsUtils.name);

  static MiHorarioTZ: string = 'America/Toronto';

  // Horario de apertura de la bolsa en hora local (Toronto)
  static horarioDeBolsa = [
    '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'
  ];

  // Convertir el horario de apertura de la bolsa a UTC
  static getHorarioDeBolsaUTC(): string[] {
    return this.horarioDeBolsa.map(hora => momentTZ.tz(`2024-01-01 ${hora}`, 'YYYY-MM-DD HH:mm', this.MiHorarioTZ).utc().format('HH:mm'));
  }

  static formatearFecha(fecha: IFecha): string {
    return `${fecha.fecha}T${fecha.hora}`;
  }

  static getUltimaFechaCotizacionGempresa(): IFecha {
    const fecha = new Date();
    fecha.setMinutes(0);
    const fechaISO = fecha.toISOString();
    const horaUTC = momentTZ(fechaISO).utc();
    const fechaString = horaUTC.format();

    return {
      fecha: fechaString.substring(0, 10),
      hora: fechaString.substring(11, 16)
    };
  }

  static transformarFechaAGMT(fecha: string, hora: string): IFecha {
    // Crear un momento de fecha y hora en UTC
    const fechaUTC = momentTZ.utc(`${fecha} ${hora}`, 'YYYY-MM-DD HH:mm');

    const fechaTransformada = {
      fecha: fechaUTC.format("YYYY-MM-DD"),
      hora: fechaUTC.format("HH:mm"),
    };

    // Log para verificar la transformación
    // console.log(`TransformarFechaAGMT - Input: ${fecha} ${hora}, Output: ${JSON.stringify(fechaTransformada)}`);
    return fechaTransformada;
  }
}

export default DateMomentsUtils;
