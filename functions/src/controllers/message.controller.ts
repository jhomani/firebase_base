import SubCollectionReq from '../database/subcollection.request';
import { fieldsSchema, postSchema, patchSchema } from '../models/message.models';
import { Request, Response } from "express";
import { db, myBucket } from "../database/connect";
import storage from "../storage/index";

const messages = new SubCollectionReq('chats', fieldsSchema, 'messages');

export const singleGet = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');
    if (!req.query.docId) throw new Error('docId is required');

    let docId: string = typeof req.query.docId === "string" ? req.query.docId : '';

    let doc = await messages.getSingleDoc(req.params.id, docId);

    return res.json(doc);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const countMethod = async (req: Request, res: Response) => {
  try {
    if (!req.query.docId) throw new Error('docId is required');

    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);
    let docId: string = typeof req.query.docId === "string" ? req.query.docId : '';

    const size = await messages.countDocuments(filter, docId);
    return res.json({ count: size });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMethod = async (req: Request, res: Response) => {
  try {
    if (!req.query.docId) throw new Error('docId is required');

    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);
    let docId: string = typeof req.query.docId === "string" ? req.query.docId : '';

    const arrRes = await messages.getCollection(filter, docId);

    return res.json(arrRes);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const postMethod = async (req: Request, res: Response) => {
  try {
    if (!req.query.docId) throw new Error('docId is required');

    let value = await postSchema.validateAsync(req.body);
    let docId: string = typeof req.query.docId === "string" ? req.query.docId : '';

    let obj = await messages.addDocument({ ...value, createdAt: Date.now(), userId: storage.getUserId() }, docId);
    return res.json(obj);

  } catch (err) {
    console.log(err);
    let msg = err.details ? err.details : err.message

    if (err.details) return res.status(422).json({ msg });
    else return res.status(500).json({ msg });
  }
}

export const patchMethod = async (req: Request, res: Response) => {
  try {
    if (!req.query.docId) throw new Error('docId is required');

    let docId: string = typeof req.query.docId === "string" ? req.query.docId : '';
    let value = await patchSchema.validateAsync(req.body);

    let obj = await messages.setDocument(req.params.id, value, docId);

    return res.json(obj);
  } catch (err) {
    console.log(err);
    let msg = err.details ? err.details : err.message

    if (err.details) return res.status(422).json({ msg });
    else return res.status(500).json({ msg });
  }
}

export const deleteMethod = async (req: Request, res: Response) => {
  try {
    if (!req.query.docId) throw new Error('docId is required');
    if (!req.params.id) throw new Error('id is required');

    let docId: string = typeof req.query.docId === 'string' ? req.query.docId : '';

    await messages.deleteDocument(req.params.id, docId);

    return res.json({ msg: 'success deleted' });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const deleteFileMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');
    if (!req.query.docId) throw new Error('docId is required');

    let docId: string = typeof req.query.docId === "string" ? req.query.docId : '';

    let { image }: any = await messages.getSingleDoc(req.params.id, docId);

    if (image) {
      let arLink = image.link.split('/');
      let leng = arLink.length;

      let path = `images/${arLink[leng - 2]}/`

      await myBucket.deleteFiles({ prefix: path });
      await db.collection("uploadFiles").doc(image.id).delete();
    }

    await messages.deleteDocument(req.params.id, docId);

    return res.json({ msg: 'success deleted' });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}