import * as momentTZ from 'moment-timezone';
import { IFecha } from 'src/Models/fecha.model';

class DateMomentsUtils {
  static MiHorarioTZ: string = 'America/Toronto';
  //Toronto = UTC - 5
  //Toronto 09.00 = 14.00 UTC
  static horarioDeBolsa = [
    '09:00',//14 utc
    '10:00',//15 utc
    '11:00',//16 utc
    '12:00',//17 utc
    '13:00',//18 utc
    '14:00',//19 utc
    '15:00',//20 utc
  ];

  static horarioDeBolsaUTC = [
    '14:00',//14 utc
    '15:00',//15 utc
    '16:00',//16 utc
    '17:00',//17 utc
    '18:00',//18 utc
    '19:00',//19 utc
    '20:00',//20 utc
  ];


  //CREAR METODOS
  static formatearFecha(fecha: IFecha): string {
    return `${fecha.fecha}T${fecha.hora}`;
  };

  // -getLastDateCotizacion -
  static getUltimaFechaCotizacionGempresa(): IFecha {
    const fecha = new Date();
    fecha.setMinutes(0);
    const fechaISO = fecha.toISOString();
    const horaTZ = momentTZ.tz(`${fechaISO}`, DateMomentsUtils.MiHorarioTZ);

    const fechaString = horaTZ.format();

    return {
      fecha: fechaString.substring(0, 10),
      hora: fechaString.substring(11, 16)
    };
  };

  static generarHoraGMTdesdeDate(fecha: Date): IFecha {
    const fechaStr = momentTZ(fecha).tz(DateMomentsUtils.MiHorarioTZ).format();
    console.log(fecha + "fecha tipo date");
    console.log(fechaStr + "fecha tipo string");
    return {
      fecha: fechaStr.substring(0, 10),
      hora: fechaStr.substring(11, 16),
    };
  }

  static getUltimaFechaCotizacionString(): string {
    const date = new Date()
    date.setMinutes(0)
    const fecha = date.toISOString()
    const horaTz = momentTZ.tz(`${fecha}`,);
    const fechaStr = horaTz.format();
    const stringRetorno = `${fechaStr.substring(0, 10)}T${fechaStr.substring(11, 16)}`
    return stringRetorno;
  }

  static transformarFechaAGMT(fecha: string, hora: string): IFecha {
    const fechaUTC = new Date(`${fecha}T${hora}:00.000Z`);
    const horaTZ = momentTZ.tz(fechaUTC, DateMomentsUtils.MiHorarioTZ);
    // const fechaString = horaTZ.format();

    // const fechaGMT = {
    //   fecha: fechaString.substring(0, 10),
    //   hora: fechaString.substring(11, 16)
    // }

    const fechaTransformada = {
      fecha: horaTZ.format("YYYY-MM-DD"),
      hora: horaTZ.format("HH:mm"),
    };

    // return fechaGMT;
    return fechaTransformada;
  };
}
export default DateMomentsUtils;




