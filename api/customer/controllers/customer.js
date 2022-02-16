"use strict";
const jwt = require("jsonwebtoken");
const Web3 = require("web3");
const utils = require("ethereumjs-util");

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async signIn(ctx) {
    const body = ctx.request.body;
    const customers = await strapi.services["customer"].find({
      address: body.address,
    });
    let customer;
    if (customers.length <= 0) {
      return { status: "error", messge: "not registered user" };
    } else customer = customers[0];

    const sig = body.signature;
    const msg = `I am signing my one-time nonce: ${customer.nonce}`;
    const msgBuffer = Buffer.from(msg);
    const msgHash = utils.hashPersonalMessage(msgBuffer);
    const signatureBuffer = utils.toBuffer(sig);
    const signatureParams = utils.fromRpcSig(signatureBuffer);
    const publicKey = utils.ecrecover(
      msgHash,
      signatureParams.v,
      signatureParams.r,
      signatureParams.s
    );
    const addressBuffer = utils.publicToAddress(publicKey);
    const decodedAddress = utils.bufferToHex(addressBuffer);

    if (customer.address.toLowerCase() === decodedAddress.toLowerCase()) {
      const id = customer.id;
      const token = jwt.sign(
        { id: id, address: customer.address },
        process.env.JWT_SECRET || "86aa243c-f8ab-4e0b-97b2-ca589c89149e",
        {
          expiresIn: "4d",
        }
      );
      const _res = await strapi.services["customer"].update(
        { id },
        { nonce: null }
      );
      return { ...customer, token };
    } else return { status: "error", messge: "incorrect signature" };
  },
  async createNonce(ctx) {
    const { address } = ctx.body;

    // Check if User Exists in DB
    const customers = await strapi.services["customer"].find({ address });
    let customer;
    // if Exists check if already has nonce created
    if (customers.length === 0) {
      customer = await strapi.services["customer"].create({
        address: address,
        nonce: Math.floor(Math.random() * 1000000),
      });
    } else {
      customer = customers[0];
      if (!customer.nonce) {
        const nonce = Math.floor(Math.random() * 1000000);
        customer = await strapi.services["customer"].update({ id }, { nonce });
      }
    }

    return { nonce: customer.nonce };
  },
};
