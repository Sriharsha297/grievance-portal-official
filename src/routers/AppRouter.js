    import React from "react";
    import { BrowserRouter, Switch, Route } from "react-router-dom";
    import HomePage from "../components/HomePage";
    import NavBar from "../components/NavBar";
    import Header from "../components/Header"
    import LoginPage from "../components/LoginPage";
    import PageNotFound from "../components/NotFoundPage";
    import ShowGrievance from "../components/ShowGrievance";
    import GrievancesInZone from "../components/GrievancesInZone";
    import Footer from "../components/Footer";

    const AppRouter = () => (
        <BrowserRouter>
            <div>
            <Header/>
            <NavBar/>
                <Switch>
                    <Route path="/" exact component={LoginPage} />
                    <Route path="/official" exact component={HomePage} />
                    <Route path="/official/grievances/:id" component= {ShowGrievance}/>
                    <Route path="/official/zone/grievances" component={GrievancesInZone}/>
                    <Route component={PageNotFound} />
                </Switch>
            <Footer/>
            </div>
        </BrowserRouter>
    )

    export default AppRouter;