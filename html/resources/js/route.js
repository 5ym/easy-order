import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Top from "./components/Top";
import Notfound from "./components/Notfound";
import Pay from "./components/Pay";

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Top} />
                <Route path="/pay/:id" component={Pay} />
                <Route component={Notfound} />
            </Switch>
        </Router>
    );
};

ReactDOM.render(
    <App />,
    document.getElementById("root")
);
