import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Example from "./components/Example";
import Notfound from "./components/Notfound";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Example} />
                <Route component={Notfound} />
            </Switch>
        </Router>
    );
};

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
