"use strict";
const InstanceMainAbl = require("../../abl/instance-main-abl.js");

class InstanceMainController {
  init(ucEnv) {
    return InstanceMainAbl.init(ucEnv.getUri(), ucEnv.getDtoIn(), ucEnv.getSession());
  }
}

module.exports = new InstanceMainController();
