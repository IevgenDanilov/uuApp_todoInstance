"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/item-error.js");

const WARNINGS = {
  setFinalStateUnsupportedKeys: {
    code: `${Errors.SetFinalState.UC_CODE}unsupportedKeys`,
  },
};

class setFinalStateAbl {
  constructor() {
    this.validator = Validator.load();
    this.itemDao = DaoFactory.getDao("item");
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("instanceMain");
  }

  async setFinalState(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const { uuAppProfileAuthorities, ...restDtoIn } = dtoIn;
    // HDS 1
    let validationResult = this.validator.validate("itemSetFinalStateDtoInType", dtoIn);
    // 1.1, 1.2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.setFinalStateUnsupportedKeys.code,
      Errors.SetFinalState.InvalidDtoIn
    );

    // HDS 2
    const todoInstance = await this.mainDao.getByAwid(awid);
    // 2.1
    if (!todoInstance) {
      throw new Errors.SetFinalState.TodoInstanceDoesNotExist(uuAppErrorMap, { awid });
    }
    // 2.2
    if (todoInstance.state !== "active") {
      throw new Errors.SetFinalState.TodoInstanceIsNotInProperState(uuAppErrorMap, {
        awid: awid,
        state: todoInstance.state,
        expectedState: "active",
      });
    }

    // HDS 3

    const { id, state } = dtoIn;
    let item = null;

    item = await this.itemDao.get(awid, id);

    // 3.1
    if (!item) {
      throw new Errors.SetFinalState.ItemDoesNotExist({ uuAppErrorMap }, { id: id });
    }

    // 3.2
    if (item.state !== "active") {
      throw new Errors.SetFinalState.ItemIsNotInProperState(
        { uuAppErrorMap },
        {
          id: id,
          state: item.state,
          expectedState: "active",
        }
      );
    }

    // HDS 4
    item = await this.itemDao.setFinalState({ awid, ...dtoIn });

    // HDS 5

    return {
      ...item,
      uuAppErrorMap,
    };
  }
}

module.exports = new setFinalStateAbl();
