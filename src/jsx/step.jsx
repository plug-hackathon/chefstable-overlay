import React from "react";

export default class Step extends React.Component {
  shouldGotoNextStep(e) {
    if (e.which === 9) {
      e.preventDefault();
      this.props.gotoNextStep();
    }
  }
}
