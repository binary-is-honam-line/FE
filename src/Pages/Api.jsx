import axios from 'axios';

const api = axios.create({
  baseURL: '/', // 상대 경로로 설정
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 세션 쿠키를 포함하기 위해 설정
});

export default api;

// import axios from 'axios';

// // 환경에 따라 baseURL 설정
// const baseURL = 'http://localhost:8080';

// const api = axios.create({
//   baseURL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
//   withCredentials: true, // 세션 쿠키를 포함하기 위해 설정
// });

// export default api;