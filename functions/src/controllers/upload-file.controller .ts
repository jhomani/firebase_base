import GlobalReq from '../database/global.request';
import { fieldsSchema, postSchema, patchSchema } from '../models/upload-file.models';
import { Request, Response } from "express";
import { myBucket } from "../database/connect";
import Busbou from 'busboy';

const uploadFiles = new GlobalReq('upload-files', fieldsSchema);

export const singleGet = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');

    let doc = await uploadFiles.getSingleDoc(req.params.id);

    return res.json(doc);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const countMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const size = await uploadFiles.countDocuments(filter);

    return res.json({ count: size });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMethod = async (req: Request, res: Response) => {


  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const arrRes = await uploadFiles.getCollection(filter);

    return res.json(arrRes);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const postMethod = async (req: any, res: Response) => {
  try {
    const busboy = new Busbou({ headers: req.headers });
    let newFileName: Array<string> = [];
    let idFile = (new Date).getTime().toString();

    let fields: any = {};
    let i: number = 0;

    busboy.on("file", async (_, file, fileName) => {
      newFileName.push(`https://storage.googleapis.com/its-mine-storage/images/objects/${idFile}/${i}_${fileName}`);

      file.pipe(myBucket.file(`images/objects/${idFile}/${i}_${fileName}`).createWriteStream())
      i++
    })

    busboy.on("field", (field, value) => {
      fields[field] = value;
    });

    busboy.on('finish', async () => {
      try {
        if (newFileName.length === 0) throw new Error("Binary images is required");
        let value = await postSchema.validateAsync(fields);
        let arrForResp: Array<any> = [];

        for (let ele of newFileName) {
          let { id } = await uploadFiles.addDocument({ ...value, link: ele });

          arrForResp.push({ id, link: ele });
        }


        if (arrForResp.length == 1) return res.json(arrForResp[0]);
        else return res.json(arrForResp);
      } catch (err) {
        return res.status(422).json(err.details || { msg: err.message });
      }
    });

    busboy.end(req.rawBody);
  } catch (err) {
    console.log(err);
    let msg = err.details ? err.details[0].message : err.msg

    if (err.details) return res.status(422).json({ msg });
    else return res.status(500).json({ msg });
  }
}

export const deleteMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');
    let { link } = await uploadFiles.getSingleDoc(req.params.id);
    let arLink = link.split("/");
    let leng = arLink.length;
    let path = `images/objects/${arLink[leng - 2]}/${arLink[leng - 1]}`

    await myBucket.file(path).delete();
    await uploadFiles.deleteDocument(req.params.id);

    return res.json({ msg: 'success deleted' });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}