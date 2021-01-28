import { Request, Response } from "express";

import { Post } from "../interface/index.interface";

export async function getIndex(req: Request, res: Response) {
  // const conn = await connect();
  try {
    const requestUser: Post = req.body;
    return res.json({ message: "Welcomte to APP with Firebase" });
  } catch (error) {
    return res.status(404).json({ message: "No working" });
  }
}
