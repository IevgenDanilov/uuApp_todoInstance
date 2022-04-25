//@@viewOn:imports
import { createComponent, useDataList } from "uu5g04-hooks";
import { TodosContext } from "./context/context.js";

import Config from "./config/config.js";
import Calls from "calls";
//@@viewOff:imports

export const Loader = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "Loader",
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    const todosDataList = useDataList({
      handlerMap: {
        load: Calls.todosList,
        create: Calls.todoCreate,
      },
      itemHandlerMap: {
        delete: Calls.todoDelete,
        update: Calls.todoUpdate,
      },
    });
    //@@viewOff:hooks

    //@@viewOn:handlers
    //@@viewOff:handlers

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    return <TodosContext.Provider value={todosDataList}>{props.children}</TodosContext.Provider>;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

export default Loader;
