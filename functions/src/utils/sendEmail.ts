import nodemailer from "nodemailer";
import { google } from "googleapis";

export async function sendVerifyEmail(email: string, url: string) {
  const oAuthClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  )
  oAuthClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const output = `
    <h3>Este el es enlace para verificar tu cuenta<h3>
    <a href="${url}"> click aqui </a> 
  `
  try {
    const accessToken: any = await oAuthClient.getAccessToken();

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_SENDER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken
      }
    });

    await transporter.sendMail({
      from: "Blockchain Consulting Dev",
      to: email,
      subject: "Verificacion de Correo",
      html: output
    });

  } catch (err) {
    console.log(err)

    throw new Error("We have problems sending email");
  }
}

export async function sendResetCodeEmail(email: string, code: string) {
  const oAuthClient = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URL
  )
  oAuthClient.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const output = `
    <h3>Este es el codigo para obtener una nueva contrasenia<h3>
    <h6 style="text-align: center"> ${code} </h6> 
  `
  try {
    const accessToken: any = await oAuthClient.getAccessToken();

    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_SENDER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken
      }
    });

    await transporter.sendMail({
      from: "Blockchain Consulting Dev",
      to: email,
      subject: "Codigo de Reseteo",
      html: output
    });

  } catch (err) {
    console.log(err)

    throw new Error("We have problems sending email");
  }
}