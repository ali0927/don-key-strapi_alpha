'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async create(ctx) {
    const body = ctx.request.body;
    try {
      const comment = await strapi.services["comment"].create({
        ...body, 
        customer: ctx.request.user.id
      });
      return comment;
    } catch(e){
      console.error(e);
      return { status: 'error' }
    }
  },
  async like(ctx) {
    const { id } = ctx.params;
    try {
      const comment = await strapi.services["comment"].findOne({ id });
      comment.likes.push(ctx.request.user.id);
      const _res = await strapi.services["comment"].update({ id }, comment);
      return _res;
    } catch(e){
      console.error(e);
      return { status: 'error' }
    }
  }
};
