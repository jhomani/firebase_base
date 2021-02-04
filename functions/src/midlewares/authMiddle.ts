import { Response, Request, NextFunction } from 'express';
import { verify } from "jsonwebtoken";
import secret from '../../secret';
import storage from "../storage/index";

export async function auth(req: Request, res: Response, next: NextFunction) {
  const token: any = req.headers.authorization?.split(" ")[1];

  try {
    let decode: any = await verify(token, secret);

    if (decode) {
      storage.setUserId(decode.sub);
      next();
    } else {
      res.status(401).json({ msg: 'you are not authenticated to this route' })
    }
  } catch (err) {
    console.log(err);

    res.status(401).json({ msg: err.message })
  }
}
