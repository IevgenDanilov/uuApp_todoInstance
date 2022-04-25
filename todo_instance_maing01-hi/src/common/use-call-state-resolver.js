//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
import "uu_plus4u5g01-bricks";

import DataError from "./data-error";
import DataPending from "./data-pending";

import Config from "../config/config";
//@@viewOff:imports

export const UseCallStateResolver = createComponent({
  //@@viewOn:statics
  displayName: Config.TAG + "UseCallStateResolver",
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    data: UU5.PropTypes.object,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    data: {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    //@@viewOff:hooks

    //@@viewOn:handlers
    //@@viewOff:handlers

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:render
    let child = null;

    if (props.data.viewState === "call" || (props.data.viewState === "ready" && !props.data.data)) {
      child = <DataPending />;
    } else if (props.data.viewState === "error") {
      child = <DataError height={props.height} moreInfo errorData={props.data.error} />;
    } else child = props.children;

    return child;
    //@@viewOff:render
  },
});

//@@viewOn:helpers
//@@viewOff:helpers

export default UseCallStateResolver;
