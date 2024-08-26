import axios from 'axios';

const api = axios.create({
  baseURL: '/api', // 상대 경로를 사용하여 Vercel의 리라이트 설정을 적용
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 세션 쿠키를 포함하기 위해 설정
});

export default api;
