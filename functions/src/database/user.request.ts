import GlobalReq from './global.request';
import { UserComplete } from '../interface/user.interface';
import { instance } from '../database/connect';

export default class UserResquest extends GlobalReq {
  constructor(collection: string, schema: Array<string>) {
    super(collection, schema);
  }

  async userToVerify(email: string): Promise<UserComplete> {
    try {
      let targetObj: UserComplete = { id: '', name: '', email: '', password: '' };

      let resp = await this.collection.where('email', '==', email).get();

      if (resp.empty) throw new Error();
      else {
        resp.forEach((doc: any) => {
          targetObj = { id: doc.id, ...doc.data() };
        })

        return targetObj;
      }
    } catch (error) {
      console.log(error.message)

      throw new Error("incorret credentials");
    }
  }

  async setWithArray(id: string, value: any) {
    const { deleteFavorite, addFavorite, ...others } = value ?? {};

    try {
      let data = { ...others }

      if (deleteFavorite) data = {
        ...data,
        objectsFavorites: instance.FieldValue.arrayRemove(deleteFavorite)
      }

      if (addFavorite) data = {
        ...data,
        objectsFavorites: instance.FieldValue.arrayUnion(addFavorite)
      }

      await this.collection.doc(id).update(data);

      return { msg: "successful updated!" }
    } catch (error) {
      console.log(error.message)

      throw new Error('No document to update');
    }
  }
}
