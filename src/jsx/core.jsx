import {atom} from "./atom";
import Form from "./form";
import moment from "moment";
import React from "react";
import ReactDOM from "react-dom";

require("moment/locale/sv");

class Root extends React.Component {
  constructor(props) {
    super(props);
    this.state = {state: atom.deref()};
    atom.addWatch("root", (key, ref, old, n) => {
      this.setState({state: n});
    });
  }

  render() {
    let className = this.state.state.get("open") ? "open" : "";
    return (
      <div className={className} id="root">
        <div className="overlay"/>
        <Form state={this.state.state}/>
      </div>
    );
  }
};

ReactDOM.render(
  <Root/>,
  document.querySelector("#react")
);

addEventListener("message", function (message) {
  let data = JSON.parse(message.data);
  atom.swap((s) => s.set("open", data.open));
});
