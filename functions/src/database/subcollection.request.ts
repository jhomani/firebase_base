import { db } from './connect';

export default class SubCollectionReq {
  public skip: number;
  public limit: number;
  public fields: any;
  public orderBy: string;
  public include: Array<any>;
  public where: any;
  public schema: Array<string>;
  public collection: string;
  public subCollection: string;


  constructor(collection: string, schema: Array<string>, subCollection: string) {
    this.collection = collection;
    this.skip = 0;
    this.limit = 0;
    this.fields = {};
    this.orderBy = '';
    this.include = [];
    this.where = {};
    this.schema = schema;
    this.subCollection = subCollection;
  }

  public resetValues() {
    this.skip = 0;
    this.limit = 0;
    this.fields = {};
    this.orderBy = '';
    this.include = [];
    this.where = {};
  }

  public setWhere(collection: any) {
    for (let ele in this.where) {
      collection = collection.where(ele, '==', this.where[ele]);
    }

    return collection
  }


  public setFields(collection: any) {
    let selected = [];
    let unSelected = [];

    for (let ele in this.fields) {
      if (this.fields[ele]) selected.push(ele);
      else unSelected.push(ele);
    }

    if (selected.length !== 0)
      collection = collection.select(...selected);
    else {
      for (let field of this.schema) {
        let add = true;

        unSelected.forEach(elem => {
          if (field == elem) add = false;
        })

        if (add) selected.push(field);
      }

      collection = collection.select(...selected);
    }

    return collection;
  }

  public setPrimitiveData(collection: any) {
    if (this.skip) collection = collection.offset(this.skip);
    if (this.limit) collection = collection.limit(this.limit);
    if (this.orderBy) collection = collection.orderBy(
      this.orderBy.split(' ')[0], this.orderBy.split(' ')[1]
    );

    return collection;
  }

  async getCollection(filter: any = {}, docId: string) {
    let { orderBy, skip, limit, fields, where, include } = filter;

    let collection = db.collection(`/${this.collection}/${docId}/${this.subCollection}`);

    this.skip = skip || 0;
    this.limit = limit || 0;
    this.fields = fields || {};
    this.where = where || {};
    this.include = include || [];
    this.orderBy = orderBy || '';

    try {
      collection = this.setWhere(collection);
      collection = this.setPrimitiveData(collection);
      collection = this.setFields(collection);

      let datas = (await collection.get()).docs;
      this.resetValues();

      let resp: Array<any> = datas.map((doc: any) => ({ id: doc.id, ...doc.data() }));

      return resp;
    } catch (error) {
      console.log(error.message)

      throw new Error('No documents');
    }
  }

  async getSingleDoc(id: string, docId: string) {
    let collection = db.collection(`/${this.collection}/${docId}/${this.subCollection}`);

    try {
      let resp = await collection.doc(id).get();

      if (!resp.exists) throw new Error();
      else return ({ id: resp.id, ...resp.data() });
    } catch (error) {
      console.log(error.message)

      throw new Error('No found document');
    }
  }

  async countDocuments(filter: any, docId: string) {
    let { where } = filter;
    this.where = where || {};

    let collection = db.collection(`/${this.collection}/${docId}/${this.subCollection}`);

    try {
      collection = this.setWhere(collection);

      let size = (await collection.get()).size;
      this.resetValues();

      return size;
    } catch (error) {
      console.log(error.message)

      throw new Error('No documents');
    }
  }

  async addDocument(value: any, docId: string) {

    let collection = db.collection(`/${this.collection}/${docId}/${this.subCollection}`);

    try {
      let res = await collection.add({
        ...value
      });

      return ({ ...value, id: res.id });
    } catch (error) {
      console.log(error.message)

      throw new Error('No document');
    }
  }

  async setDocument(id: string, value: any, docId: string) {

    let collection = db.collection(`/${this.collection}/${docId}/${this.subCollection}`);

    try {
      await collection.doc(id).update({
        ...value
      });

      return { msg: "successful updated!" }
    } catch (error) {
      console.log(error.message)

      throw new Error('No document to update');
    }
  }

  async deleteDocument(id: string, docId: string) {

    let collection = db.collection(`/${this.collection}/${docId}/${this.subCollection}`);

    try {
      const resp = await collection.doc(id).get();

      if (!resp.exists) throw new Error();
      else await collection.doc(id).delete();
    } catch (error) {
      console.log(error.message)

      throw new Error('No document to delete');
    }
  }
}