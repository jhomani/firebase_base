import GlobalReq from '../database/global.request';
import { fieldsSchema, postSchema, patchSchema } from '../models/notification.models';
import { Request, Response } from "express";
import { db, myBucket } from "../database/connect"

const notifications = new GlobalReq('notifications', fieldsSchema);

export const singleGet = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');

    let doc = await notifications.getSingleDoc(req.params.id);

    return res.json(doc);
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const countMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const size = await notifications.countDocuments(filter);
    return res.json({ count: size });
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const arrRes = await notifications.getCollection(filter);

    return res.json(arrRes);
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const postMethod = async (req: Request, res: Response) => {
  try {
    let value = await postSchema.validateAsync(req.body);

    let obj = await notifications.addDocument({ ...value, createdAt: Date.now() });
    return res.json(obj);
  } catch (err: Any) {
    console.log(err);
    let msg = err.details ? err.details : err.msg

    if (err.details) return res.status(422).json({ msg });
    else return res.status(500).json({ msg });
  }
}

export const patchMethod = async (req: Request, res: Response) => {
  try {
    let value = await patchSchema.validateAsync(req.body);

    let obj = await notifications.setDocument(req.params.id, value);
    return res.json(obj);
  } catch (err: Any) {
    console.log(err);
    let msg = err.details ? err.details : err.msg

    if (err.details) return res.status(422).json({ msg });
    else return res.status(500).json({ msg });
  }
}

export const deleteMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');

    await notifications.deleteDocument(req.params.id);

    return res.json({ msg: 'success deleted' });
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const deleteFileMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');
    let { avatar } = await notifications.getSingleDoc(req.params.id);

    if (avatar) {
      let arLink = avatar.link.split('/');
      let leng = arLink.length;

      let path = `images/${arLink[leng - 2]}/`

      await myBucket.deleteFiles({ prefix: path });
      await db.collection("uploadFiles").doc(avatar.id).delete();
    }

    await notifications.deleteDocument(req.params.id);

    return res.json({ msg: 'success deleted' });
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}