const { TestHelper } = require("uu_appg01_server-test");

const SYS_CODE = "sys/uuAppWorkspace";
let session = null;

beforeAll(async () => {
  await TestHelper.setup();
  await TestHelper.initUuSubAppInstance();
  await TestHelper.createUuAppWorkspace();
  session = await TestHelper.login("AwidLicenseOwner", false, false);
});

afterAll(async () => {
  await TestHelper.teardown();
});

describe("Testing the init uuCmd...", () => {
  test("HDS", async () => {
    let dtoIn = {
      name: "Yevhen_2022",
      code: "todo2022",
      description: "Plans and projects for 2022",
      uuAppProfileAuthorities: "urn:uu:GGALL",
    };

    let result = await TestHelper.executePostCommand(`${SYS_CODE}/init`, dtoIn, session);

    expect(result.status).toEqual(200);
    expect(result.data).toMatchObject({ state: "active" });
    expect(result.data.uuAppErrorMap).toBeDefined();
    expect(result.data.uuAppErrorMap).toEqual({});
  });
});
