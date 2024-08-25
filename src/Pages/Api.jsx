import axios from 'axios';

// 환경에 따라 baseURL 설정
const baseURL = process.env.REACT_APP_API_BASE_URL;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 세션 쿠키를 포함하기 위해 설정
});

export default api;
