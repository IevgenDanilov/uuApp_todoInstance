const { TestHelper } = require("uu_appg01_server-test");
const DbTestHelper = require("../db-test-helper");

const mainDao = new DbTestHelper("instanceMain");
const itemDao = new DbTestHelper("item");

const CMD = "item/setFinalState";
const listCreateCMD = "list/create";
const itemCreateCMD = "item/create";

const LIST_DEFAULT_DTOIN = {
  name: "Hatchery",
  description: "Successfully complete the training",
  deadline: "2022-04-30",
};

const DEFAULT_DTOIN = {
  id: "6246ce5f74795229482247c7",
  state: "completed",
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
    let resultCreate = await TestHelper.executePostCommand(listCreateCMD, LIST_DEFAULT_DTOIN, session);
    const itemCreate = {
      listId: resultCreate.data.id,
      text: "Write a workshop on backend",
      highPriority: false,
    };
    let resultItem = await TestHelper.executePostCommand(itemCreateCMD, itemCreate, session);
    let result = await TestHelper.executePostCommand(CMD, { id: resultItem.data.id, state: "completed" }, session);

    expect(result.status).toEqual(200);
    expect(result.data).toMatchObject({ awid: TestHelper.getAwid(), ...itemCreate });
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap).toEqual({});
  });

  test("A1.1 - InvalidDtoIn.", async () => {
    let expectedError = { code: `todo-instance-main/${CMD}/invalidDtoIn`, message: "DtoIn is not valid." };
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    expect.assertions(4);
    try {
      await TestHelper.executePostCommand(CMD, {}, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
      expect(e.paramMap.missingKeyMap["$.id"]).toBeDefined();
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
      await TestHelper.executePostCommand(CMD, DEFAULT_DTOIN, session);
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

    await mainDao.update({ awid: TestHelper.getAwid() }, { state: "nothing" });
    expect.assertions(5);
    try {
      await TestHelper.executePostCommand(CMD, DEFAULT_DTOIN, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
      expect(e.paramMap.awid).toEqual(TestHelper.getAwid());
      expect(e.state).not.toEqual(expect.arrayContaining(["active"]));
    }
  });

  test("A3.1 - Item does not exist", async () => {
    let expectedError = {
      code: `todo-instance-main/${CMD}/itemDoesNotExist`,
      message: "Item with given id does not exist.",
    };
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    let resultCreate = await TestHelper.executePostCommand(listCreateCMD, LIST_DEFAULT_DTOIN, session);
    const itemCreate = {
      listId: resultCreate.data.id,
      text: "Write a workshop on backend",
      highPriority: false,
    };
    let resultItem = await TestHelper.executePostCommand(itemCreateCMD, itemCreate, session);
    expect.assertions(3);
    try {
      await TestHelper.executePostCommand(CMD, { ...DEFAULT_DTOIN }, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
    }
  });

  test("A3.2 - item is not in active state", async () => {
    let expectedError = {
      code: `todo-instance-main/${CMD}/itemIsNotInProperState`,
      message: "Item is not in proper state.",
    };

    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    let resultCreate = await TestHelper.executePostCommand(listCreateCMD, LIST_DEFAULT_DTOIN, session);
    const itemCreate = {
      listId: resultCreate.data.id,
      text: "Write a workshop on backend",
      highPriority: false,
    };
    // let resultItem = await TestHelper.executePostCommand(itemCreateCMD, itemCreate, session);
    let resultItem = await itemDao.insert({ awid: TestHelper.getAwid(), ...itemCreate, state: "completed" });
    console.log("2resultItem", resultItem);
    expect.assertions(3);
    try {
      await TestHelper.executePostCommand(CMD, { id: resultItem.id, state: "completed" }, session);
    } catch (e) {
      console.log("3e", e);
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
    }
  });
});
