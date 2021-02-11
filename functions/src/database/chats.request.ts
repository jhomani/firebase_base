import GlobalReq from './global.request';
// import { UserComplete } from '../interface/user.interface'
import { db, instance } from '../database/connect';
import storage from '../storage/index';

export default class ChatRequest extends GlobalReq {
  constructor(collection: string, schema: Array<string>) {
    super(collection, schema);
  }

  public buildChat(collect: Array<any>, incluteCol: Array<any>, field: string): Array<any> {

    let response = collect.map(patter => {
      let usersData: Array<any> = [];

      for (let elem of incluteCol) {
        if (patter[field].indexOf(elem.id) !== -1) {
          let { id, password, ...others } = elem;

          usersData.push(others);
        }
      }

      return ({ ...patter, users: usersData });
    })

    return response;
  }

  async getMyChats(filter: any = {}, userId: string) {
    let { orderBy, skip, limit, fields, where, userFields } = filter;

    this.skip = skip || 0;
    this.limit = limit || 0;
    this.fields = fields || {};
    this.where = where || {};
    this.orderBy = orderBy || '';

    userFields = userFields || ["firstName", "avatar", "rating", "phone"]
    try {
      this.setWhere();
      this.setPrimitiveData();
      this.setFields();

      let datas = (await this.collection.where("members", "array-contains", userId).get()).docs;
      this.resetValues();

      let idsInclude: Array<any> = [];

      let resp: Array<any> = datas.map((ele: any) => {
        for (let id of ele.data().members) {
          if (idsInclude.indexOf(id) == -1 && storage.getUserId() !== id)
            idsInclude.push(id);
        }

        return ({ id: ele.id, ...ele.data() });
      })

      console.log(idsInclude)

      let response = (await db.collection('users')
        .where(instance.FieldPath.documentId(), "in", idsInclude).select(...userFields).get()).docs;

      let incluteCol = response.map((doc: any) => ({ id: doc.id, ...doc.data() }));

      resp = this.buildChat(resp, incluteCol, "members");

      return resp;
    } catch (error) {
      console.log(error.message)

      throw new Error('No documents');
    }
  }

  async countMyChats(userId: string) {
    try {

      let size = (await this.collection.where("members", "array-contains", userId).get()).size;
      this.resetValues();

      return size;
    } catch (error) {
      console.log(error.message)

      throw new Error('No documents');
    }
  }
}
