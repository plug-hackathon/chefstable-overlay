import React from "react";
import Step from "../step";

export default class Confirm extends Step {
  render() {
    return (
      <div className="step">
        <div className="header">Något mer vi behöver veta?</div>
        <div className="body">
          bekräfta
        </div>
      </div>
    );
  }
};
