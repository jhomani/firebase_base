import GlobalReq from '../database/global.request';
import { fieldsSchema, postSchema, patchSchema } from '../models/object-types.models';
import { Request, Response } from "express";

const objectTypes = new GlobalReq('objectTypes', fieldsSchema);

export const singleGet = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');

    let doc = await objectTypes.getSingleDoc(req.params.id);

    return res.json(doc);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const countMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const size = await objectTypes.countDocuments(filter);
    return res.json({ count: size });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMethod = async (req: Request, res: Response) => {
  try {
    console.log(typeof req.query.filter);
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const arrRes = await objectTypes.getCollection(filter);

    return res.json(arrRes);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const postMethod = async (req: Request, res: Response) => {
  try {
    let value = await postSchema.validateAsync(req.body);

    let obj = await objectTypes.addDocument(value);
    return res.json(obj);

  } catch (err) {
    console.log(err);
    let msg = err.details ? err.details : err.msg

    if (err.details) return res.status(422).json({ msg });
    else return res.status(500).json({ msg });
  }
}

export const patchMethod = async (req: Request, res: Response) => {
  try {
    let value = await patchSchema.validateAsync(req.body);

    let obj = await objectTypes.setDocument(req.params.id, value);

    return res.json(obj);
  } catch (err) {
    console.log(err);
    let msg = err.details ? err.details : err.msg

    if (err.details) return res.status(422).json({ msg });
    else return res.status(500).json({ msg });
  }
}

export const deleteMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');

    await objectTypes.deleteDocument(req.params.id);

    return res.json({ msg: 'success deleted' });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}