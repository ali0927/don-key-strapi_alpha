'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const body = ctx.request.body;
    try {
      const reply = await strapi.services["reply"].create({
        ...body, 
        customer: ctx.request.user.id
      });
      return reply;
    } catch(e){
      console.error(e);
      return { status: 'error' }
    }
  }, 
};
