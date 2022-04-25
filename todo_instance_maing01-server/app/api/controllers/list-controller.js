"use strict";
const CreateAbl = require("../../abl/list/create-abl.js");
const GetAbl = require("../../abl/list/get-abl.js");
const UpdateAbl = require("../../abl/list/update-abl.js");
const DeleteAbl = require("../../abl/list/delete-abl.js");
const ListAbl = require("../../abl/list/list-abl.js");

class ListController {
  create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  get(ucEnv) {
    return GetAbl.get(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  delete(ucEnv) {
    return DeleteAbl.delete(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  list(ucEnv) {
    return ListAbl.list(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new ListController();
