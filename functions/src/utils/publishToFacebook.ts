const bizSdk = require('facebook-nodejs-business-sdk');

const accessToken = 'EAAGJeUVe4QYBAMW2ZB2NRruE6eQyklllZATQIV4ZB4qNy9vLScobDilxCLPzZByGTCzB0RLJsXZCTR8sNOfWZCuZBVOPblaPANgrxIvVneZBwPPDXlnSMrOONefUkYuni41V3p1vMQizj782ajYWYyy2kG9bZAaZCg2SzHbYAxJzZBGjQZDZD';
const accountId = 'act_2824572927862912';

const FacebookAdsApi = bizSdk.FacebookAdsApi.init(accessToken);
const AdAccount = bizSdk.AdAccount;
const Ad = bizSdk.Ad;
// const Campaign = bizSdk.Campaign;

// const account = new AdAccount(accountId);

export const mainFuntion = async () => {
  let fields: Array<any>, params;

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

    // console.log('campaign_id', campaign_id)

    // fields = [
    // ];
    // params = {
    // 	'status' : 'PAUSED',
    // 	'targeting' : {'geo_locations': {'countries': ['BO']}},
    // 	'daily_budget' : '1000',
    // 	'billing_event' : 'IMPRESSIONS',
    // 	'promoted_object' : {'page_id': "333082176820228"},
    // 	'campaign_id' : campaign_id,
    // 	'bid_amount' : '20',
    // 	'optimization_goal' : 'REACH',
    // 	'end_time': '2021-02-15T10:00:00+0000',
    // 	'name' : 'My AdSet',
    // };
    // let ad_set = await (new AdAccount(accountId)).createAdSet(
    // 	fields,
    // 	params
    // );
    // let ad_set_id = ad_set.id;
    let ad_set_id = "23847240727940713";
    // console.log('ad_set_id', ad_set_id)

    fields = [
    ];

    params = {
      'name': 'My Creative',
      'title': 'My Page Like Ad',
      "body": "My Test Ad Creative Body",
      'object_story_spec': {
        'page_id': '333082176820228',
        "link_data": {
          // "image_hash": "4ed33bd557baa52ec361a1b721b5eb6a",
          "picture": "https://static.toiimg.com/photo/72975551.cms",
          "name": "object loss",
          'description': 'for view more info and more photos please tab ther button',
          'link': 'https://www.facebook.com/Profecasa',
          'message': "try it out for other",
          'call_to_action': {
            "type": "WATCH_MORE"
          }
        },
      }
    }

    let creative = await (new AdAccount(accountId)).createAdCreative(
      fields,
      params
    );
    let creative_id = creative.id;
    console.log('creative_id', creative)

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
    // let ad_id = '23847240728250713';
    console.log('ad_id', ad_id)

    fields = [
    ];
    params = {
      'ad_format': 'DESKTOP_FEED_STANDARD',
    };

    let adInstance = new Ad(ad_id);

    let ad_previews = await adInstance.getPreviews(
      fields,
      params
    );

    let data = await adInstance.read(["status", "name", "effective_status"]);

    let buildObj = {
      id: data.id,
      status: data.effective_status,
      name: data.name,
    }

    return { preview: ad_previews[0].body, fields: buildObj }
  } catch (er) {
    console.log(er)
  }
}