"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/item-error.js");

const WARNINGS = {
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
  itemDoesNotExist: {
    code: `${Errors.Delete.UC_CODE}itemDoesNotExist`,
    message: "Item with given id does not exist.",
  },
};

class DeleteAbl {
  constructor() {
    this.validator = Validator.load();
    this.itemDao = DaoFactory.getDao("item");
    this.listDao = DaoFactory.getDao("list");
    this.mainDao = DaoFactory.getDao("instanceMain");
  }

  async delete(uri, dtoIn, uuAppErrorMap = {}) {
    const awid = uri.getAwid();
    const { uuAppProfileAuthorities, ...restDtoIn } = dtoIn;
    // HDS 1
    let validationResult = this.validator.validate("itemDeleteDtoInType", dtoIn);
    // 1.1, 1.2
    uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.deleteUnsupportedKeys.code,
      Errors.Delete.InvalidDtoIn
    );

    // HDS 2
    const todoInstance = await this.mainDao.getByAwid(awid);
    // 2.1
    if (!todoInstance) {
      throw new Errors.Delete.TodoInstanceDoesNotExist(uuAppErrorMap, { awid });
    }
    // 2.2
    if (todoInstance.state !== "active") {
      throw new Errors.Delete.TodoInstanceIsNotInProperState(uuAppErrorMap, {
        awid: awid,
        state: todoInstance.state,
        expectedState: "active",
      });
    }

    // HDS 3

    const { id } = dtoIn;

    const item = await this.itemDao.get(awid, id);
    if (!item) {
      // 3.1
      ValidationHelper.addWarning(uuAppErrorMap, WARNINGS.itemDoesNotExist.code, WARNINGS.itemDoesNotExist.message, {
        id: id,
      });
    }

    // 3.2
    if (item.state === "completed") {
      throw new Errors.Delete.ItemIsNotInCorrectState(
        { uuAppErrorMap },
        {
          id: id,
          currentState: item.state,
          expectedStateList: ["active", "cancelled"],
        }
      );
    }

    // HDS 4

    await this.itemDao.delete({ awid, id: id });

    // HDS 5

    return {
      uuAppErrorMap,
    };
  }
}

module.exports = new DeleteAbl();
