//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef, useState } from "uu5g04-hooks";
import { useRoute } from "uu5g05";
import "uu5g04-forms";
import Config from "../../config/config.js";
import Lsi from "../../lsi.js";
import TodoForm from "./todo-form.js";
import TodoItem from "../../../../routes/todo-item.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "TodoCard",
  nestingLevel: "bigBox",
  //@@viewOff:statics
};

export const TodoCard = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    const modalRef = useRef();
    const confirmModalRef = useRef();
    const [route, setRoute] = useRoute();
    const [forceDelete, setForceDelete] = useState(false);
    //@@viewOff:hooks

    const { name, deadline, description } = props.data.data;
    const { handlerMap } = props.data;

    //@@viewOn:private
    function _handleOnUpdate(modalRef, props, handlerMap) {
      modalRef.current.open({
        header: <UU5.Bricks.Lsi lsi={Lsi.updateFormHeader} />,
        content: <TodoForm values={props.data.data} onUpdate={handlerMap.update} modalRef={modalRef} />,
      });
    }
    function _handleOnDelete(confirmModalRef, props, handlerMap) {
      confirmModalRef.current.open({
        header: <UU5.Bricks.Lsi lsi={Lsi.deleteFormHeader} />,
        content: (
          <>
            <UU5.Bricks.Lsi lsi={Lsi.deleteProject} />
            <UU5.Forms.Checkbox
              value={forceDelete}
              name="forceDelete"
              onIcon="mdi-check"
              bgStyleChecked="outline"
              labelPosition="right"
              label={<UU5.Bricks.Lsi lsi={Lsi.forceDeleteProject} />}
              onChange={(opt) => {
                opt.component.onChangeDefault(opt, () => {
                  setForceDelete(!forceDelete);
                  // fix me
                });
              }}
            ></UU5.Forms.Checkbox>
          </>
        ),

        onRefuse: () => {
          [forceDelete] && setForceDelete(false);
        },
        onConfirm: () => {
          handlerMap.delete({ id: props.data.data.id, forceDelete: forceDelete }).then(() => {
            [forceDelete] && setForceDelete(false);
          });
        },
        size: "s",
      });
    }

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);

    return (
      !!props.data.data.id && (
        <div {...attrs}>
          <UU5.Bricks.Card colorSchema={"primary"} style={{ padding: "10px", textAlign: "center" }}>
            <UU5.Bricks.Header level={2} style={{ textAlign: "center" }}>
              <UU5.Bricks.Icon icon="mdi-format-list-bulleted-type" style={{ color: "white" }} />
              <span> {name}</span>
            </UU5.Bricks.Header>
            <UU5.Bricks.Table striped bordered>
              <UU5.Bricks.Table.TBody>
                <UU5.Bricks.Table.Tr>
                  <UU5.Bricks.Table.Th content="Deadline" colorSchema={"primary"}></UU5.Bricks.Table.Th>
                  <UU5.Bricks.Table.Th content={deadline} colorSchema={"primary"}></UU5.Bricks.Table.Th>
                </UU5.Bricks.Table.Tr>
                <UU5.Bricks.Table.Tr>
                  <UU5.Bricks.Table.Th
                    content="Description"
                    colorSchema={"primary"}
                    style={{ padding: "20px" }}
                  ></UU5.Bricks.Table.Th>
                  <UU5.Bricks.Table.Th content={description} colorSchema={"primary"}></UU5.Bricks.Table.Th>
                </UU5.Bricks.Table.Tr>
              </UU5.Bricks.Table.TBody>
            </UU5.Bricks.Table>
            <UU5.Bricks.Button onClick={() => _handleOnUpdate(modalRef, props, handlerMap)}>
              <UU5.Bricks.Icon icon="mdi-pencil" />
            </UU5.Bricks.Button>
            <UU5.Bricks.Button
              onClick={() => {
                setRoute("todoItem", { id: props.data.data.id }, { component: <TodoItem /> });
              }}
              content="Details"
              style={{ margin: "0 50px" }}
            />
            <UU5.Bricks.Button onClick={() => _handleOnDelete(confirmModalRef, props, handlerMap)}>
              <UU5.Bricks.Icon icon="mdi-trash-can-outline" />
            </UU5.Bricks.Button>
          </UU5.Bricks.Card>
          <UU5.Bricks.Modal ref={modalRef} />
          <UU5.Bricks.ConfirmModal ref={confirmModalRef} />
        </div>
      )
    );
    //@@viewOff:render
  },
});

export default TodoCard;
