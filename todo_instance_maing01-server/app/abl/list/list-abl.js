"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/list-error.js");

const WARNINGS = {
  listUnsupportedKeys: {
    code: `${Errors.List.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
};

class ListAbl {
  constructor() {
    this.validator = Validator.load();
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("instanceMain");
  }

  async list(uri, dtoIn, pageInfo, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const { uuAppProfileAuthorities, ...restDtoIn } = dtoIn;
    // HDS 1
    let validationResult = this.validator.validate("listListDtoInType", dtoIn);
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

    // HDS 3
    const itemList = await this.listDao.list(awid, pageInfo);

    // HDS 4
    return {
      ...itemList,
      uuAppErrorMap,
    };
  }
}

module.exports = new ListAbl();
