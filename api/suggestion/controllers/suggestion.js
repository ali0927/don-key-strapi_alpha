'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const nodemailer = require("nodemailer");
const from = "donkey.test.email@gmail.com";
const to = process.env.SUPPORT_NOTIFY_EMAIL;
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
    try {
      const suggestion = await strapi.services["suggestion"].create({
        ...body, 
        customer: ctx.request.user.id
      });

      /*
      if (to) {
        const options = {
          from,
          to,
          subject: "Strategy",
          text: JSON.stringify(suggestion),
        };
        await transporter.sendMail(options);
      }
      */

      return suggestion;
    } catch(e){
      console.error(e);
      return { status: 'error' }
    }
  },
  async vote(ctx) {
    const { id } = ctx.params;
    try {
      const suggestion = await strapi.services["suggestion"].findOne({ id });
      suggestion.votes.push(ctx.request.user.id);
      const _res = await strapi.services["suggestion"].update({ id }, suggestion);
      return _res;
    } catch(e){
      console.error(e);
      return { status: 'error' }
    }
  }
};
