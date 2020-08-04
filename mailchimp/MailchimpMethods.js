import Mailchimp from "mailchimp-api-v3";

export default class mailchimpMethods extends Mailchimp {
  constructor(
    apiKey,
    listId,
    subjectLineEmail,
    previewTextEmail,
    compaignName,
    templateId
  ) {
    super(apiKey);
    this.listId = listId;
    this.subjectLineEmail = subjectLineEmail;
    this.previewTextEmail = previewTextEmail;
    this.compaignName = compaignName;
    this.templateId = templateId;
  }

  /*
   //example promise style
   async createSegmentPromise() {
     try {
       const result = await this.post(`/lists/${this.listId}/segments/`, {
         name: this.compaignName,
         static_segment: [],
       });
       return result;
     }
     catch (err) {
       return err;
     }
   }
  */

  createSegment(callback) {
    const req = {
      method: "post",
      path: `/lists/${this.listId}/segments/`,
      body: {
        name: this.compaignName,
        static_segment: [],
      },
    };
    this.request(req, callback);
  }

  addSegmentMembers(membersList, segmentId, callback) {
    let listId = this.listId;
    let calls = [];
    membersList.forEach(function (member) {
      let req = {
        method: "post",
        path: `/lists/${listId}/segments/${segmentId}/members/`,
        body: {
          email_address: member,
        },
      };
      calls.push(req);
    });
    this.batch(calls, callback, {
      wait: true,
      interval: 2000,
      unpack: true,
    });
  }

  createCompaign(segmentId, callback) {
    const req = {
      method: "post",
      path: "/campaigns/",
      body: {
        type: "regular",
        recipients: {
          list_id: this.listId,
          segment_opts: {
            prebuilt_segment_id: segmentId.toString(),
            match: "any",
            conditions: [
              {
                condition_type: "StaticSegment",
                field: "static_segment",
                op: "static_is",
                value: segmentId,
              },
            ],
          },
        },
        settings: {
          subject_line: this.subjectLineEmail,
          preview_text: this.previewTextEmail,
          title: this.compaignName,
          from_name: "aezakmi",
          reply_to: "aezakmi-bro@aezakmi.run",
          fb_comments: false,
          template_id: this.templateId,
          to_name: "*|FNAME|* *|LNAME|*",
        },
      },
    };
    this.request(req, callback);
  }

  startSendCompaign(compaignId, callback) {
    const req = {
      method: "post",
      path: `/campaigns/${compaignId}/actions/send/`,
    };
    this.request(req, callback);
  }
}
