import GlobalReq from '../database/global.request';
import { fieldsSchema, postSchema, patchSchema, adsSchema } from '../models/object.models';
import { Request, Response } from "express";
import { db, myBucket } from "../database/connect";
import storage from "../storage/index";
import { mainFuntion } from "../utils/publishToFacebook";
import { updateAd } from "../utils/updateAdvertising";

const objects = new GlobalReq('objects', fieldsSchema);

export const singleGet = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' ? JSON.parse(req.query.filter) : {};

    if (!req.params.id) throw new Error('id is required');

    let doc = await objects.getSingleDoc(req.params.id, filter);

    return res.json(doc);
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const countMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const size = await objects.countDocuments(filter);
    return res.json({ count: size });
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const arrRes = await objects.getCollection(filter);

    return res.json(arrRes);
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMyMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' ? JSON.parse(req.query.filter) : {};
    filter.where = { userId: storage.getUserId() }

    const arrRes = await objects.getCollection(filter);

    const buildedRes = await updateAd(arrRes);

    return res.json(buildedRes);
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const postMethod = async (req: Request, res: Response) => {
  try {
    let { latitude, longitude, tags, lossDate, ...others } = await postSchema.validateAsync(req.body);
    let value = { ...others };

    if (tags) {
      let allTags = (await db.collection('tags').get()).docs
      let tagsName = allTags.map(el => el.data().name);

      for (let tag of tags) {
        let result = tagsName.indexOf(tag) !== -1;

        if (!result) return res.status(422).json({ message: `the tag '${tag}' is not found in tag's collection` })
      }

      value = { ...value, tags };
    }

    if (lossDate) value = { ...value, lossDate: (new Date(lossDate)).getTime() };

    if (latitude && longitude) {
      let area = +(latitude * longitude).toFixed(6);

      value = { ...value, area, latitude, longitude }
    }

    let obj = await objects.addDocument({ ...value, userId: storage.getUserId(), createdAt: Date.now() });
    return res.json(obj);

  } catch (err: Any) {
    console.log(err);
    let msg = err.details ? err.details : err.message

    if (err.details) return res.status(422).json({ msg });
    else return res.status(500).json({ msg });
  }
}

export const patchMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');
    let { latitude, tags, longitude, ...others } = await patchSchema.validateAsync(req.body);
    let value = {};

    if (tags) {
      let allTags = (await db.collection('tags').get()).docs
      let tagsName = allTags.map(el => el.data().name);

      for (let tag of tags) {
        let result = tagsName.indexOf(tag.name) !== -1;

        if (!result) return res.status(422).json({ message: `the tag '${tag.name}' is not found in tag's collection` })
      }

      value = { ...value, tags }
    }

    if (latitude && longitude) {
      let area = +(latitude * longitude).toFixed(6);

      value = { ...value, area, latitude, longitude }
    }

    let obj = await objects.setDocument(req.params.id, { ...others, userId: storage.getUserId() });

    return res.json(obj);
  } catch (err: Any) {
    console.log(err);
    let msg = err.details ? err.details : err.message

    if (err.details) return res.status(422).json({ msg });
    else return res.status(500).json({ msg });
  }
}

export const deleteMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');

    await objects.deleteDocument(req.params.id);

    return res.json({ msg: 'success deleted' });
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const publishInFacebookAds = async (req: Request, res: Response) => {
  try {
    let datas = await adsSchema.validateAsync(req.body);
    let resp = await mainFuntion(datas);

    return res.json(resp);
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const deleteFilesMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');
    let { images } = await objects.getSingleDoc(req.params.id);

    let arLink = images[0].link.split('/');
    let leng = arLink.length;

    let path = `images/${arLink[leng - 2]}/`

    await myBucket.deleteFiles({ prefix: path });

    for (let el of images) {
      await db.collection("uploadFiles").doc(el.id).delete();
    }

    await objects.deleteDocument(req.params.id);

    return res.json({ msg: 'success deleted' });
  } catch (err: Any) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}