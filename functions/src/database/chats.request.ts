import GlobalReq from './global.request';
// import { UserComplete } from '../interface/user.interface'

export default class ChatRequest extends GlobalReq {
  constructor(collection: string, schema: Array<string>) {
    super(collection, schema);
  }

  async getMyChats(filter: any = {}, userId: string) {
    let { orderBy, skip, limit, fields, where, include } = filter;

    this.skip = skip || 0;
    this.limit = limit || 0;
    this.fields = fields || {};
    this.where = where || {};
    this.include = include || [];
    this.orderBy = orderBy || '';

    try {
      this.setWhere();
      this.setPrimitiveData();
      this.setFields();

      let datas = (await this.collection.where("members", "array-contains", userId).get()).docs;
      this.resetValues();

      let resp: Array<any> = datas.map((doc: any) => ({ id: doc.id, ...doc.data() }));

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
