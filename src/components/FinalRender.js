import React, { Component } from "react";
import ReactDOM from "react-dom";

class FinalRender extends React.PureComponent {
  constructor(props) {
    super(props);
    this.containerEl = document.createElement("div");
    this.externalWindow = null;
  }

  componentDidMount() {
    this.externalWindow = window.open("", "");
    this.externalWindow.document.body.appendChild(this.containerEl);
  }

  componentWillUnmount() {
    this.externalWindow.close();
  }

  render() {
    return ReactDOM.createPortal(this.props.children, this.containerEl);
  }
}

export default FinalRender;
