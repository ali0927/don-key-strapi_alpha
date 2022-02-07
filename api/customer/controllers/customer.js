'use strict';
const jwt = require("jsonwebtoken");
const Web3 = require("web3");
const utils = require('ethereumjs-util')

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
      return { status: 'error', messge: 'not registered user'};
    }
    else customer = customers[0];

    var hash = Web3.utils.sha3(customer.nonce.toString());
    const sig = body.signature;
    const {v, r, s} = utils.fromRpcSig(sig);
    const pubKey = utils.ecrecover(utils.toBuffer(hash), v, r, s);
    const addrBuf = utils.pubToAddress(pubKey);
    const decodedAddress = utils.bufferToHex(addrBuf);

    if (customer.address.toLowerCase() === decodedAddress.toLowerCase()) {
      const id = customer.id;
      const token = jwt.sign(
        { id: id, address: customer.address },
        process.env.JWT_SECRET || '86aa243c-f8ab-4e0b-97b2-ca589c89149e',
        {
          expiresIn: "4d",
        }
      );
      const _res = await strapi.services["customer"].update({ id }, { nonce: null });
      return { ...customer, token };
    }
    else return { status: 'error', messge: 'incorrect signature'};    
  },
  async getNonce(ctx) {
    const { address } = ctx.params;
    const customers = await strapi.services["customer"].find({ address });

    let customer;
    if (customers.length <= 0) {
      return { status: 'error', messge: 'not registered user'};
    }
    else customer = customers[0];
    const id = customer.id;
    const nonce = Math.floor(Math.random() * 1000000)
    const _res = await strapi.services["customer"].update({ id }, { nonce });
    return nonce;

  },
  async create(ctx) {
    const body = ctx.request.body;
    const new_customer = await strapi.services["customer"].create({
      address: body.address,
      nonce: Math.floor(Math.random() * 1000000)
    })
    return new_customer;
  }
};
