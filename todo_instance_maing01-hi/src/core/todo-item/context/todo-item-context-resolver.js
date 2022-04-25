//@@viewOn:revision
// doc: https://uuapp.plus4u.net/uu-bookkit-maing01/4e5bbd80192946c18f33a0887d851330/book/page?code=UuPlus4uMallOrderSummaryListContextResolver
// coded: Yaroslav Harmash (8517-626-1), 22.07.2021
//@@viewOff:revision

//@@viewOn:imports
import { createComponent, useMemo } from "uu5g04-hooks";
import Config from "../../config/config.js";
import ContextHelper from "../../../helpers/context-helper.js";
import TodoItemLoader from "../todo-item-loader.js";
import useTodoItem from "./use-todo-item.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "TodoItemContextResolver",
  //@@viewOff:statics
};

export const TodoItemContextResolver = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    const todoItem = useTodoItem();
    const shouldLoadData = useMemo(() => ContextHelper.checkDataOnContext(todoItem), [todoItem]);
    //@@viewOff:hooks

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    let child = props.children;
    if (shouldLoadData) {
      child = <TodoItemLoader id={props.id}>{props.children}</TodoItemLoader>;
    }
    return child;
    //@@viewOff:render
  },
});
//viewOn:exports
export default TodoItemContextResolver;
//viewOff:exports
