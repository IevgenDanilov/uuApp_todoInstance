"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/item-error.js");

const WARNINGS = {
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
  },
};

class UpdateAbl {
  constructor() {
    this.validator = Validator.load();
    this.itemDao = DaoFactory.getDao("item");
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("instanceMain");
  }

  async update(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const { uuAppProfileAuthorities, ...restDtoIn } = dtoIn;
    // HDS 1
    let validationResult = this.validator.validate("itemUpdateDtoInType", dtoIn);
    // 1.1, 1.2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.updateUnsupportedKeys.code,
      Errors.Update.InvalidDtoIn
    );

    // HDS 2
    const todoInstance = await this.mainDao.getByAwid(awid);
    // 2.1
    if (!todoInstance) {
      throw new Errors.Update.TodoInstanceDoesNotExist(uuAppErrorMap, { awid });
    }
    // 2.2
    if (todoInstance.state !== "active") {
      throw new Errors.Update.TodoInstanceIsNotInProperState(uuAppErrorMap, {
        awid: awid,
        state: todoInstance.state,
        expectedState: "active",
      });
    }

    // HDS 3

    const { id, listId } = dtoIn;
    let item = null;

    item = await this.itemDao.get(awid, id);

    // 3.1
    if (!item) {
      throw new Errors.Update.ItemDoesNotExist({ uuAppErrorMap }, { id: id });
    }

    // 3.2
    if (item.state !== "active") {
      throw new Errors.Update.ItemIsNotInCorrectState(
        { uuAppErrorMap },
        {
          id: id,
          currentState: item.state,
          expectedState: "active",
        }
      );
    }

    // HDS 4

    const list = await this.listDao.get(awid, listId);
    if (!list) {
      throw new Errors.Update.ListDoesNotExist({ uuAppErrorMap }, dtoIn.listId);
    }

    // HDS 5

    try {
      item = await this.itemDao.update({ awid, ...dtoIn });
    } catch (e) {
      throw new Errors.Update.ItemDaoUpdateFailed({ uuAppErrorMap }, e);
    }

    // HDS 6
    return {
      ...item,
      uuAppErrorMap,
    };
  }
}

module.exports = new UpdateAbl();
