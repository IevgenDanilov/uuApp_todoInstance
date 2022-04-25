"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/list-error.js");

const WARNINGS = {
  createUnsupportedKeys: {
    code: `${Errors.Create.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
};

class CreateAbl {
  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("instanceMain");
  }

  async create(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const { uuAppProfileAuthorities, ...restDtoIn } = dtoIn;
    // HDS 1
    let validationResult = this.validator.validate("listCreateDtoInType", dtoIn);
    // A1, A2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.createUnsupportedKeys.code,
      Errors.Create.InvalidDtoIn
    );

    // HDS 2
    const todoInstance = await this.mainDao.getByAwid(awid);
    // 1.1
    if (!todoInstance) {
      throw new Errors.Create.TodoInstanceDoesNotExist(uuAppErrorMap, { awid });
    }
    // 1.2
    if (todoInstance.state !== "active") {
      throw new Errors.Create.TodoInstanceIsNotInProperState(uuAppErrorMap, {
        awid: awid,
        state: todoInstance.state,
        expectedState: "active",
      });
    }

    // HDS 3

    const { deadline } = dtoIn;

    if (deadline && new Date(deadline) < new Date()) {
      throw new Errors.Create.DeadlineDateIsFromThePast({ uuAppErrorMap }, { deadline });
    }

    // HDS 4

    const uuObject = {
      awid,
      ...dtoIn,
    };

    let list = null;
    try {
      list = await this.listDao.create(uuObject);
    } catch (e) {
      throw new Errors.Create.ListDaoCreateFailed({ uuAppErrorMap }, e);
    }

    // HDS 5
    return {
      ...list,
      uuAppErrorMap,
    };
  }
}

module.exports = new CreateAbl();
