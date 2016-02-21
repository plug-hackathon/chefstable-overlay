import atom from "./atom";
import Confirm from "./steps/confirm";
import Contact from "./steps/contact";
import Party from "./steps/party";
import Time from "./steps/time";
import React from "react";
import Step from "./step";

let stepNames = [
  "Antal personer",
  "Tid",
  "Kontaktuppgifter",
  "Bekräfta"
];

export default class Form extends React.Component {
  getStyle() {
    let s = this.props.state;
    return {
      transform: "translateX(" + (s.get("width") * s.get("step") * -1) + "px)",
      width: s.get("width") * 4
    };
  }

  gotoPreviousStep() {
    atom.swap((s) => s.set("step", Math.max(s.get("step") - 1, 0)));
  }

  gotoNextStep() {
    atom.swap((s) => s.set("step", Math.min(s.get("step") + 1, 3)));
  }

  submit() {
    console.log("bokat");
  }

  renderPreviousButton() {
    let s = this.props.state;
    if (s.get("step") !== 0) {
      return <div className="previous" onClick={this.gotoPreviousStep.bind(this)}>Tillbaka</div>;
    } else {
      return <div className="previous-inactive"/>;
    }
  }

  renderNextButton() {
    let s = this.props.state;
    if (s.get("step") !== 3) {
      // return <div className="next" onClick={this.gotoNextStep.bind(this)}>{stepNames[s.get("step") + 1]}</div>;
      return <div className="next" onClick={this.gotoNextStep.bind(this)}>Nästa steg</div>;
    } else {
      return <div className="next" onClick={this.submit.bind(this)}>Boka</div>;
    }
  }

  render() {
    return (
      <div className="form">
        <div className="steps" style={this.getStyle()}>
          <Party state={this.props.state}/>
          <Time state={this.props.state}/>
          <Contact state={this.props.state}/>
          <Confirm state={this.props.state}/>
        </div>
        <div className="buttons">
          {this.renderPreviousButton()}
          {this.renderNextButton()}
        </div>
      </div>
    );
  }
}
