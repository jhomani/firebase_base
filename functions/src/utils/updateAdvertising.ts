import { Ad } from "./publishToFacebook"
import { db } from "../database/connect";

export async function updateAd(datas: Array<any>) {
  datas.forEach(async (elem, index) => {
    if (elem.adId) {
      let adInstance = new Ad(elem.adId);
      let fresp = await adInstance.read(["effective_status"]);

      if (fresp.effective_status !== elem.adStatus) {
        await db.collection('objects').doc(elem.id).update({
          adStatus: fresp.effective_status,
        })

        datas[index].adStatus = fresp.effective_status
      }
    }
  })

  return datas;
}