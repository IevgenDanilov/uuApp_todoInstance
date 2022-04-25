"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ListMongo extends UuObjectDao {
  async createSchema() {
    // await super.createIndex({ awid: 1, id: 1, state: 1 }, { unique: false });
    // await super.createIndex({ awid: 1, state: 1 }, { unique: false });
  }

  async create(uuObject) {
    return await super.insertOne(uuObject);
  }

  async get(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.findOne(filter);
  }

  async update(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(awid, id) {
    let filter = {
      awid: awid,
      id: id,
    };
    return await super.deleteOne(filter);
  }

  async list(awid, pageInfo) {
    let filter = { awid };
    return await super.find(filter, pageInfo);
  }
}

module.exports = ListMongo;
