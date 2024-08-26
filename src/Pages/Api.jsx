import axios from 'axios';

// 기본 baseURL 설정
const PROXY = '/proxy'; // 프록시 경로 사용
const baseURL = `${PROXY}/api`; // 프록시와 함께 API 경로 설정

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 세션 쿠키를 포함하기 위해 설정
});

export default api;
