import GlobalReq from '../database/global.request';
import { fieldsSchema, postSchema, patchSchema } from '../models/user-types.models';
import { Request, Response } from "express";

const userTypes = new GlobalReq('userTypes', fieldsSchema);

export const singleGet = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');

    let doc = await userTypes.getSingleDoc(req.params.id);

    return res.json(doc);
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const countMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const size = await userTypes.countDocuments(filter);
    return res.json({ count: size });
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const arrRes = await userTypes.getCollection(filter);

    return res.json(arrRes);
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const postMethod = async (req: Request, res: Response) => {
  try {
    let value = await postSchema.validateAsync(req.body);

    let obj = await userTypes.addDocument(value);
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

    let obj = await userTypes.setDocument(req.params.id, value);

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

    await userTypes.deleteDocument(req.params.id);

    return res.json({ msg: 'success deleted' });
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}