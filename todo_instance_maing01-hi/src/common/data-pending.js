//@@viewOn:imports
import UU5 from "uu5g04";
import "uu5g04-bricks";
import { createVisualComponent, useLsi } from "uu5g04-hooks";

import Config from "../config/config";
//@@viewOff:imports

//@@viewOn:css
const Css = {
  main: () => Config.Css.css`
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.7);
    position: absolute;
    z-index: 999;
  `,

  spinner: () => Config.Css.css`
    width: 150px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,

  loading: () => Config.Css.css`
    width: 40px;
    position: relative;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  `,
};
//@@viewOff:css

const STATICS = {
  displayName: Config.TAG + "DataPending",
  nestingLevelList: UU5.Environment.getNestingLevelList("bigBox", "inline"),
};

const DataPending = createVisualComponent({
  //@@viewOn:statics
  ...STATICS,
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    height: UU5.PropTypes.number,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    height: undefined,
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const attrs = UU5.Common.VisualComponent.getAttrs(props);
    return (
      <UU5.Bricks.Div {...attrs} className={Css.main()}>
        <UU5.Bricks.Loading />
      </UU5.Bricks.Div>
    );
    //@@viewOff:render
  },
});

//viewOn:helpers
//viewOff:helpers

//viewOn:exports
export { DataPending };
export default DataPending;
//viewOff:exports
