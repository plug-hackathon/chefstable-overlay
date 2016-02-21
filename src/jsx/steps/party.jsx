import atom from "../atom";
import {map, range} from "lodash";
import React from "react";
import Step from "../step";

export default class Party extends Step {
  change(e) {
    atom.swap((s) => s.set("party", parseInt(e.target.value, 10)));
  }

  renderOption(n) {
    let size = n + 1;
    return <option key={n} value={size}>{size} {size === 1 ? "person" : "personer"}</option>;
  }

  render() {
    return (
      <div className="step">
        <div className="header">Hur många i sällskapet?</div>
        <div className="body">
          <select onChange={this.change.bind(this)} value={this.props.state.get("party")}>{map(range(10), (n) => this.renderOption(n))}</select>
        </div>
      </div>
    );
  }
};
