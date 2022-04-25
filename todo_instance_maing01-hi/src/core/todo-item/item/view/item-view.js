//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef, useLsi } from "uu5g04-hooks";
import Uu5Tiles from "uu5tilesg02";
import { useRoute } from "uu5g05";
import Config from "../../config/config.js";
import ItemForm from "./item-form.js";
import Lsi from "../../lsi.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ItemView",
  nestingLevel: "bigBox",
  //@@viewOff:statics
};

export const ItemView = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks

    const [route, setRoute] = useRoute();
    const modalRef = useRef();
    const confirmModalRef = useRef();
    //@@viewOff:hooks

    //@@viewOn:private
    function _handleOnUpdate(modalRef, props, values, handlerMap) {
      modalRef.current.open({
        header: <UU5.Bricks.Lsi lsi={Lsi.updateFormHeader} />,
        content: <ItemForm values={values} onUpdate={handlerMap.update} modalRef={modalRef} />,
      });
    }
    function _handleOnDelete(confirmModalRef, props, handlerMap) {
      let { id } = props;
      confirmModalRef.current.open({
        header: <UU5.Bricks.Lsi lsi={Lsi.deleteFormHeader} />,
        content: <UU5.Bricks.Lsi lsi={Lsi.deleteItemFormHeader} />,
        onConfirm: () => handlerMap.delete(id),
        size: "m",
      });
    }

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render

    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);

    return (
      <div {...attrs}>
        <Uu5Tiles.ControllerProvider data={props.todoItemDataList.data}>
          <Uu5Tiles.ActionBar
            title={"Educaton notebook of Yevhen Danilov"}
            searchable={false}
            actions={getActions(props.todoItemDataList.data, setRoute, modalRef, props.todoItemDataList.handlerMap)}
          />
          <UU5.Bricks.Section colorSchema={"primary"} style={{ padding: "100px" }}>
            <Uu5Tiles.List
              columns={getColumns(
                _handleOnDelete,
                _handleOnUpdate,
                modalRef,
                confirmModalRef,
                props.todoItemDataList.data
              )}
            />
          </UU5.Bricks.Section>
        </Uu5Tiles.ControllerProvider>
        <UU5.Bricks.Modal ref={modalRef} />
        <UU5.Bricks.ConfirmModal ref={confirmModalRef} />
      </div>
    );
    //@@viewOff:render
  },
});

function getActions(itemData, setRoute, modalRef, handlerMap) {
  return [
    {
      active: true,
      icon: "mdi-keyboard-backspace",
      content: useLsi(Lsi.comeBack),
      colorSchema: "primary",
      onClick: () => {
        setRoute("todos");
      },
    },
    {
      active: true,
      icon: "mdi-plus",
      content: useLsi(Lsi.addNewTask),
      colorSchema: "primary",
      onClick: () => {
        modalRef.current.open({
          header: <UU5.Bricks.Lsi lsi={Lsi.createItemFormHeader} />,
          content: <ItemForm values={itemData} onSave={handlerMap.create} modalRef={modalRef} />,
        });
      },
    },
  ];
}

function getColumns(_handleOnDelete, _handleOnUpdate, modalRef, confirmModalRef, props) {
  return [
    {
      key: "text",
      cell: (cell) => (
        <UU5.Forms.Checkboxes
          colorSchema={"primary"}
          disabled={cell.data.data.state === "completed"}
          onChange={() => cell.data.handlerMap.setState({ state: "completed" })}
          size="xl"
          value={[
            {
              label: cell.data.data.text || "Add some text...",
              name: cell.data.data.text,
              value: cell.data.data.state === "completed",
            },
          ]}
        />
      ),

      header: useLsi(Lsi.listOfTasks),
    },
    {
      width: "50px",
      key: "update",
      cell: (cell) => (
        <UU5.Bricks.Button
          disabled={cell.data.data.state === "completed"}
          onClick={() => _handleOnUpdate(modalRef, props, cell.data.data, cell.data.handlerMap)}
        >
          <UU5.Bricks.Icon icon="mdi-pencil" />
        </UU5.Bricks.Button>
      ),
    },
    {
      width: "50px",
      key: "delete",
      cell: (cell) => (
        <UU5.Bricks.Button
          disabled={cell.data.data.state === "completed"}
          onClick={() => _handleOnDelete(confirmModalRef, props, cell.data.handlerMap)}
        >
          <UU5.Bricks.Icon icon="mdi-trash-can-outline" />
        </UU5.Bricks.Button>
      ),
    },
  ];
}

export default ItemView;
