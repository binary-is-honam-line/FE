import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Start from './Pages/Start';
import Login from './Pages/Login';
import FindId from './Pages/FindId';
import SendTempPassword from './Pages/SendTempPassword';
import Signup from './Pages/Signup';

import PrivateRoute from './Pages/PrivateRoute';
import SelectMode from './Pages/SelectMode';
import CreatorMode from './Pages/CreatorMode';
import Search from './Pages/Search';
import List from './Pages/List';
import PlayerMode from './Pages/PlayerMode';
import Mypage from './Pages/Mypage';
import Edit from './Pages/Edit';
import PasswordReset from './Pages/PasswordReset';
import Stage from './Pages/Stage';
import Ai from './Pages/Ai';
import LocationSelector from './Pages/LocationSelector';

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

        {/* Private Routes */}
        <Route path="/select" element={<PrivateRoute element={<SelectMode />} />} />
        <Route path="/creator" element={<PrivateRoute element={<CreatorMode />} />} />
        <Route path="/locationselector" element={<PrivateRoute element={<LocationSelector />} />} />

        {/* questId를 파라미터로 받는 Search 라우트 */}
        <Route path="/search/:questId" element={<PrivateRoute element={<Search addPlace={addPlace} />} />} />

        {/* questId를 파라미터로 받는 List 라우트 */}
        <Route path="/list/:questId" element={<PrivateRoute element={<List places={places} />} />} />
        
        {/* questId와 stageId를 파라미터로 받는 Stage 라우트 */}
        <Route path="/stage/:questId/:stageId" element={<PrivateRoute element={<Stage />} />} />

        <Route path="/ai" element={<PrivateRoute element={<Ai />} />} />

        <Route path="/player" element={<PrivateRoute element={<PlayerMode />} />} />
        <Route path="/mypage" element={<PrivateRoute element={<Mypage />} />} />
        <Route path="/edit" element={<PrivateRoute element={<Edit />} />} />
        <Route path="/password-reset" element={<PrivateRoute element={<PasswordReset />} />} />
      </Routes>
    </Router>
  );
};

export default App;
