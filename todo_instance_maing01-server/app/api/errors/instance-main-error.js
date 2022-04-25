"use strict";
const InstanceMainUseCaseError = require("./instance-main-use-case-error.js");

const Init = {
  UC_CODE: `${InstanceMainUseCaseError.ERROR_PREFIX}init/`,

  InvalidDtoIn: class extends InstanceMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}invalidDtoIn`;
      this.message = "DtoIn is not valid.";
    }
  },

  SchemaDaoCreateSchemaFailed: class extends InstanceMainUseCaseError {
    constructor() {
      super(...arguments);
      this.status = 500;
      this.code = `${Init.UC_CODE}schemaDaoCreateSchemaFailed`;
      this.message = "Create schema by Dao createSchema failed.";
    }
  },

  SysUuAppWorkspaceProfileSetFailed: class extends InstanceMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}sysUuAppWorkspaceProfileSetFailed`;
      this.message = "Call sys/uuAppWorkspace/profile/set failed.";
    }
  },


  TodoInstanceCreateDaoFailed: class extends InstanceMainUseCaseError {
    constructor() {
      super(...arguments);
      this.code = `${Init.UC_CODE}todoInstanceCreateDaoFailed`;
      this.message = "TodoInstance DAO create failed.";
    }
  },
};

module.exports = {
  Init,
};
