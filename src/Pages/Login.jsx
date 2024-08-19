import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #FEFEFE;
`;

const AppWrapper = styled.div`
    width: 375px;
    height: 100vh;
    background-color: #FEF69B;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
`;

const Logo = styled.div`
    font-size: 50px;
    font-weight: bold;
    margin-top: 50%;
    margin-bottom: 20%;
`;

const Input = styled.input`
    width: 80%;
    padding: 15px;
    margin-bottom: 5%;
    border: 1px solid #00D065;
    border-radius: 5px;
    font-size: 20px;
`;

const LoginButton = styled.button`
    background-color: #FFD8E1;
    color: black;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 35px;
    width: 90%;
    margin-bottom: 20px;
    &:hover {
        color: #FF86FF;
    }
`;

const LinkContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
`;

const Link = styled.a`
    margin: 0 10px;
    cursor: pointer;
    text-decoration: none;
    color: black;
    &:hover {
        text-decoration: underline;
    }
`;

const Footer = styled.div`
    position: absolute;
    bottom: 5%;
    left: 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
`;

const FooterText = styled.span`
    margin-left: 5px;
`;

const QuestionMark = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #00D065;
    color: #FEFEFE;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
`;

const SignupLink = styled.a`
    cursor: pointer;
    text-decoration: underline;
    color: #00D065;
    &:hover {
        text-decoration: underline;
    }
`;

const Login = () => {
    const navigate = useNavigate();
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleLoginClick = async () => {
        try {
            // api 호출 예시
            const response = await axios.post('https://api.example.com/login', {
                userId,
                password,
            });
            const data = response.data;
            // 로그인 성공 시 처리
            console.log('로그인 성공:', data);

            // 홈페이지로 이동
            navigate('/home');
        } catch (error) {
            // 에러 처리
            console.error('로그인 실패:', error);
        }
    };

    const handleFindIdClick = () => {
        navigate('/find-id');
    };

    const handleSendTempPasswordClick = () => {
        navigate('/send-temp-password');
    };

    const handleSignupClick = () => {
        navigate('/signup');
    };

    return (
        <Container>
            <AppWrapper>
                <Logo>Logo</Logo>
                <Input
                    type="text"
                    placeholder="아이디"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                />
                <Input
                    type="password"
                    placeholder="비밀번호"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <LoginButton onClick={handleLoginClick}>로그인하기</LoginButton>
                <LinkContainer>
                    <Link onClick={handleFindIdClick}>아이디찾기</Link>
                    <span>|</span>
                    <Link onClick={handleSendTempPasswordClick}>임시 비번 전송</Link>
                </LinkContainer>
                <Footer>
                    <QuestionMark>?</QuestionMark>
                    <span>아직 계정이 없으신가요?</span>
                    <FooterText></FooterText>
                    <SignupLink onClick={handleSignupClick}>회원가입</SignupLink>
                </Footer>
            </AppWrapper>
        </Container>
    );
};

export default Login;