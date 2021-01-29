import UserResquest from '../database/user.request';
import { Request, Response } from "express";
import { registerSchema, loginSchema, patchSchema, schema } from '../models/user.models';
import secret from '../../secret';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import { UserComplete } from '../interface/user.interface';

let users = new UserResquest('users', schema);

const singleGet = async (req: Request, res: Response) => {

}

const countMethod = async (req: Request, res: Response) => {

}

const getMeUser = async (req: Request, res: Response) => {

}

export const getMethod = async (req: Request, res: Response) => {
  let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

  const arrRes = await users.getCollection(filter);

  return res.json(arrRes);
}

const logoutMethod = async (req: Request, res: Response) => {

}

export const loginMethod = async (req: Request, res: Response) => {
  try {
    const { password, email } = await loginSchema.validateAsync(req.body);
    let obj: UserComplete = await users.userToVerify(email);

    const result = await bcrypt.compare(password, obj.password);

    if (result) {
      const claims = { sub: obj.id, name: obj.name }

      const jwt = JWT.sign(claims, secret, { expiresIn: '1h' });

      return res.json({ authToken: jwt, name: obj.name });
    } else throw new Error('incorrent credentials')
  } catch (err) {
    let msg = err.details ? err.details[0].message : err.message

    if (err.details) return res.status(422).json({ msg });
    else return res.status(401).json({ msg });
  }
}

export const registerMethod = async (req: Request, res: Response) => {
  try {
    const { password, ...other } = await registerSchema.validateAsync(req.body);

    const hash = await bcrypt.hash(password, 12);
    let { password: psw, ...others } = await users.addDocument({ ...other, password: hash });

    return res.json(others);
  } catch (err) {
    let msg = err.details ? err.details[0].message : err.message

    if (err.details) return res.status(422).json({ msg });
    else return res.status(500).json({ msg });
  }
}

const patchMethod = async (req: Request, res: Response) => {

}

const deleteMethod = async (req: Request, res: Response) => {
}

