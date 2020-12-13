import React from "react";
import ReactDOM from "react-dom";
import "./sass/main.scss";
import MyNextRecipe from "./MyNextRecipe/MyNextRecipe";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(<MyNextRecipe />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
