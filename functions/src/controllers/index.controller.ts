import { Request, Response } from "express";

import admin from "firebase-admin";
import { Login } from "../interface/index.interface";

const serviceAccount = require("../../permissions.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://restapi-js.firebaseio.com",
});

const collectionLogin = admin.firestore().collection("login");

export async function postIndex(req: Request, res: Response) {
  const body: Login = req.body;
  try {
    // const registerLogin: any = await collectionLogin.doc(`/${body.id}/`).create({ firstName: body.firstName, lastName: body.lastName });

    const registerLogin: any = await collectionLogin.add({ firstName: body.firstName, lastName: body.lastName });
    return res.status(200).json({ id: registerLogin.id, ...body });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function getOneIndex(req: Request, res: Response) {
  try {
    const doc = collectionLogin.doc(req.params.id);
    const item = await doc.get();
    return res.status(200).send({ ...item.data(), id: req.params.id });
  } catch (error) {
    return res.status(500).send(error);
  }
}

export async function getIndex(req: Request, res: Response) {
  try {
    let query = collectionLogin;
    const querySnapshot = await query.get();
    let docs: any[] = querySnapshot.docs;

    const response = docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(404).json({ message: "No working" });
  }
}

export async function patchIndex(req: Request, res: Response) {
  const body: Login = req.body;
  try {
    const document = collectionLogin.doc(req.params.id);
    await document.update(body);
    return res.status(204).json();
  } catch (error) {
    console.log("🚀 ~ file: index.controller.ts ~ line 62 ~ patchIndex ~ error", error);
    return res.status(500).json();
  }
}

export async function deleteIndex(req: Request, res: Response) {
  try {
    const doc = collectionLogin.doc(req.params.id);
    await doc.delete();
    return res.status(200).json({ message: "Se eliminó el historial de pornografia de Abraham correctamente" });
  } catch (error) {
    return res.status(500).send(error);
  }
}
