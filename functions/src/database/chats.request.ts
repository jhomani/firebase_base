import GlobalReq from './global.request';
// import { UserComplete } from '../interface/user.interface'
import { db, instance } from '../database/connect';
import storage from '../storage/index';

export default class ChatRequest extends GlobalReq {
  constructor(collection: string, schema: Array<string>) {
    super(collection, schema);
  }

  async getMyChats(filter: any = {}, userId: string) {
    let { orderBy, skip, limit, include, fields, where } = filter;

    this.skip = skip || 0;
    this.limit = limit || 0;
    this.fields = fields || {};
    this.where = where || {};
    this.orderBy = orderBy || '';

    try {
      this.setWhere();
      this.setPrimitiveData();
      this.setFields();

      let datas = (await this.collection.where("membersId", "array-contains", userId).get()).docs;
      this.resetValues();
      let resp: Array<any> = [];

      if (include) {
        let partialResp = datas.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          updatedAt: doc.data().updatedAt ? (new Date(doc.data().updatedAt)).toISOString() : undefined,
          createdAt: doc.data().createdAt ? (new Date(doc.data().createdAt)).toISOString() : undefined,
        }));

        for (let obj of include) {
          let { collection, fields } = obj ?? {};

          let idsInclude: Array<any> = [];
          let field = collection.substr(0, collection.length - 1) + "Id";

          resp = partialResp.map((ele: any) => {
            if (collection == 'users' && ele.membersId)
              for (let id of ele.membersId) {
                if (idsInclude.indexOf(id) == -1 && storage.getUserId() !== id)
                  idsInclude.push(id);
              }
            else
              if (idsInclude.indexOf(ele[field]) == -1 && ele[field])
                idsInclude.push(ele[field]);

            return ({ ...ele })
          });

          if (idsInclude.length == 0) continue;

          let response = (await db.collection(collection)
            .where(instance.FieldPath.documentId(), "in", idsInclude).select(...fields).get()).docs;

          let incluteCol = response.map((doc: any) => ({ id: doc.id, ...doc.data() }));

          if (collection == 'users')
            partialResp = this.buildInclute(resp, incluteCol, "membersId", true);
          else
            partialResp = this.buildInclute(resp, incluteCol, field);
        }

        resp = partialResp;
      } else
        resp = datas.map((doc: any) => ({
          id: doc.id,
          ...doc.data(),
          updatedAt: doc.data().updatedAt ? (new Date(doc.data().updatedAt)).toISOString() : undefined,
          createdAt: doc.data().createdAt ? (new Date(doc.data().createdAt)).toISOString() : undefined,
        }));

      return resp;

    } catch (error: Any) {
      console.log(error.message)

      throw new Error('No documents');
    }
  }

  async countMyChats(userId: string) {
    try {

      let size = (await this.collection.where("membersId", "array-contains", userId).get()).size;
      this.resetValues();

      return size;
    } catch (error: Any) {
      console.log(error.message)

      throw new Error('No documents');
    }
  }
}
