"use strict";
const { sanitizeEntity } = require("strapi-utils");

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

module.exports = {
  async create(ctx) {
    const body = ctx.request.body;
    if (body.status !== "unverified") {
      body.status = "unverified";
    }
    const to = process.env.SUPPORT_NOTIFY_EMAIL;
    const reports = await strapi.services["bug-reports"].create(body);
    if (to) {
      const options = {
        from,
        to,
        subject: "Bug Report",
        text: body.description,
      };

      await transporter.sendMail(options);
    }

    return reports;
  },
  async find(ctx) {
    const override_params = { status_nin: ["unverified"] };

    const reports = await strapi.services["bug-reports"].find({
      ...(ctx.query || {}),
      ...override_params,
    });

    return reports.map((entity) =>
      sanitizeEntity(entity, { model: strapi.models["bug-reports"] })
    );
  },
};
