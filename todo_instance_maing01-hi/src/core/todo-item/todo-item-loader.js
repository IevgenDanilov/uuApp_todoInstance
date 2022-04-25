//@@viewOn:imports
import { createComponent, useDataList } from "uu5g04-hooks";
import { TodoItemContext } from "./context/context.js";

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
    const todoItemDataList = useDataList({
      handlerMap: {
        load: Calls.todoItemsList,
        create: Calls.todoItemCreate,
      },
      itemHandlerMap: {
        update: Calls.todoItemUpdate,
        delete: Calls.todoItemDelete,
        setState: Calls.todoItemSetState,
      },
      initialDtoIn: {
        listId: props.id,
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
    return <TodoItemContext.Provider value={todoItemDataList}>{props.children}</TodoItemContext.Provider>;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

export default Loader;
