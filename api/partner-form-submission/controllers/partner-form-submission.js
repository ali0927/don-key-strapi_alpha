"use strict";
const nodemailer = require("nodemailer");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */


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

    const to = process.env.SUPPORT_NOTIFY_EMAIL;
    const submission = await strapi.services["partner-form-submission"].create(
      body
    );

    if (to) {
      const options = {
        from,
        to,
        subject: "Partner Form Submission",
        text: JSON.stringify(body),
      };

      await transporter.sendMail(options);
    }

    return submission;
  },
};
