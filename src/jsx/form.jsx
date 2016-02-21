import atom from "./atom";
import {isFinite} from "lodash";
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
  close() {
    atom.swap((s) => s.set("open", false));
    setTimeout(() => {
      parent.postMessage(JSON.stringify({open: false}), "http://localhost:7000");
    }, 250);
  }

  getStyle() {
    let s = this.props.state;
    return {
      transform: "translateX(" + (s.get("width") * s.get("step") * -1) + "px)",
      width: s.get("width") * 4
    };
  }

  isValidStep(s, step) {
    if (step === 1 && !isFinite(s.get("selectedTime"))) {
      return false;
    }
    if (step === 2 && ((s.get("name").length < 1) || (s.get("phone").length < 1))) {
      return false;
    }
    return true;
  }

  gotoPreviousStep() {
    atom.swap((s) => s.set("step", Math.max(s.get("step") - 1, 0)));
  }

  gotoNextStep() {
    let step = this.props.state.get("step");
    if (!this.isValidStep(this.props.state, step)) {
      return;
    }
    let nextStep = step + 1;
    if (nextStep < 4) {
      atom.swap((s) => s.set("step", nextStep));
    } else {
      console.log("bokat");
    }
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
    let step = this.props.state.get("step");
    let className = "next";
    let name = step === 3 ? "Boka" : "Nästa steg";
    if (!this.isValidStep(this.props.state, step)) {
      className += " next-inactive";
    }
    return <div className={className} onClick={this.gotoNextStep.bind(this)}>{name}</div>;
  }

  render() {
    return (
      <div className="form">
        <div className="fa fa-times close" onClick={this.close.bind(this)}/>
        <div className="steps" style={this.getStyle()}>
          <Party gotoNextStep={this.gotoNextStep.bind(this)} state={this.props.state}/>
          <Time state={this.props.state}/>
          <Contact gotoNextStep={this.gotoNextStep.bind(this)} state={this.props.state}/>
          <Confirm gotoNextStep={this.gotoNextStep.bind(this)} state={this.props.state}/>
        </div>
        <div className="buttons">
          {this.renderPreviousButton()}
          {this.renderNextButton()}
        </div>
      </div>
    );
  }
}
