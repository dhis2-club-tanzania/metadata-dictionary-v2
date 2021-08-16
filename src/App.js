import React from 'react'
import { DataQuery } from '@dhis2/app-runtime'
import i18n from '@dhis2/d2-i18n'
import classes from './App.module.css'


import { Route,Switch, HashRouter } from 'react-router-dom';
import HomePage from './pages/home';
import IndicatiorPage from './pages/indicator';
import Layout from './layouts/layout';
import { DataElementContextProvider } from './store/dataElementContext';
import {RecoilRoot} from "recoil";


const MyApp = () => (
    <div className={classes.container}>
        <RecoilRoot>
            <HashRouter>
                <Layout>
                    <Switch>
                        <Route path="/" exact >
                            <HomePage />
                        </Route>
                        <Route path="/indicator/:id">
                            <IndicatiorPage />
                        </Route>
                    </Switch>
                </Layout>
            </HashRouter>
        </RecoilRoot>
    </div>
)

export default MyApp
