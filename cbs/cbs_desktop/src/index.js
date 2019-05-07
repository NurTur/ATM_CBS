import React from "react";
import ReactDOM from "react-dom";
import Header from "./shared/header.jsx";
import "./styles/base.less";

class Main extends React.Component {
  render() {
    return (<Header />)

  }
}

ReactDOM.render(<Main />, document.getElementById("root"));