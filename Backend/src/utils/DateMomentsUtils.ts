import * as momentTZ from 'moment-timezone';
import { IFecha } from 'src/Models/fecha.model';

class DateMomentsUtils {
  static TZ: string = "America/Toronto";
  static horarioDeBolsa = [
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
  ];

  static horarioDeBolsaUTC = [
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
    '20:00',
  ];

  //CREAR METODOS
  static formatearFecha(fecha: IFecha): string {
    return `${fecha.fecha}T${fecha.hora}`;
  };

  static getUltimaFechaCotizacionGempresa(): IFecha {
    const fecha = new Date();
    fecha.setMinutes(0);

    const fechaISO = fecha.toISOString();
    const horaTZ = momentTZ.tz(`${fecha}`, DateMomentsUtils.TZ);

    const fechaString = horaTZ.format();

    return {
      fecha: fechaString.substring(0, 10),
      hora: fechaString.substring(11, 16)
    };
  };

  static generarHoraGMTdesdeDate(fecha: Date): IFecha {
    const fechaStr = momentTZ(fecha).tz(DateMomentsUtils.TZ).format();
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
    const horaTZ = momentTZ.tz(fechaUTC, DateMomentsUtils.TZ);
    const fechaString = horaTZ.format();

    const fechaGMT = {
      fecha: fechaString.substring(0, 10),
      hora: fechaString.substring(11, 16)
    }
    return fechaGMT;
  };
}
export default DateMomentsUtils;
//ir a la base de datos y preguntar: hay cotizaciones?
//1-FALSE , aplicar ****getAllCotizaciones con ##fechaDePartida 01/01/24 + ##fecha actual
//2 TRUE, ##fechaDePartida =  ***getUltimaFechaCotizaciones() + ##fecha actual

