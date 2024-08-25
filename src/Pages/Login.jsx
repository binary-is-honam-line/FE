import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const logoImage = `${process.env.PUBLIC_URL}/monkeys.png`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
`;

const BackgroundImageLeft = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: calc(50% - 187.5px);
    height: 100%;
    background-image: url('/left.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: left center;
`;

const BackgroundImageRight = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: calc(50% - 187.5px);
    height: 100%;
    background-image: url('/right.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: right center;
`;

const AppWrapper = styled.div`
    width: 100%;
    max-width: 375px;
    min-height: 100vh;
    background-color: #A2CA71;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    overflow-y: auto;
`;

const Logo = styled.img`
    width: 200px;
    margin-top: 50%;
    margin-bottom: 20%;
`;

const Input = styled.input`
    width: 80%;
    padding: 15px;
    margin-bottom: 5%;
    border: 1px solid #DEDEDE;
    border-radius: 5px;
    font-size: 20px;
`;

const LoginButton = styled.button`
    background-color: #387F39;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 35px;
    width: 90%;
    margin-bottom: 20px;

    &:hover {
        color: black;
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
    bottom: 3%;
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
    background-color: #387F39;
    color: #FEFEFE;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
`;

const SignupLink = styled.a`
    cursor: pointer;
    text-decoration: underline;
    color: white;

    &:hover {
        text-decoration: underline;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
`;

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // 페이지 로드 시 세션을 확인하여 이미 로그인된 상태라면 선택모드로 리다이렉트
        const user = sessionStorage.getItem('user');
        if (user) {
            navigate('/select');
        }
    }, [navigate]);

    const handleLoginClick = async () => {
        try {
            const params = new URLSearchParams();
            params.append('email', email);
            params.append('password', password);

            const response = await api.post('/login', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
            });

            sessionStorage.setItem('user', JSON.stringify(response.data.user));

            console.log('로그인 성공:', response.data.message);
            console.log('로그인 성공한 이메일:', response.data.user);
            navigate('/story');
        } catch (error) {
            console.error('로그인 실패:', error.response?.data || error.message);
            setErrorMessage(error.response?.data?.message || '로그인에 실패했습니다. 다시 시도해주세요.');
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
        <>
            <Container>
                <BackgroundImageLeft />
                <AppWrapper>
                    <Logo src={logoImage} alt="Logo" />
                    <Input
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <LoginButton onClick={handleLoginClick}>로그인하기</LoginButton>
                    {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
                    <LinkContainer>
                        <Link onClick={handleFindIdClick}>아이디찾기</Link>
                        <span>|</span>
                        <Link onClick={handleSendTempPasswordClick}>임시 비밀번호</Link>
                    </LinkContainer>
                    <Footer>
                        <QuestionMark>?</QuestionMark>
                        <span>아직 계정이 없으신가요?</span>
                        <FooterText></FooterText>
                        <SignupLink onClick={handleSignupClick}>회원가입</SignupLink>
                    </Footer>
                </AppWrapper>
                <BackgroundImageRight />
            </Container>
        </>
    );
};

export default Login;
