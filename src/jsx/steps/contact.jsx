import {atom} from "../atom";
import {map, range} from "lodash";
import React from "react";
import Step from "../step";

export default class Contact extends Step {
  change(prop, e) {
    atom.swap((s) => s.set(prop, e.target.value));
  }

  render() {
    return (
      <div className="step">
        <div className="header">Hur kontaktar vi dig?</div>
        <div className="body">
          <input onChange={this.change.bind(this, "name")} placeholder="Namn" value={this.props.state.get("name")}/>
          <input onChange={this.change.bind(this, "phone")} placeholder="Telefonnummer" value={this.props.state.get("phone")}/>
          <input onChange={this.change.bind(this, "email")} onKeyDown={this.shouldGotoNextStep.bind(this)} placeholder="E-postadress" value={this.props.state.get("email")}/>
        </div>
      </div>
    );
  }
};
