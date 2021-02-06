import ChatRequest from '../database/chats.request';
import { fieldsSchema, postSchema, patchSchema } from '../models/chats.models';
import { Request, Response } from "express";
import { db, myBucket } from "../database/connect";
import storage from "../storage/index";

const objects = new ChatRequest('chats', fieldsSchema);

export const singleGet = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');

    let doc = await objects.getSingleDoc(req.params.id);

    return res.json(doc);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const countMethod = async (req: Request, res: Response) => {
  try {
    const size = await objects.countMyChats(storage.getUserId());
    return res.json({ count: size });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMethodOwn = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const arrRes = await objects.getMyChats(filter, storage.getUserId());

    return res.json(arrRes);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const arrRes = await objects.getCollection(filter);

    return res.json(arrRes);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const postMethod = async (req: Request, res: Response) => {
  try {
    let value = await postSchema.validateAsync(req.body);
    let timestamps = { createdAt: Date.now(), lastMessage: Date.now() }

    let obj = await objects.addDocument({ ...value, ...timestamps });
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
    let obj = await objects.setDocument(req.params.id, value);

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
    let { members } = await objects.getSingleDoc(req.params.id);

    if (members.length == 1)
      await objects.deleteDocument(req.params.id);
    else {
      let restMem: Array<string> = members.filter((ele: any) => ele != storage.getUserId());

      await objects.setDocument(req.params.id, { members: restMem });
    }


    return res.json({ msg: 'success deleted' });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

// export const deleteFilesMethod = async (req: Request, res: Response) => {
//   try {
//     if (!req.params.id) throw new Error('id is required');
//     let { images } = await objects.getSingleDoc(req.params.id);

//     let arLink = images[0].link.split('/');
//     let leng = arLink.length;

//     let path = `images/${arLink[leng - 2]}/`

//     await myBucket.deleteFiles({ prefix: path });

//     for (let el of images) {
//       await db.collection("uploadFiles").doc(el.id).delete();
//     }

//     await objects.deleteDocument(req.params.id);

//     return res.json({ msg: 'success deleted' });
//   } catch (err) {
//     let msg = err.message;

//     return res.status(400).json({ msg });
//   }
// }