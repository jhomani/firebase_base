import { users } from '../controllers/user-controller';
import { Request, Response } from "express";
import { buildPayment } from "../utils/payment";
import storage from "../storage/index";

export const getMethod = async (req: Request, res: Response) => {
  try {
    let userData: object = await users.getSingleDoc(storage.getUserId());

    let additionalData = {
      type: "CASH",
      amount: 100,
      time: "2021-01-15T21:04:24:42.000Z"
    }

    let response = await (new Promise((res, rej) =>
      buildPayment(userData, additionalData, res, rej)
    ));

    return res.json({ response });
  } catch (err: Any) {
    let msg = err.details ? err.details : err

    return res.status(400).json({ msg });
  }
}

export const postMethod = async (req: Request, res: Response) => {
  try {

    return res.json("data");
  } catch (err: Any) {
    console.log(err);
    let msg = err.details ? err.details : err.msg

    if (err.details) return res.status(422).json({ msg });
    else return res.status(500).json({ msg });
  }
}
