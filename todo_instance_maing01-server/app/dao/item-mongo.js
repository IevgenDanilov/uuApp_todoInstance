"use strict";
const { UuObjectDao } = require("uu_appg01_server").ObjectStore;

class ItemMongo extends UuObjectDao {
  async createSchema() {
    await super.createIndex({ awid: 1, listId: 1, state: 1 }, { unique: false });
    await super.createIndex({ awid: 1, state: 1 }, { unique: false });
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

  async setFinalState(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.findOneAndUpdate(filter, uuObject, "NONE");
  }

  async delete(uuObject) {
    let filter = {
      awid: uuObject.awid,
      id: uuObject.id,
    };
    return await super.deleteOne(filter);
  }

  async deleteManyByListId({ awid, listId }) {
    let filter = {
      awid: awid,
      listId: listId,
    };
    return await super.deleteMany(filter);
  }

  async list({ awid, pageInfo }) {
    let filter = { awid };
    return await super.find(filter, pageInfo);
  }

  async listByState({ awid, state, pageInfo }) {
    let filter = {
      awid,
      state,
    };
    return await super.find(filter, pageInfo);
  }

  async listByListIdAndState({ awid, listId, state, pageInfo }) {
    let filter = {
      awid,
      listId,
    };
    if (state) {
      filter.state = state;
    }
    return await super.find(filter, pageInfo);
  }
}

module.exports = ItemMongo;
