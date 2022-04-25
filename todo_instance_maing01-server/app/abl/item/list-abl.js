"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/item-error.js");

const WARNINGS = {
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
  },
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.itemDao = DaoFactory.getDao("item");
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("instanceMain");
  }

  async list(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const { uuAppProfileAuthorities, ...restDtoIn } = dtoIn;
    // HDS 1
    let validationResult = this.validator.validate("itemListDtoInType", dtoIn);
    // 1.1, 1.2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.listUnsupportedKeys.code,
      Errors.List.InvalidDtoIn
    );

    // HDS 2
    const todoInstance = await this.mainDao.getByAwid(awid);
    // 2.1
    if (!todoInstance) {
      throw new Errors.List.TodoInstanceDoesNotExist(uuAppErrorMap, { awid });
    }
    // 2.2
    if (todoInstance.state !== "active") {
      throw new Errors.List.TodoInstanceIsNotInProperState(uuAppErrorMap, {
        awid: awid,
        state: todoInstance.state,
        expectedState: "active",
      });
    }

    const { listId, state, pageInfo } = dtoIn;

    const uuObject = {
      awid,
      listId: listId,
      state: state,
      pageInfo: pageInfo,
    };

    // HDS 3

    let itemList = null;

    if (listId) {
      itemList = await this.itemDao.listByListIdAndState(uuObject);
    } else if (state) {
      itemList = await this.itemDao.listByState(uuObject);
    } else {
      itemList = await this.itemDao.list(uuObject);
    }

    // HDS 4
    return {
      ...itemList,
      uuAppErrorMap,
    };
  }
}

module.exports = new ListAbl();
