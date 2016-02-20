import Form from "./form";
import React from "react";
import ReactDOM from "react-dom";
import state from "./state";
import Step from "./step";

class Root extends React.Component {
  constructor(props) {
    super(props);
    state.addWatch("root", (key, ref, old, n) => {
      this.forceUpdate();
    });
  }

  render() {
    return (
      <div id="root">
        <div className="overlay"/>
        <Form>
          <Step>step 1</Step>
          <Step>step 2</Step>
          <Step>step 3</Step>
          <Step>step 4</Step>
        </Form>
      </div>
    );
  }
};

ReactDOM.render(
  <Root/>,
  document.querySelector("#react")
);

state.swap((s) => s.set("width", 500));
