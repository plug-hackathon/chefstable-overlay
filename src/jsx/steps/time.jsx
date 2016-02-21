import {atom} from "../atom";
import {isFinite} from "lodash";
import moment from "moment";
import React from "react";
import Step from "../step";
import {timeToText} from "../util";

export default class Time extends Step {
  renderPie(r, start, end) {
    this.timeContext.beginPath();
    this.timeContext.moveTo(r / 2, r / 2);
    this.timeContext.arc(r / 2, r / 2, r / 2, (Math.PI * 2 * start) - (Math.PI / 2), (Math.PI * 2 * end) - (Math.PI / 2));
    this.timeContext.fill();
  }

  renderTime() {
    this.timeContext.font = "600 12px proxima-nova, helvetica, arial, sans-serif";
    this.timeContext.textAlign = "center";
    this.timeContext.textBaseline = "middle";

    let r = 250;
    let tr = 220;
    let ir = 190;
    this.timeContext.clearRect(0, 0, r, r);

    this.timeContext.beginPath();
    // this.timeContext.fillStyle = "hsla(0, 0%, 0%, 0.1)";
    this.timeContext.fillStyle = "hsla(204, 70%, 53%, 0.5)";
    this.timeContext.arc(r / 2, r / 2, r / 2, 0, Math.PI * 2);
    this.timeContext.fill();

    let selectedTime = this.props.state.get("selectedTime");
    if (isFinite(selectedTime)) {
      // this.timeContext.fillStyle = "hsla(0, 0%, 0%, 0.1)";
      this.timeContext.fillStyle = "hsla(204, 70%, 53%, 0.5)";
      this.renderPie(r, selectedTime, (selectedTime + (2 / 24)) % 1);
    }

    let middleText = null;

    let time = this.props.state.get("time");
    if (isFinite(time)) {
      let offset = 1 / 24;
      let start = time > offset ? time - offset : (23 * offset) + time;
      let end = (time + offset) % 1;
      // this.timeContext.fillStyle = "hsla(0, 0%, 0%, 0.1)";
      this.timeContext.fillStyle = "hsla(204, 70%, 53%, 0.5)";
      this.renderPie(r, start, end);
      this.timeContext.fillStyle = "hsl(0, 0%, 0%)";
      middleText = timeToText(start) + " - " + timeToText(end);
    }

    this.timeContext.beginPath();
    this.timeContext.fillStyle = "hsl(0, 0%, 100%)";
    this.timeContext.arc(r / 2, r / 2, ir / 2, 0, Math.PI * 2);
    this.timeContext.fill();

    if (middleText) {
      this.timeContext.fillStyle = "hsl(0, 0%, 0%)";
      this.timeContext.fillText(middleText, 125, 125);
    }

    this.timeContext.fillStyle = "hsl(0, 0%, 100%)";
    let offset = (r - tr) / 2;
    for (let i = 0; i < 24; i++) {
      if (i < 13) {
        this.timeContext.fillText(
          ("0" + i).slice(-2),
          offset + (tr * ((2 - (Math.cos(Math.PI * (i / 12) + (Math.PI / 2)) + 1)) / 2)),
          offset + (tr * ((2 - (Math.sin(Math.PI * (i / 12) + (Math.PI / 2)) + 1)) / 2))
        );
      } else {
        this.timeContext.fillText(
          ("0" + i).slice(-2),
          offset + (tr - (tr * ((2 - (Math.cos(Math.PI * ((i - 12) / 12) + (Math.PI / 2)) + 1)) / 2))),
          offset + ((tr / 2) + ((tr / 2) - (tr * ((2 - (Math.sin(Math.PI * ((i - 12) / 12) + (Math.PI / 2)) + 1)) / 2))))
        );
      }
    }
  }

  clickOnTime() {
    let time = this.props.state.get("time");
    if (isFinite(time)) {
      atom.swap((s) => s.set("selectedTime", time > (1 / 24) ? time - (1 / 24) : (23 / 24) + time));
    }
  }

  nearestQuarter(p) {
    let minute = Math.round(1440 * p);
    let offset = minute % 15;
    return (offset > 7 ? minute + (15 - offset) : minute - offset) / 1440;
  }

  moveOnTime(e) {
    let box = e.target.getBoundingClientRect();
    let distance = Math.pow(Math.pow(Math.abs(box.left + 125 - e.clientX), 2) + Math.pow(Math.abs(box.top + 125 - e.clientY), 2), 0.5);
    if (distance <= 125) {
      atom.swap((s) => {
        return s.set("time", this.nearestQuarter((2 - ((Math.atan2(e.clientX - box.left - 125, e.clientY - box.top - 125) / Math.PI) + 1)) / 2));
      });
    } else {
      atom.swap((s) => s.set("time", null));
    }
  }

  moveOutTime() {
    atom.swap((s) => s.set("time", null));
  }

  componentDidMount() {
    this.timeContext = this.refs.time.getContext("2d");
    this.renderTime();
  }

  componentDidUpdate() {
    this.renderTime();
  }

  addMonth(n) {
    atom.swap((s) => {
      let date = moment([s.get("year"), s.get("month"), 1]).add(n, "months");
      return s.set("year", date.year()).set("month", date.month());
    });
  }

  selectDate(date) {
    atom.swap((s) => s.set("selectedDate", date).set("selectedTime", null));
  }

  renderWeek(current, start) {
    let days = [];
    for (let i = 0; i < 7; i++) {
      let day = start.clone().add(i, "days");
      let className = "";
      let fn = this.selectDate.bind(this, day.format("YYYY-MM-DD"));
      if (day.format("YYYY-MM") !== current) {
        fn = () => {};
        className += " out-of-range";
      }
      if (day.format("YYYY-MM-DD") === this.props.state.get("selectedDate")) {
        className += " selected-date";
      }
      days.push(
        <div className={"day" + className} key={i}>
          <div className="inner" onClick={fn}>{day.format("YYYY-MM") === current ? day.format("D") : null}</div>
        </div>
      );
    }
    return <div className="week" key={start.format("YYYY-MM-DD")}>{days}</div>;
  }

  renderWeeks() {
    let s = this.props.state;
    let weeks = [];
    let current = moment([s.get("year"), s.get("month"), 1]).format("YYYY-MM");
    let start = moment([s.get("year"), s.get("month"), 1]).startOf("week");
    for (let i = 0; true; i++) {
      let week = start.clone().add(i, "weeks");
      if (week.format("YYYY-MM") > current) {
        break;
      }
      weeks.push(this.renderWeek(current, week));
    }
    return weeks;
  }

  render() {
    let selectedTime = this.props.state.get("selectedTime");
    return (
      <div className="step time">
        <div className="header">Vilken tid vill {this.props.state.get("party") === 1 ? "du" : "ni"} komma?</div>
        <div className="body">
          <div className="month">
            <div className="fa fa-caret-left button" onClick={this.addMonth.bind(this, -1)}/>
            <div className="name">{moment([this.props.state.get("year"), this.props.state.get("month"), 1]).format("MMMM YYYY")}</div>
            <div className="fa fa-caret-right button" onClick={this.addMonth.bind(this, 1)}/>
          </div>
          <div className="weeks">{this.renderWeeks()}</div>
          <canvas className="time" height="250" onClick={this.clickOnTime.bind(this)} onMouseMove={this.moveOnTime.bind(this)} onMouseOut={this.moveOutTime.bind(this)} ref="time" width="250"></canvas>
          <div className="selected selected-date">
            <div className="label">Valt datum</div>
            <div className="value">{this.props.state.get("selectedDate")}</div>
          </div>
          <div className="selected">
            <div className="label">Vald tid</div>
            <div className="value">{isFinite(selectedTime) ? (timeToText(selectedTime) + " - " + timeToText((selectedTime + (2 / 24)) % 1)) : "Ingen tid vald"}</div>
          </div>
        </div>
      </div>
    );
  }
};
