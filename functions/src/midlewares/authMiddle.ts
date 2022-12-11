import { Response, Request, NextFunction } from 'express';
import { verify } from "jsonwebtoken";
import storage from "../storage/index";

export async function auth(req: Request, res: Response, next: NextFunction) {
  const token: any = req.headers.authorization?.split(" ")[1];

  try {
    let decode: any = verify(token, String(process.env.TOKEN_SECRET));

    if (decode && decode.name != "verify") {
      storage.setUserId(decode.sub);
      next();
    } else {
      res.status(401).json({ msg: 'you are not authenticated to this route' })
    }
  } catch (err: Any) {
    console.log(err);

    res.status(401).json({ msg: err.message })
  }
}
