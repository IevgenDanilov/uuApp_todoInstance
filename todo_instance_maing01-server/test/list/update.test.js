const { TestHelper } = require("uu_appg01_server-test");
const DbTestHelper = require("../db-test-helper");

const mainDao = new DbTestHelper("instanceMain");
const listDao = new DbTestHelper("list");

const CMD = "list/update";

const DEFAULT_DTOIN = {
  name: "Hatchery",
  description: "Successfully complete the training",
  deadline: "2022-04-30",
};

const INVALID_DTOIN = {
  id: DEFAULT_DTOIN,
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
    let result = await TestHelper.executePostCommand(CMD, { ...DEFAULT_DTOIN, id: resultCreate.id }, session);
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
      await TestHelper.executePostCommand(CMD, { ...DEFAULT_DTOIN, id: "624586d85065845634d6d358" }, session);
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
      await TestHelper.executePostCommand(CMD, { ...DEFAULT_DTOIN, id: "62473271fedc4437c87163ac" }, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
      expect(e.paramMap.awid).toEqual(TestHelper.getAwid());
      expect(e.state).not.toEqual(expect.arrayContaining(["active"]));
    }
  });

  test("HDS 4 DeadlineDateIsFromThePast", async () => {
    let expectedError = {
      code: `todo-instance-main/${CMD}/deadlineDateIsFromThePast`,
      message: "Deadline date is from the past and therefore cannot be met.",
    };
    let session = await TestHelper.login("AwidLicenseOwner", false, false);
    const dtoIn = {
      id: "624584ec3078ba435cc7cc2d",
      ...DEFAULT_DTOIN,
      deadline: "2021-03-30",
    };
    expect.assertions(4);
    try {
      await TestHelper.executePostCommand(CMD, dtoIn, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
      expect(e.paramMap.missingKeyMap).toBeUndefined();
    }
  });
});
