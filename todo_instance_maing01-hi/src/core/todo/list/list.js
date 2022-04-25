//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef } from "uu5g04-hooks";
import Config from "../config/config.js";
import useTodos from "../context/use-todos.js";
import DataListStateResolver from "../../../common/data-list-state-resolver.js";
import TodosListView from "./view/list-view.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "TodosList",
  nestingLevel: "bigBox",
  //@@viewOff:statics
};

export const TodosList = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    const todosDataList = useTodos();
    const modalRef = useRef();
    //@@viewOff:hooks

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    return (
      <div {...attrs}>
        <DataListStateResolver dataList={todosDataList}>
          <TodosListView todosDataList={todosDataList} modalRef={modalRef} />
        </DataListStateResolver>
      </div>
    );
    //@@viewOff:render
  },
});

export default TodosList;
