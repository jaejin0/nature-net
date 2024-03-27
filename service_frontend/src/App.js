import React from "react";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './LoginPage';
import SignUpPage from './SignupPage';
import SettingsPage from './SettingsPage';
import LogPage from './LogPage';
import LivestreamPage from "./LivestreamPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/logs" element={<LogPage />} />
          <Route path="/livestream" element={<LivestreamPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
