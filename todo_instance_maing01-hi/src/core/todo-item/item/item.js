//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "../config/config.js";
import useTodoItem from "../context/use-todo-item.js";
import DataListStateResolver from "../../../common/data-list-state-resolver.js";
import ItemView from "./view/item-view.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Item",
  nestingLevel: "bigBox",
  //@@viewOff:statics
};

export const Item = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    const todoItemDataList = useTodoItem();
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
        <DataListStateResolver dataList={todoItemDataList}>
          <ItemView todoItemDataList={todoItemDataList} />
        </DataListStateResolver>
      </div>
    );
    //@@viewOff:render
  },
});

export default Item;
