import { Client } from 'soap';
const soap = require("soap");

interface WSResponses {
  return: {
    codigoError: string;
    descripcionError: string;
    idTransaccion?: string;
    id?: string;
  }
}

export function buildPayment(
  userData: object,
  additionalData: object,
  resolve: Function,
  reject: Function
) {

  const { firstName, lastName, email }: any = userData ?? {}
  const { type, time, amount }: any = additionalData ?? {}

  let methodCode = type === "CASH" ? 1 : 3;
  let descriptionCode = `${Date.now()}`;

  let [date, hour] = time.split("T")

  let argPlan = {
    datos: {
      transaccion: "A",
      nombreComprador: `${firstName} ${lastName}`,
      codigoComprador: descriptionCode,
      fecha: +date.replace(/-/g, ''),
      hora: +hour.split('.')[0].replace(/:/g, ''),
      descripcionRecaudacion: "this is a some description for this transancion",
      correoElectronico: email,
      moneda: "BS",
      codigoRecaudacion: descriptionCode,
      fechaVencimiento: 0,
      horavencimiento: 0,
      categoriaProducto: methodCode,
      precedenciaCobro: "N",
      planillas: [
        {
          numeroPago: 1,
          montoPago: amount,
          descripcion: "this is a some description for this transancion",
        }
      ],
    },
    cuenta: process.env.PAGOSNET_ACCOUNT_WS,
    password: process.env.PAGOSNET_PASSWORD_WS,
  }

  let argItem = {
    datos: {
      transaccion: "A",
      idTransaccion: '',
      numeroPago: 1,
      items: [
        {
          numeroItem: 1,
          descripcion: "this is a some description for this transancion",
          precioUnitario: amount,
          cantidad: 1,
        }
      ],
    },
    cuenta: process.env.PAGOSNET_ACCOUNT_WS,
    password: process.env.PAGOSNET_PASSWORD_WS,
  }

  let argDatosHabiente = {
    datos: {
      transaccion: "A",
      nombre: firstName,
      apellido: lastName,
      correoElectronico: email,
      pais: "BO",
      numeroPago: 1,
      idTransaccion: '',
    },
    cuenta: process.env.PAGOSNET_ACCOUNT_WS,
    password: process.env.PAGOSNET_PASSWORD_WS,
  }

  let argMdd = {
    datos: {
      transaccion: "A",
      vertical: "Servicios",
      comercioId: process.env.PAGOSNET_COMMERCE,
      transaccionId: '',
      mdd: [
        {
          key: "merchant_defined_data2",
          value: date,
        },
        {
          key: "merchant_defined_data87",
          value: "jhomani",
        },
        {
          key: "merchant_defined_data90",
          value: "Suscripcion",
        },
        {
          key: "merchant_defined_data42",
          value: 20,
        },
        {
          key: "merchant_defined_data92",
          value: "SI",
        },
        {
          key: "merchant_defined_data24",
          value: 1,
        },
        {
          key: "merchant_defined_data17",
          value: "NO",
        },
        {
          key: "merchant_defined_data15",
          value: methodCode,
        },
      ]
    },
    cuenta: process.env.PAGOSNET_ACCOUNT_WS,
    password: process.env.PAGOSNET_PASSWORD_WS,
  }

  soap.createClient(process.env.PAGOSNET_WSDL_DEV, (err: any, client: Client) => {
    client.registroPlan(argPlan, (err: any, result: WSResponses) => {
      const { return: { codigoError, descripcionError, idTransaccion } } = result;

      if (+codigoError > 0 || err) reject(descripcionError);

      argItem.datos.idTransaccion = idTransaccion || '';
      client.registroItem(argItem, (err: any, result: WSResponses) => {
        const { return: { codigoError, descripcionError } } = result;

        if (+codigoError > 0 || err) reject(descripcionError);
      })

      argDatosHabiente.datos.idTransaccion = idTransaccion || '';
      client.registroTarjetaHabiente(argDatosHabiente, (err: any, result: WSResponses) => {
        const { return: { codigoError, descripcionError } } = result;

        if (+codigoError > 0 || err) reject(descripcionError);
      })

      argMdd.datos.transaccionId = idTransaccion || '';
      client.registroMdd(argMdd, (err: any, result: WSResponses) => {
        const { return: { codigoError, descripcionError, id } } = result;

        if (+codigoError != 1 || err) reject(descripcionError);

        resolve("SUCCESS");
      })
    })
  });
}