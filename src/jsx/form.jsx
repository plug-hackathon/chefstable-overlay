import React from "react";
import state from "./state";

export default class Form extends React.Component {
  previous() {
    state.swap((s) => s.set("step", Math.max(s.get("step") - 1, 0)));
  }

  next() {
    state.swap((s) => s.set("step", Math.min(s.get("step") + 1, this.props.children.length - 1)));
  }

  getStyle(s) {
    return {
      transform: "translateX(" + (s.get("width") * s.get("step") * -1) + "px)",
      width: state.deref().get("width") * this.props.children.length
    };
  }

  render() {
    let s = state.deref();
    return (
      <div className="form">
        <div onClick={this.previous.bind(this)}>previous</div>
        <div onClick={this.next.bind(this)}>next</div>
        <div className="steps" style={this.getStyle(s)}>{this.props.children}</div>
      </div>
    );
  }
}
