import {atom} from "../atom";
import React from "react";
import Step from "../step";

export default class Confirm extends Step {
  change(e) {
    atom.swap((s) => s.set("message", e.target.value));
  }

  render() {
    return (
      <div className="step">
        <div className="header">Något mer vi behöver veta?</div>
        <div className="body">
          <textarea onChange={this.change.bind(this)} onKeyDown={this.shouldGotoNextStep.bind(this)} placeholder="Exempelvis allergier, önskemål, etc." value={this.props.state.get("message")}/>
        </div>
      </div>
    );
  }
};
