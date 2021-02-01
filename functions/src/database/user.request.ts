import GlobalReq from './global.request';
import { User } from '../interface/user.interface'
import { UserComplete } from '../interface/user.interface'

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
}
