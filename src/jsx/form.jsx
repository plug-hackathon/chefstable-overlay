import * as atom from "./atom";
import {isFinite} from "lodash";
import Confirm from "./steps/confirm";
import Contact from "./steps/contact";
import moment from "moment";
import Party from "./steps/party";
import Time from "./steps/time";
import React from "react";
import Step from "./step";
import {timeToText} from "./util";

let stepNames = [
  "Antal personer",
  "Tid",
  "Kontaktuppgifter",
  "Bekräfta"
];

export default class Form extends React.Component {
  close() {
    let bookedSuccess = this.props.state.get("booked") && this.props.state.get("bookingSuccess");
    atom.atom.swap((s) => s.set("open", false));
    setTimeout(() => {
      if (bookedSuccess) {
        atom.atom.swap(() => atom.getDefaultValues());
      }
      atom.atom.swap((s) => s.set("booked", false));
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
    atom.atom.swap((s) => s.set("step", Math.max(s.get("step") - 1, 0)));
  }

  gotoNextStep() {
    let step = this.props.state.get("step");
    if (!this.isValidStep(this.props.state, step)) {
      return;
    }
    let nextStep = step + 1;
    if (nextStep < 4) {
      atom.atom.swap((s) => s.set("step", nextStep));
    } else {
      let s = this.props.state;
      let xhr = new XMLHttpRequest();
      xhr.addEventListener("load", () => {
        if (xhr.status === 200 || xhr.status === 201) {
          atom.atom.swap((s) => s.set("booked", true));
        } else {
          atom.atom.swap((s) => s.set("booked", true).set("bookingSuccess", false));
        }
      });
      xhr.open("POST", "http://getchefstable.com/bookings");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify({
        booking: {
          email: s.get("email") || null,
          message: s.get("message") || null,
          name: s.get("name"),
          number_of_persons: s.get("party"),
          phone_number: s.get("phone") || null,
          restaurant_id: 1,
          starts_at: moment(s.get("selectedDate") + " " + timeToText(s.get("selectedTime")), "YYYY-MM-DD HH:mm")
        }
      }));
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

  tryAgain() {
    atom.atom.swap((s) => s.set("booked", false));
    setTimeout(() => {
      atom.atom.swap((s) => s.set("bookingSuccess", true));
    }, 250);
  }

  renderBooked() {
    if (this.props.state.get("booked")) {
      if (this.props.state.get("bookingSuccess")) {
        return (
          <div className="booked">
            <div className="header">Tack för din bokning!</div>
            <div className="text">Du kommer få en bekräftelse så fort vi har kollat på din bokning.</div>
            <div className="button" onClick={this.close.bind(this)}>Stäng</div>
          </div>
        );
      } else {
        return(
          <div className="booked">
            <div className="header">Något gick fel!</div>
            <div className="text">Prova igen om en stund.</div>
            <div className="button" onClick={this.tryAgain.bind(this)}>Prova igen</div>
          </div>
        );
      }
    }
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
        {this.renderBooked()}
      </div>
    );
  }
}
