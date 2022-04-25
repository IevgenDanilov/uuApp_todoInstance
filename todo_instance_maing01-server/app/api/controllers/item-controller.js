"use strict";
const CreateAbl = require("../../abl/item/create-abl.js");
const GetAbl = require("../../abl/item/get-abl.js");
const UpdateAbl = require("../../abl/item/update-abl.js");
const SetFinalStateAbl = require("../../abl/item/setFinalState-abl.js");
const DeleteAbl = require("../../abl/item/delete-abl.js");
const ListAbl = require("../../abl/item/list-abl.js");

class ItemController {
  create(ucEnv) {
    return CreateAbl.create(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  get(ucEnv) {
    return GetAbl.get(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  update(ucEnv) {
    return UpdateAbl.update(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  setFinalState(ucEnv) {
    return SetFinalStateAbl.setFinalState(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  delete(ucEnv) {
    return DeleteAbl.delete(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
  list(ucEnv) {
    return ListAbl.list(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new ItemController();
