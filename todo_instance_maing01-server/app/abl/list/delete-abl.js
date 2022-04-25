"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../../api/errors/list-error.js");

const WARNINGS = {
  deleteUnsupportedKeys: {
    code: `${Errors.Delete.UC_CODE}unsupportedKeys`,
    message: "DtoIn contains unsupported keys.",
  },
  listDoesNotExist: {
    code: `${Errors.Delete.UC_CODE}listDoesNotExist`,
    massege: "List with given id does not exist.",
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
    let validationResult = this.validator.validate("listDeleteDtoInType", dtoIn);
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
    const { id, forceDelete } = dtoIn;

    const list = await this.listDao.get(awid, id);
    if (!list) {
      // 3.1
      ValidationHelper.addWarning(uuAppErrorMap, WARNINGS.listDoesNotExist.code, WARNINGS.listDoesNotExist.message, {
        id: id,
      });
    }

    // HDS 4

    let activeItems = null;

    if (!forceDelete) {
      activeItems = await this.itemDao.listByListIdAndState({ awid, listId: id, ...dtoIn, state: "active" });
    }

    if (forceDelete || !activeItems.itemList.length) {
      // HDS 5
      await this.itemDao.deleteManyByListId({ awid, listId: id });
      // HDS 6
      await this.listDao.delete(awid, id);
    } else {
      throw new Errors.Delete.ListContainsActiveItems(uuAppErrorMap, { id: id, itemList: activeItems.itemList });
    }

    // HDS 7
    return { uuAppErrorMap };
  }
}

module.exports = new DeleteAbl();
