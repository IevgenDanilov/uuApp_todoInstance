import { Environment } from "uu5g05";
import Plus4U5 from "uu_plus4u5g02";

// the base URI of calls for development / staging environments can be configured in *-hi/env/development.json
// (or <stagingEnv>.json), e.g.:
//   "uu5Environment": {
//     "callsBaseUri": "http://localhost:8080/vnd-app/awid"
//   }
const CALLS_BASE_URI = (
  (process.env.NODE_ENV !== "production" ? Environment.get("callsBaseUri") : null) || Environment.appBaseUri
).replace(/\/*$/, "/");

const Calls = {
  async call(method, url, dtoIn, clientOptions) {
    const response = await Plus4U5.Utils.AppClient[method](url, dtoIn, clientOptions);
    return response.data;
  },

  // // example for mock calls
  // loadDemoContent(dtoIn) {
  //   const commandUri = Calls.getCommandUri("loadDemoContent");
  //   return Calls.call("get", commandUri, dtoIn);
  // },

  loadIdentityProfiles() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/initUve");
    return Calls.call("get", commandUri, {});
  },

  initWorkspace(dtoInData) {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/init");
    return Calls.call("post", commandUri, dtoInData);
  },

  getWorkspace() {
    const commandUri = Calls.getCommandUri("sys/uuAppWorkspace/get");
    return Calls.call("get", commandUri, {});
  },

  todosList(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("list/list");
    return Calls.call("get", commandUri, dtoIn);
  },

  todoCreate(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("list/create");
    return Calls.call("post", commandUri, dtoIn);
  },

  todoUpdate(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("list/update");
    return Calls.call("post", commandUri, dtoIn);
  },
  todoDelete(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("list/delete");
    return Calls.call("post", commandUri, dtoIn);
  },

  todoGet(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("list/get");
    return Calls.call("get", commandUri, dtoIn);
  },
  todoItemsList(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("item/list");
    return Calls.call("get", commandUri, dtoIn);
  },

  todoItemCreate(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("item/create");
    return Calls.call("post", commandUri, dtoIn);
  },

  todoItemUpdate(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("item/update");
    return Calls.call("post", commandUri, dtoIn);
  },
  todoItemSetState(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("item/setFinalState");
    return Calls.call("post", commandUri, dtoIn);
  },
  todoItemDelete(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("item/delete");
    return Calls.call("post", commandUri, dtoIn);
  },

  todoItemGet(dtoIn = {}) {
    const commandUri = Calls.getCommandUri("item/get");
    return Calls.call("get", commandUri, dtoIn);
  },

  async initAndGetWorkspace(dtoInData) {
    await Calls.initWorkspace(dtoInData);
    return await Calls.getWorkspace();
  },

  getCommandUri(useCase) {
    return CALLS_BASE_URI + useCase.replace(/^\/+/, "");
  },
};

export default Calls;
