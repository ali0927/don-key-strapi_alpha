'use strict';
const jwt = require("jsonwebtoken");
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async sign(ctx) {
    const body = ctx.request.body;
    const customers = await strapi.services["customer"].find({
      address: body.address
    });
    let customer;
    if (customers.length <= 0) {
      const new_customer = await strapi.services["customer"].create({
        address: body.address
      })
      customer = new_customer;
    }
    else customer = customers[0];

    const token = jwt.sign(
      { id: customer.id, address: customer.address },
      process.env.JWT_SECRET || '86aa243c-f8ab-4e0b-97b2-ca589c89149e',
      {
        expiresIn: "2h",
      }
    );
    return { ...customer, token };
  },
};
