//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useLsi } from "uu5g04-hooks";
import { useRoute } from "uu5g05";
import Config from "../../../config/config.js";
import "uu5g04-forms";
import Lsi from "../../lsi.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ItemForm",
  nestingLevel: "bigBox",
  //@@viewOff:statics
};

export const ItemForm = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    const [route] = useRoute();
    //@@viewOff:hooks

    //@@viewOn:private
    function _handleOnSave(opt) {
      const { values } = opt;
      if (props.onSave) {
        props.onSave({ ...values, listId: route.params.id });
      } else {
        props.onUpdate({ ...values, listId: route.params.id });
      }
    }

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);

    return (
      <div {...attrs}>
        <UU5.Forms.Form onSave={_handleOnSave} onCancel={props.modalRef.current.close} values={props.values || null}>
          <UU5.Forms.Text required name="text" label={useLsi(Lsi.text)} />
          <UU5.Forms.Controls />
        </UU5.Forms.Form>
      </div>
    );
    //@@viewOff:render
  },
});

export default ItemForm;
