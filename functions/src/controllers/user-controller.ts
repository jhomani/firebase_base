import UserResquest from '../database/user.request';
import { Request, Response } from "express";
import { registerSchema, loginSchema, patchSchema, schema } from '../models/user.models';
import secret from '../../secret';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import storage from "../storage/index";
import { db } from "../database/connect"

let users = new UserResquest('users', schema);

export const singleGet = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const { password, ...others } = await users.getSingleDoc(req.params.id, filter);

    return res.json(others);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const countMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const size = await users.countDocuments(filter);

    return res.json({ count: size });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMeUser = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const { password, ...others } = await users.getSingleDoc(storage.getUserId(), filter);

    return res.json(others);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const arrRes = await users.getCollection(filter);

    let builded = arrRes.map(({ password, ...others }) => ({ ...others }))

    return res.json(builded);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const logoutMethod = async (req: Request, res: Response) => {
  res.json({ msg: "successful logouted!" });
}

export const loginMethod = async (req: Request, res: Response) => {
  try {
    const { password, email } = await loginSchema.validateAsync(req.body);
    let obj: any = await users.userToVerify(email);

    const result = await bcrypt.compare(password, obj.password);

    if (result) {
      const claims = { sub: obj.id, name: obj.name }

      const jwt = JWT.sign(claims, secret, { expiresIn: '7h' });

      return res.json({ authToken: jwt, name: obj.name });
    } else throw new Error('incorrent credentials')
  } catch (err) {
    let msg = err.details ? err.details : err.message

    if (err.details) return res.status(422).json(msg);
    else return res.status(401).json({ msg });
  }
}

export const registerMethod = async (req: Request, res: Response) => {
  try {
    let { password, email, userTypeId, ...other } = await registerSchema.validateAsync(req.body);

    let emailExist = await db.collection("users").where("email", "==", email).get();
    if (!emailExist.empty) throw new Error("the email already take");

    if (!userTypeId) {
      let userType = (await db.collection("userType").where("name", "==", "client").get()).docs;

      userTypeId = userType[0].id;
    }

    const hash = await bcrypt.hash(password, 12);
    let { password: psw, ...others } = await users.addDocument({ ...other, userTypeId, email, password: hash });

    return res.json(others);
  } catch (err) {
    let msg = err.details ? err.details : err.message

    if (err.details) return res.status(422).json(msg);
    else return res.status(500).json({ msg });
  }
}

export const patchMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');

    const value = await patchSchema.validateAsync(req.body);

    let obj = await users.setDocument(req.params.id, value);

    return res.json(obj);
  } catch (err) {
    let msg = err.details ? err.details : err.message

    if (err.details) return res.status(422).json(msg);
    else return res.status(500).json({ msg });
  }

}

export const deleteMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');

    await users.deleteDocument(req.params.id);

    return res.json({ msg: 'success deleted' });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

