import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './Pages/Start';
import Login from './Pages/Login';
import FindId from './Pages/FindId';
import SendTempPassword from './Pages/SendTempPassword';
import Signup from './Pages/Signup';
import SelectMode from './Pages/SelectMode';
import CreatorMode from './Pages/CreatorMode';
import Search from './Pages/Search';
import List from './Pages/List';

const App = () => {
  const [places, setPlaces] = useState([]);

  const addPlace = (place) => {
    setPlaces(prevPlaces => [...prevPlaces, place]);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/login" element={<Login />} />
        <Route path="/find-id" element={<FindId />} />
        <Route path="/send-temp-password" element={<SendTempPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/select" element={<SelectMode />} />
        <Route path="/creator" element={<CreatorMode />} />
        <Route path="/search" element={<Search addPlace={addPlace} />} />
        <Route path="/list" element={<List places={places} />} />
      </Routes>
    </Router>
  );
};

export default App;
