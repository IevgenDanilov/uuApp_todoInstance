//@@viewOn:imports
import { Utils, createVisualComponent, useRoute } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";
import "uu5g04-bricks";
import Config from "./config/config.js";
import TodoItemContextResolver from "../core/todo-item/context/todo-item-context-resolver.js";
import Item from "../core/todo-item/item/item.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

let TodoItem = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "TodoItem",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    const [route] = useRoute();

    //@@viewOn:private
    function _getContent() {
      // if (props.data) {
      //   return <Item data={props.data} />;
      // } else {
      return (
        <TodoItemContextResolver id={route.params.id}>
          <Item />
        </TodoItemContextResolver>
      );
      // }
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render

    const attrs = Utils.VisualComponent.getAttrs(props);
    return <div {...attrs}>{route.params.id ? _getContent() : null}</div>;
  },
  //@@viewOff:render
});

TodoItem = withRoute(TodoItem);

//@@viewOn:exports
export { TodoItem };
export default TodoItem;
//@@viewOff:exports
