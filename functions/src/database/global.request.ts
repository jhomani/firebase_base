import { db } from './connect';

export default class GlobalReq {
  public nameCollection: string;
  public collection: any;
  public skip: number;
  public limit: number;
  public fields: any;
  public orderBy: string;
  public include: Array<any>;
  public where: any;
  public schema: Array<string>;


  constructor(collection: string, schema: Array<string>) {
    this.nameCollection = collection;
    this.collection = db.collection(collection);
    this.skip = 0;
    this.limit = 0;
    this.fields = {};
    this.orderBy = '';
    this.include = [];
    this.where = {};
    this.schema = schema;
  }

  public resetValues() {
    this.skip = 0;
    this.limit = 0;
    this.fields = {};
    this.orderBy = '';
    this.include = [];
    this.where = {};

    this.collection = db.collection(this.nameCollection);
  }

  public setWhere() {
    for (let ele in this.where) {
      this.collection = this.collection.where(ele, '==', this.where[ele]);
    }
  }

  public setFields() {
    let selected = [];
    let unSelected = [];

    for (let ele in this.fields) {
      if (this.fields[ele]) selected.push(ele);
      else unSelected.push(ele);
    }

    if (selected.length !== 0)
      this.collection = this.collection.select(...selected);
    else {
      for (let field of this.schema) {
        let add = true;

        unSelected.forEach(elem => {
          if (field == elem) add = false;
        })

        if (add) selected.push(field);
      }

      this.collection = this.collection.select(...selected);
    }
  }

  public setPrimitiveData() {
    if (this.skip) this.collection = this.collection.offset(this.skip);
    if (this.limit) this.collection = this.collection.limit(this.limit);
    if (this.orderBy) this.collection = this.collection.orderBy(
      this.orderBy.split(' ')[0], this.orderBy.split(' ')[1]
    );
  }

  async getCollection(filter: any = {}) {
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

      let datas = (await this.collection.get()).docs;
      this.resetValues();

      let resp: Array<any> = datas.map((doc: any) => ({ id: doc.id, ...doc.data() }));

      return resp;
    } catch (error) {
      console.log(error.message)

      throw new Error('No documents');
    }
  }

  async getSingleDoc(id: string, filter: any = {}) {
    let { fields } = filter;
    this.fields = fields || {};

    try {
      let resp = await this.collection.doc(id).get();

      if (!resp.exists) throw new Error();
      else return ({ id: resp.id, ...resp.data() });
    } catch (error) {
      console.log(error.message)

      throw new Error('No found document');
    }
  }

  async countDocuments(filter: any) {
    let { where } = filter;
    this.where = where || {};

    try {
      this.setWhere();

      let size = (await this.collection.get()).size;
      this.resetValues();

      return size;
    } catch (error) {
      console.log(error.message)

      throw new Error('No documents');
    }
  }

  async addDocument(value: any) {
    try {
      let res = await this.collection.add({
        ...value
      });

      return ({ ...value, id: res.id });
    } catch (error) {
      console.log(error.message)

      throw new Error('No document');
    }
  }

  async setDocument(id: string, value: any) {
    try {
      await this.collection.doc(id).update({
        ...value
      });

      return { msg: "successful updated!" }
    } catch (error) {
      console.log(error.message)

      throw new Error('No document to update');
    }
  }

  async deleteDocument(id: string) {
    try {
      const resp = await this.collection.doc(id).get();


      if (!resp.exists) throw new Error();
      else await this.collection.doc(id).delete();
    } catch (error) {
      console.log(error.message)

      throw new Error('No document to delete');
    }
  }
}