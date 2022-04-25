//@@viewOn:revision
// doc: https://uuapp.plus4u.net/uu-bookkit-maing01/4e5bbd80192946c18f33a0887d851330/book/page?code=UuPlus4uMallOrderSummaryListContextResolver
// coded: Yaroslav Harmash (8517-626-1), 22.07.2021
//@@viewOff:revision

//@@viewOn:imports
import { createComponent, useMemo } from "uu5g04-hooks";
import Config from "../../config/config.js";
import ContextHelper from "../../../helpers/context-helper.js";
import TodosLoader from "../todo-loader.js";
import useTodos from "./use-todos.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "TodosContextResolver",
  //@@viewOff:statics
};

export const TodosContextResolver = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    const todosList = useTodos();
    const shouldLoadData = useMemo(() => ContextHelper.checkDataOnContext(todosList), [todosList]);
    //@@viewOff:hooks

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    let child = props.children;
    if (shouldLoadData) {
      child = <TodosLoader>{props.children}</TodosLoader>;
    }
    return child;
    //@@viewOff:render
  },
});
//viewOn:exports
export default TodosContextResolver;
//viewOff:exports
