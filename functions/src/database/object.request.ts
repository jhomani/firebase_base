import GlobalReq from './global.request';

export default class ObjectRequest extends GlobalReq {
  constructor(collection: string, schema: Array<string>) {
    super(collection, schema);
  }

  addObjDocument(data: any) {
    return 'adata';
  }
}

