//@@viewOn:imports
import { Utils, createVisualComponent } from "uu5g05";
import { withRoute } from "uu_plus4u5g02-app";
import "uu5g04-bricks";
import Config from "./config/config.js";
import TodosContextResolver from "../core/todo/context/todos-context-resolver.js";
import TodosList from "../core/todo/list/list.js";
//@@viewOff:imports

//@@viewOn:constants
//@@viewOff:constants

//@@viewOn:css
//@@viewOff:css

//@@viewOn:helpers
//@@viewOff:helpers

let Todos = createVisualComponent({
  //@@viewOn:statics
  uu5Tag: Config.TAG + "Todos",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render

    const attrs = Utils.VisualComponent.getAttrs(props);
    return (
      <div {...attrs}>
        <TodosContextResolver>
          <TodosList />
        </TodosContextResolver>
      </div>
    );
  },
  //@@viewOff:render
});

Todos = withRoute(Todos);

//@@viewOn:exports
export { Todos };
export default Todos;
//@@viewOff:exports
