import './App.css';
import React, { useEffect, useState } from 'react';
import {BrowserRouter} from 'react-router-dom';
import { AuthWrapper } from './auth/AuthWrapper.tsx';
import "bootstrap/dist/css/bootstrap.min.css";


function App() {
  return (

    <div className="App">
      <BrowserRouter>
        <AuthWrapper/>
      </BrowserRouter>
    </div>

  );
}

export default App;
