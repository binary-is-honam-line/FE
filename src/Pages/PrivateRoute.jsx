import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element }) => {
    const isLoggedIn = sessionStorage.getItem('user'); // 세션에서 로그인 상태 확인
    // console.log('PrivateRoute isLoggedIn:', isLoggedIn); // 로그인 여부 확인

    return isLoggedIn ? element : <Navigate to="/login" />;
};

export default PrivateRoute;