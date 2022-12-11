import { db } from "../database/connect";

const bizSdk = require('facebook-nodejs-business-sdk');

const accessToken = 'EAAGJeUVe4QYBAMW2ZB2NRruE6eQyklllZATQIV4ZB4qNy9vLScobDilxCLPzZByGTCzB0RLJsXZCTR8sNOfWZCuZBVOPblaPANgrxIvVneZBwPPDXlnSMrOONefUkYuni41V3p1vMQizj782ajYWYyy2kG9bZAaZCg2SzHbYAxJzZBGjQZDZD';
const accountId = 'act_2824572927862912';

bizSdk.FacebookAdsApi.init(accessToken);
const AdAccount = bizSdk.AdAccount;
export const Ad = bizSdk.Ad;
// const Campaign = bizSdk.Campaign;

// const account = new AdAccount(accountId);

export const mainFuntion = async (arg: any) => {
  let {
    amount, radius,
    latitude, longitude,
    objectId, end_date,
    start_date
  } = arg ?? {}

  let fields: Array<any>, params;

  let buildAmount: number = amount * 100
  let buildRadio: number = Math.round(radius / 1.60934)

  try {
    // fields = [
    // ];
    // params = {
    // 	'objective' : 'REACH',
    // 	'status' : 'PAUSED',
    // 	'buying_type' : 'AUCTION',
    // 	'name' : 'My Campaign',
    // 	'special_ad_categories': 'NONE'
    // };
    // let campaign = await (new AdAccount(accountId)).createCampaign(
    // 	fields,
    // 	params
    // );

    // let campaign_id = campaign.id;
    let campaign_id = "23847240727810713";

    fields = [
    ];
    params = {
      'status': 'PAUSED',
      'targeting': {
        "age_max": 65,
        "age_min": 18,
        "geo_locations": {
          "custom_locations": [
            {
              "distance_unit": "mile",
              "radius": buildRadio,
              "latitude": latitude,
              "longitude": longitude,
            }
          ],
          "location_types": [
            "home",
            "recent"
          ]
        }
      },
      'daily_budget': buildAmount + "",
      'billing_event': 'IMPRESSIONS',
      'promoted_object': { 'page_id': "333082176820228" },
      'campaign_id': campaign_id,
      'bid_amount': '20',
      'optimization_goal': 'REACH',
      'end_time': end_date,
      'start_time': start_date,
      'name': 'My AdSet',
    };
    let ad_set = await (new AdAccount(accountId)).createAdSet(
      fields,
      params
    );
    let ad_set_id = ad_set.id;

    fields = [
    ];

    let resp = await db.collection('objects').doc(objectId).get();
    let dataSigle: any = { id: resp.id, ...resp.data() }

    let arrayChild: Array<any> = []

    for (let elem of dataSigle.images) {
      arrayChild.push({
        "picture": elem.link,
        "name": dataSigle.name,
        'description': 'para mas detalles.',
        'link': 'https://www.facebook.com/Profecasa',
        'call_to_action': {
          "type": "WATCH_MORE"
        }
      })
    }

    params = {
      'name': 'loss objects',
      'title': 'Object loss ad',
      'object_story_spec': {
        'page_id': '333082176820228',
        "link_data": {
          "child_attachments": arrayChild,
          'link': 'https://www.facebook.com/Profecasa',
          'message': dataSigle.description,
          'multi_share_end_card': false,
        },
      }
    }

    let creative = await (new AdAccount(accountId)).createAdCreative(
      fields,
      params
    );
    let creative_id = creative.id;

    fields = [
    ];
    params = {
      'status': 'PAUSED',
      'adset_id': ad_set_id,
      'name': 'My Ad',
      'creative': { 'creative_id': creative_id },
      'ad_format': 'DESKTOP_FEED_STANDARD',
    };
    let ad = await (new AdAccount(accountId)).createAd(
      fields,
      params
    );
    let ad_id = ad.id;

    let adInstance = new Ad(ad_id);
    let data = await adInstance.read(["status", "effective_status"]);

    await db.collection('objects').doc(objectId).update({
      adStatus: data.effective_status,
      adId: ad_id
    })

    return { ad_status: data.effective_status }
  } catch (er: Any) {
    console.log(er)

    throw new Error(er.message);
  }
}