"use strict";
const { Validator } = require("uu_appg01_server").Validation;
const { DaoFactory } = require("uu_appg01_server").ObjectStore;
const { ValidationHelper } = require("uu_appg01_server").AppServer;
const { Profile, UuAppWorkspaceError } = require("uu_appg01_server").Workspace;
const Errors = require("../api/errors/instance-main-error.js");

const WARNINGS = {
  initUnsupportedKeys: {
    code: `${Errors.Init.UC_CODE}unsupportedKeys`,
  },
};

class InstanceMainAbl {
  constructor() {
    this.validator = Validator.load();
    this.dao = DaoFactory.getDao("instanceMain");
  }

  async init(uri, dtoIn) {
    const awid = uri.getAwid();
    const { uuAppProfileAuthorities, ...restDtoIn } = dtoIn;
    // HDS 1
    let validationResult = this.validator.validate("sysUuAppWorkspaceInitDtoInType", dtoIn);
    // A1, A2
    let uuAppErrorMap = ValidationHelper.processValidationResult(
      dtoIn,
      validationResult,
      WARNINGS.initUnsupportedKeys.code,
      Errors.Init.InvalidDtoIn
    );

    // HDS 2
    const schemas = ["instanceMain", "list", "item"];
    let schemaCreateResults = schemas.map(async (schema) => {
      try {
        return await DaoFactory.getDao(schema).createSchema();
      } catch (e) {
        // A3
        throw new Errors.Init.SchemaDaoCreateSchemaFailed({ uuAppErrorMap }, { schema }, e);
      }
    });
    await Promise.all(schemaCreateResults);

    // HDS 3
    try {
      await Profile.set(awid, "Authorities", uuAppProfileAuthorities);
    } catch (e) {
      if (e instanceof UuAppWorkspaceError) {
        // A4
        throw new Errors.Init.SysUuAppWorkspaceProfileSetFailed({ uuAppErrorMap }, { role: uuAppProfileAuthorities }, e);
      }
      throw e;
    }

    // HDS 4
    let todoInstance;

    const uuObject = {
      ...restDtoIn,
      awid,
      state: "active",
    };
    try {
      todoInstance = await this.dao.create(uuObject);
    } catch (e) {
      // 4.2.B.1
      throw new Errors.Init.TodoInstanceCreateDaoFailed({ uuAppErrorMap }, e);
    }

    // HDS 5
    return {
      ...todoInstance,
      uuAppErrorMap,
    };
  }
}

module.exports = new InstanceMainAbl();
