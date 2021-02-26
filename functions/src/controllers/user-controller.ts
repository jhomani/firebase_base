import UserResquest from '../database/user.request';
import { Request, Response } from "express";
import secret from '../../secret';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';
import storage from "../storage/index";
import { db, instance, myBucket } from "../database/connect"
import { verify } from "jsonwebtoken";
import { sendVerifyEmail, sendResetCodeEmail } from "../utils/sendEmail"
import {
  registerSchema, loginSchema,
  patchSchema, schema,
  socialMediaSchema,
  newPasswordSchema,
  resetPasswordSchema,
  verifyCodeSchema
} from '../models/user.models';


export let users = new UserResquest('users', schema);

export const singleGet = async (req: Request, res: Response) => {
  try {
    const { password, ...others } = await users.getSingleDoc(req.params.id);

    return res.json(others);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const countMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const size = await users.countDocuments(filter);

    return res.json({ count: size });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMeUser = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const { password, verifyStatus, ...others } = await users.getSingleDoc(storage.getUserId(), filter);

    if (verifyStatus === "APPROVED")
      await users.setDocument(storage.getUserId(), { verifyStatus: 'OLD_APPROVED' });

    return res.json(others);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const getMethod = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    const arrRes = await users.getCollection(filter);

    let builded = arrRes.map(({ password, ...others }) => ({ ...others }))

    return res.json(builded);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const logoutMethod = async (req: Request, res: Response) => {
  res.json({ msg: "successful logouted!" });
}

export const loginMethod = async (req: Request, res: Response) => {
  try {
    const { password, email } = await loginSchema.validateAsync(req.body);
    let obj: any = await users.userToVerify(email);

    const result = await bcrypt.compare(password, obj.password);

    if (result) {
      if (obj.verifyStatus !== "WAITING" && obj.verifyStatus) {
        const claims = { sub: obj.id, name: obj.name }

        const jwt = JWT.sign(claims, secret, { expiresIn: '7h' });

        return res.json({ authToken: jwt });
      } else throw new Error('email is not verified')
    } else throw new Error('incorrent credentials')
  } catch (err) {
    let msg = err.details ? err.details : err.message

    if (err.details) return res.status(422).json(msg);
    else return res.status(401).json({ msg });
  }
}

export const loginSocialMedia = async (req: Request, res: Response) => {
  try {
    const { email, ...others } = await socialMediaSchema.validateAsync(req.body);
    let obj;
    let emailExist = await db.collection("users").where("email", "==", email).get();

    if (emailExist.empty) {
      let userType = (await db.collection("userType").where("name", "==", "client").get()).docs;

      obj = await users.addDocument({
        ...others,
        email,
        verifyStatus: 'APPROVED',
        userTypeId: userType[0].id
      })
    } else
      obj = { ...emailExist.docs[0].data(), id: emailExist.docs[0].id }

    const claims = { sub: obj.id, name: obj.firstName }
    const jwt = JWT.sign(claims, secret, { expiresIn: '7h' });

    return res.json({ authToken: jwt });
  } catch (err) {
    let msg = err.details ? err.details : err.message

    if (err.details) return res.status(422).json(msg);
    else return res.status(401).json({ msg });
  }
}

export const verifyEmail = async (req: Request, res: Response) => {
  try {
    let decode: any = await verify(req.params.token, secret);

    if (decode) {
      await users.setDocument(decode.sub, { verifyStatus: 'APPROVED' })

      return res.send(`<h3 style="text-align: center; margin-top: 50px">
        Se verifico exitosamente!<br> ya estas registrado...</h3>
      `);
    } else {
      res.status(401).send('you are not authenticated to this route');
    }
  } catch (err) {
    console.log(err);

    res.status(401).send(err.message)
  }
}

export const registerMethod = async (req: Request, res: Response) => {
  try {
    let { password, email, userTypeId, ...other } = await registerSchema.validateAsync(req.body);

    let emailExist = await db.collection("users").where("email", "==", email).get();
    if (!emailExist.empty) throw new Error("the email already take");

    if (!userTypeId) {
      let userType = (await db.collection("userTypes").where("abbreviation", "==", "USR").get()).docs;

      userTypeId = userType[0].id;
    }

    const hash = await bcrypt.hash(password, 12);
    let { password: psw, id, ...others } = await users.addDocument({
      ...other,
      verifyStatus: 'WAITING',
      userTypeId,
      email,
      password: hash
    });

    const claims = { sub: id, name: 'verify' }
    const jwt = JWT.sign(claims, secret, { expiresIn: '24h' });

    await sendVerifyEmail(email, `${process.env.LOCAL_URL}/users/verify-email/${jwt}`)

    return res.json(others);
  } catch (err) {
    let msg = err.details ? err.details : err.message

    if (err.details) return res.status(422).json(msg);
    else return res.status(500).json({ msg });
  }
}


export const getMyFavorites = async (req: Request, res: Response) => {
  try {
    let filter = typeof req.query.filter === 'string' && JSON.parse(req.query.filter);

    let { skip, limit, include } = filter;

    const { objectsFavorites } = await users.getSingleDoc(storage.getUserId());
    let resp;

    if (objectsFavorites) {
      let response = (await db.collection("objects")
        .where(instance.FieldPath.documentId(), "in", objectsFavorites).limit(limit || 10).offset(skip || 0).get())
        .docs;

      if (include) {
        let partialResp = response.map((doc: any) => ({ id: doc.id, ...doc.data() }));

        for (let obj of include) {
          let { collection, fields } = obj ?? {};

          let idsInclude: Array<any> = [];
          let field = collection.substr(0, collection.length - 1) + "Id";

          resp = partialResp.map((ele: any) => {
            if (collection == 'tags' && ele.tagsId)
              for (let id of ele.tagsId) {
                if (idsInclude.indexOf(id) == -1)
                  idsInclude.push(id);
              }
            else
              if (idsInclude.indexOf(ele[field]) == -1 && ele[field])
                idsInclude.push(ele[field]);

            return ({ ...ele })
          });

          if (idsInclude.length == 0) continue;

          let responseInclude = (await db.collection(collection)
            .where(instance.FieldPath.documentId(), "in", idsInclude).select(...fields).get()).docs;

          let incluteCol = responseInclude.map((doc: any) => ({ id: doc.id, ...doc.data() }));

          console.log(incluteCol)
          if (collection == 'tags')
            partialResp = users.buildInclute(resp, incluteCol, "tagsId", true);
          else
            partialResp = users.buildInclute(resp, incluteCol, field);
        }

        resp = partialResp;
      } else
        resp = response.map((doc: any) => ({ id: doc.id, ...doc.data() }));

    }
    return res.json(resp || []);
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const patchMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');
    let { rating, password, ...others } = await patchSchema.validateAsync(req.body);
    let obj;

    if (rating) {
      const { rating: old } = await users.getSingleDoc(req.params.id)

      if (old) {
        let average = ((old.average * old.totalUsers) + rating) / (old.totalUsers + 1);

        rating = { average: +average.toFixed(1), totalUsers: old.totalUsers + 1 }

        obj = await users.setWithArray(req.params.id, { ...others, rating });
      } else {
        rating = { average: rating, totalUsers: 1 }
        obj = await users.setWithArray(req.params.id, { ...others, rating });
      }
    } else
      obj = await users.setWithArray(req.params.id, { ...others });

    return res.json(obj);
  } catch (err) {
    let msg = err.details ? err.details : err.message

    if (err.details) return res.status(422).json(msg);
    else return res.status(500).json({ msg });
  }

}

export const resetPassowrd = async (req: Request, res: Response) => {
  try {
    let { email } = await resetPasswordSchema.validateAsync(req.body);

    let { id } = await users.userToVerify(email);
    let code: string = Date.now().toString().slice(9, 13);

    await sendResetCodeEmail(email, code);
    await users.setDocument(id, { resetCode: code });

    return res.json({ msg: "successful send email" });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const verifyResetCode = async (req: Request, res: Response) => {
  try {
    let { email, resetCode: userCode } = await verifyCodeSchema.validateAsync(req.body);

    let { resetCode }: any = await users.userToVerify(email);

    if (resetCode === userCode) {
      return res.json({ msg: "corrent reset code" });
    } else
      return res.status(406).json({ msg: "incorrent Code" });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const newPassowrd = async (req: Request, res: Response) => {
  try {
    let { newPassword, resetCode: userCode, email } = await newPasswordSchema.validateAsync(req.body);

    let { id, resetCode }: any = await users.userToVerify(email);

    if (resetCode === userCode) {
      const hash = await bcrypt.hash(newPassword, 12);

      await users.setDocument(id, {
        password: hash,
        resetCode: instance.FieldValue.delete()
      });

      return res.json({ msg: "successful update passoword" });
    } else
      return res.status(401).json({ msg: "incorrent Code" });

  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const deleteMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');

    await users.deleteDocument(req.params.id);

    return res.json({ msg: 'success deleted' });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}

export const deleteFileMethod = async (req: Request, res: Response) => {
  try {
    if (!req.params.id) throw new Error('id is required');
    let { avatar } = await users.getSingleDoc(req.params.id);

    if (avatar) {
      let arLink = avatar.link.split('/');
      let leng = arLink.length;

      let path = `images/${arLink[leng - 2]}/`

      await myBucket.deleteFiles({ prefix: path });
      await db.collection("uploadFiles").doc(avatar.id).delete();
    }

    await users.deleteDocument(req.params.id);

    return res.json({ msg: 'success deleted' });
  } catch (err) {
    let msg = err.message;

    return res.status(400).json({ msg });
  }
}