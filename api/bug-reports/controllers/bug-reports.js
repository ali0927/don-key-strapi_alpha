"use strict";
const { sanitizeEntity } = require("strapi-utils");
const { Coda } = require("coda-js");
const _ = require("lodash");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

const nodemailer = require("nodemailer");
const from = "donkey.test.email@gmail.com";
// Create reusable transporter object using SMTP transport.
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: from,
    pass: "qI5rxMq@ukO6",
  },
});

const findComponentValue = (extras, component, key) => {
  if (extras.length === 0) {
    return "Nill";
  }
  const extra = extras.find((item) => item.__component === component);
  if (!extra) {
    return "Nill";
  }
  return _.get(extra, key) || '';
};

module.exports = {
  async create(ctx) {
    const body = ctx.request.body;
    if (body.status !== "unverified") {
      body.status = "unverified";
    }
    const ticketid = Math.floor(100000 + Math.random() * 900000);
    const to = process.env.SUPPORT_NOTIFY_EMAIL;
    const reports = await strapi.services["bug-reports"].create({...body, ticketid});
    const CODA_KEY = process.env.CODA_API_KEY;
    const Result = {
      Goal: 'Make app more Stable',
      Task: body.title,
      Description: body.message,
      Attachments: findComponentValue(
        reports.Extras || [],
        "component.attachment",
        "Attachment.url"
      ),
      "Report Type": body.type,
      Urgency: body.urgency,
      "Reporter Name": body.name,
      "Reporter Wallet": findComponentValue(
        reports.Extras || [],
        "component.wallet-details",
        "walletAddress"
      ),
      "Report Date": new Date().toString(),
      "Reporter Telegram Nickname": body.telegram,
      "Ticket ID": ticketid
    };
    try {
      if (CODA_KEY) {
        const coda = new Coda(CODA_KEY);
        const table = await coda.getTable("ZeMJi5CK3W", "grid-CRRZiOJzCn");
        await table.insertRows([Result]);
      }
    } catch(e){
      console.error(e);
    }
  

    if (to) {
      const options = {
        from,
        to,
        subject: "Bug Report",
        text: JSON.stringify(Result),
      };

      await transporter.sendMail(options);
    }

    return {...reports, ticketid};
  },
  async find(ctx) {
    const override_params = { status_nin: ["unverified"] };

    const reports = await strapi.services["bug-reports"].find({
      ...(ctx.query || {}),
      ...override_params,
    });

    return reports.map((entity) => {
      const { Extras, ...rest } = entity;
      return sanitizeEntity(rest, { model: strapi.models["bug-reports"] });
    });
  },
};
