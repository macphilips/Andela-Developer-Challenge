import React from 'react';
import Navbar from './component/Navbar';
import Footer from './component/Footer';
import Body from './component/Body';
import Toast from './component/notification/Toast';

const App = () => (
  <React.Fragment>
    <Navbar/>
    <Body/>
    <Footer/>
    <Toast/>
  </React.Fragment>
);
export default App;
