import React from 'react';
import Sidebar from './components/Sidebar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ToplistPage from './pages/ToplistPage';
import ReviewPage from './pages/ReviewPage';
import BooksPage from './pages/BooksPage';
import ProfilePage from './pages/ProfilePage';
import FAQPage from './pages/FAQPage';
import LoginPage from './pages/LoginPage'

import './css/main.css';

export default class Laskuppen extends React.Component {

    constructor(props) {
        super();
    }

    render() {
        return (
            
            <BrowserRouter>
                <div className="main-general-styling">
                    <div className="main-sidebar-container">
                        <Sidebar />
                    </div>
                    <div className="main-page-container">
                        <Switch>
                        <Route exact path="/teacher" render={(props) => <LoginPage {...props} />} />
                            <Route exact path="/toplist" render={(props) => <ToplistPage {...props} />} />
                            <Route exact path="/makereview" render={(props) => <ReviewPage  {...props} />} />
                            <Route exact path="/books" render={(props) => <BooksPage {...props} />} />
                            <Route exact path="/profile" render={(props) => <ProfilePage {...props} />} />
                            <Route exact path="/faq" render={(props) => <FAQPage {...props} />} />
                        </Switch>
                    </div>
                </div>
            </BrowserRouter>)
    };

}
