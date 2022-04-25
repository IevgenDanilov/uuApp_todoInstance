const { TestHelper } = require("uu_appg01_server-test");
const DbTestHelper = require("../db-test-helper");

const mainDao = new DbTestHelper("instanceMain");

const CMD = "list/create";

const DEFAULT_DTOIN = {
  name: "Hatchery",
  description: "Successfully complete the training",
  deadline: "2022-04-30",
};

const INVALID_DTOIN = {
  name: "Hatchery",
  description: "Successfully complete the training",
  deadline: "2022-03-31",
};

let date = null;

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
  date = new Date();
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe(`Testing the ${CMD} uuCmd...`, () => {
  test("HDS", async () => {
    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    let result = await TestHelper.executePostCommand(CMD, DEFAULT_DTOIN, session);

    expect(result.status).toEqual(200);
    expect(result.data).toMatchObject({ awid: TestHelper.getAwid(), ...DEFAULT_DTOIN });
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap).toEqual({});
  });

  test("A1.1 - InvalidDtoIn.", async () => {
    let expectedError = {
      code: `todo-instance-main/${CMD}/invalidDtoIn`,
      message: "DtoIn is not valid.",
    };
    session = await TestHelper.login("AwidLicenseOwner", false, false);
    expect.assertions(4);
    try {
      await TestHelper.executePostCommand(CMD, {}, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
      expect(e.paramMap.missingKeyMap["$.name"]).toBeDefined();
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

  test("A3.1 - deadlineDateIsFromThePast", async () => {
    let expectedError = {
      code: `todo-instance-main/${CMD}/deadlineDateIsFromThePast`,
      message: "Deadline date is from the past and therefore cannot be met.",
    };

    let session = await TestHelper.login("AwidLicenseOwner", false, false);

    expect.assertions(4);
    try {
      await TestHelper.executePostCommand(CMD, INVALID_DTOIN, session);
    } catch (e) {
      expect(e.status).toEqual(400);
      expect(e.code).toEqual(expectedError.code);
      expect(e.dtoOut.uuAppErrorMap[expectedError.code].message).toEqual(expectedError.message);
      expect(new Date(e.paramMap.deadline).getTime()).toBeLessThan(new Date(date).getTime());
    }
  });
});
