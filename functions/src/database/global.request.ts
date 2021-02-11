import { db, instance } from './connect';

export default class GlobalReq {
  public nameCollection: string;
  public collection: any;
  public skip: number;
  public limit: number;
  public fields: any;
  public orderBy: string;
  public where: any;
  public schema: Array<string>;


  constructor(collection: string, schema: Array<string>) {
    this.nameCollection = collection;
    this.collection = db.collection(collection);
    this.skip = 0;
    this.limit = 0;
    this.fields = {};
    this.orderBy = '';
    this.where = {};
    this.schema = schema;
  }

  public resetValues() {
    this.skip = 0;
    this.limit = 0;
    this.fields = {};
    this.orderBy = '';
    this.where = {};

    this.collection = db.collection(this.nameCollection);
  }

  public setWhere() {
    for (let ele in this.where) {
      if (typeof this.where[ele] === "object") {
        this.collection
          .orderBy(ele).startAt(this.where[ele][0]).endAt(this.where[ele][1])

        break;
      }
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
  public buildInclute(collect: Array<any>, incluteCol: Array<any>, field: string): Array<any> {
    let response = collect.map(patter => {
      for (let elem of incluteCol) {
        if (elem.id === patter[field]) {
          let { id, ...others } = elem;
          return ({ ...patter, [field.substr(0, field.length - 2)]: others });
        }
      }

      return ({ ...patter });
    })

    return response;
  }

  public setPrimitiveData() {
    if (this.skip) this.collection = this.collection.offset(this.skip);
    if (this.limit) this.collection = this.collection.limit(this.limit);
    if (this.orderBy) this.collection = this.collection.orderBy(
      this.orderBy.split(' ')[0], this.orderBy.split(' ')[1]
    );
  }

  async getCollection(filter: any = {}) {
    let { orderBy, skip, limit, fields, dimension, where, include } = filter;

    this.skip = skip || 0;
    this.limit = limit || 0;
    this.fields = fields || {};
    this.where = where || {};
    this.orderBy = orderBy || '';

    if (dimension) {
      let { lat, lon, km }: any = dimension ?? {};
      let inLength = .01 * km;

      let firstArea = (lat - inLength) * (lon - inLength);
      let secondArea = (lat + inLength) * (lon + inLength);

      this.collection = this.collection
        .where("area", "<", firstArea).where("area", ">=", secondArea);
    }

    try {
      if (!dimension) this.setWhere();
      this.setPrimitiveData();
      this.setFields();

      let datas = (await this.collection.get()).docs;
      this.resetValues();
      let resp: Array<any> = [];

      if (include) {
        let partialResp = datas.map((doc: any) => ({ id: doc.id, ...doc.data() }));

        for (let obj of include) {
          let { collection, fields } = obj ?? {};

          let idsInclude: Array<any> = [];
          let field = collection.substr(0, collection.length - 1) + "Id";

          resp = partialResp.map((ele: any) => {
            if (idsInclude.indexOf(ele[field]) == -1 && ele[field])
              idsInclude.push(ele[field]);

            return ({ ...ele })
          });

          console.log(idsInclude, obj)

          if (idsInclude.length == 0) continue;

          let response = (await db.collection(collection)
            .where(instance.FieldPath.documentId(), "in", idsInclude).select(...fields).get()).docs;

          let incluteCol = response.map((doc: any) => ({ id: doc.id, ...doc.data() }));

          partialResp = this.buildInclute(resp, incluteCol, field);
        }

        resp = partialResp;
      } else
        resp = datas.map((doc: any) => ({ id: doc.id, ...doc.data() }));

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