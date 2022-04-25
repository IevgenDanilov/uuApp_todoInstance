"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/list-error.js");

const WARNINGS = {
  updateUnsupportedKeys: {
    code: `${Errors.Update.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
};

class UpdateAbl {
  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("instanceMain");
  }

  async update(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const { uuAppProfileAuthorities, ...restDtoIn } = dtoIn;
    // HDS 1
    let validationResult = this.validator.validate("listUpdateDtoInType", dtoIn);
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

    const { deadline } = dtoIn;

    if (deadline && new Date(deadline) < new Date()) {
      // 3.1
      throw new Errors.Update.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline });
    }

    // HDS 4

    const uuObject = {
      ...dtoIn,
      awid,
    };

    let list;

    // 4.1.A
    try {
      list = await this.listDao.update(uuObject);
    } catch (e) {
      // 4.1.B
      throw new Errors.Update.ListDaoUpdateFailed({ uuAppErrorMap }, e);
    }

    // HDS 5
    return {
      ...list,
      uuAppErrorMap,
    };
  }
}

module.exports = new UpdateAbl();
