import { Response, Request, NextFunction } from 'express';
import { verify } from "jsonwebtoken";
import secret from '../../secret';

export async function auth(req: Request, res: Response, next: NextFunction) {
  const token: any = req.headers.authorization?.split(" ")[1];

  try {
    let decode = await verify(token, secret);

    if (decode) {
      next();
    } else {
      res.status(401).json({ msg: 'you are not authenticated for this route' })
    }
  } catch (err) {
    console.log(err);

    res.status(401).json({ msg: 'you are not authenticated for this route' })
  }
}
