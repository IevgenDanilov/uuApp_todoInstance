//@@viewOn:imports
import UU5 from "uu5g04";
import Uu5Tiles from "uu5tilesg02";
import { useRoute } from "uu5g05";
import { createVisualComponent, useRef, useLsi } from "uu5g04-hooks";
import Config from "../../config/config.js";
import Lsi from "../../lsi.js";
import TodoCard from "./todo-card.js";
import TodoForm from "./todo-form.js";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "TodosListView",
  nestingLevel: "bigBox",
  //@@viewOff:statics
};

export const TodosListView = createVisualComponent({
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
    //@@viewOff:hooks

    //@@viewOn:private
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(
      props,
      className,
      confirmModalRef,
      modalRef,
      props.todosDataList.handlerMap
    );
    return (
      <div {...attrs}>
        <Uu5Tiles.ControllerProvider data={props.todosDataList.data}>
          <Uu5Tiles.ActionBar
            title={"Educaton notebook of Yevhen Danilov"}
            searchable={false}
            actions={getActions(modalRef, props.todosDataList.handlerMap)}
          />
          <Uu5Tiles.Grid
            data={props.todosDataList.data}
            tileMinWidth={200}
            tileMaxWidth={450}
            tileSpacing={8}
            rowSpacing={8}
          >
            <TodoCard />
          </Uu5Tiles.Grid>
        </Uu5Tiles.ControllerProvider>
        <UU5.Bricks.Modal ref={modalRef} />
      </div>
    );
    //@@viewOff:render
  },
});

function getActions(modalRef, handlerMap) {
  return [
    {
      active: true,
      icon: "mdi-plus",
      content: useLsi(Lsi.addNewTodo),
      colorSchema: "primary",
      onClick: () => {
        modalRef.current.open({
          header: <UU5.Bricks.Lsi lsi={Lsi.createFormHeader} />,
          content: <TodoForm onSave={handlerMap.create} modalRef={modalRef} />,
        });
      },
    },
  ];
}

export default TodosListView;
