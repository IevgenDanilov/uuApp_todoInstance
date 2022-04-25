const { TestHelper } = require("uu_appg01_server-test");
const DbTestHelper = require("../db-test-helper");

const mainDao = new DbTestHelper("instanceMain");
const listDao = new DbTestHelper("list");

const CMD = "list/delete";
const listCreateCMD = "list/create";
const itemCreateCMD = "item/create";

const DEFAULT_DTOIN = {
  name: "Hatchery",
  description: "Successfully complete the training",
  deadline: "2022-04-30",
};

const INVALID_DTOIN = {
  id: DEFAULT_DTOIN,
  forceDelete: false,
};

const ID_DTOIN = {
  id: "624584ec3078ba435cc7cc2d",
  forceDelete: false,
};

beforeAll(async () => {
  await TestHelper.setup();
});

beforeEach(async () => {
  await TestHelper.dropDatabase();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  await TestHelper.initUuAppWorkspace({
    name: "Yevhen_2022",
    code: "todo2022",
    description: "Plans and projects for 2022",
    uuAppProfileAuthorities: "urn:uu:GGALL",
  });
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`Testing the ${CMD} uuCmd...`, () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    let resultCreate = await listDao.insert({ awid: TestHelper.getAwid(), ...DEFAULT_DTOIN });
    let result = await TestHelper.executePostCommand(CMD, { id: resultCreate.id }, session);
    expect(result.status).toEqual(200);
    expect(result.data.uuAppErrorMap).toEqual({});
  });

  test("A1.1 - InvalidDtoIn.", async () => {
    let expectedError = { code: `todo-instance-main/${CMD}/invalidDtoIn`, message: "DtoIn is not valid." };
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    expect.assertions(3);
    try {
      await TestHelper.executePostCommand(CMD, INVALID_DTOIN, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
    }
  });

  test("A2.1 - TodoInstanceDoesNotExist.", async () => {
    let expectedError = {
      code: `todo-instance-main/${CMD}/todoInstanceDoesNotExist`,
      message: "TodoInstance does not exist.",
    };

    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    await mainDao.delete({ awid: TestHelper.getAwid() });
    expect.assertions(4);
    try {
      await TestHelper.executePostCommand(CMD, ID_DTOIN, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
      expect(e.paramMap.awid).toEqual(TestHelper.getAwid());
    }
  });

  test("A2.2 - todoInstance.state is not active", async () => {
    let expectedError = {
      code: `todo-instance-main/${CMD}/todoInstanceIsNotInProperState`,
      message: "The application is not in proper state.",
    };

    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    await mainDao.update({ awid: TestHelper.getAwid() }, { state: "nothing" }, session);
    expect.assertions(5);
    try {
      await TestHelper.executePostCommand(CMD, { id: "62473271fedc4437c87163ac" }, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
      expect(e.paramMap.awid).toEqual(TestHelper.getAwid());
      expect(e.state).not.toEqual(expect.arrayContaining(["active"]));
    }
  });

  test("A3.1 - Count of active items related to the list is more than 0", async () => {
    let expectedError = {
      code: `todo-instance-main/${CMD}/listContainsActiveItems`,
      message: "List with active items can not be deleted.",
    };
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    let resultCreate = await TestHelper.executePostCommand(listCreateCMD, DEFAULT_DTOIN, session);
    const itemCreate = {
      listId: resultCreate.data.id,
      text: "jdgdjhd",
    };
    let createItem = await TestHelper.executePostCommand(itemCreateCMD, itemCreate, session);
    expect.assertions(3);
    try {
      await TestHelper.executePostCommand(CMD, { id: resultCreate.data.id }, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
    }
  });
});
