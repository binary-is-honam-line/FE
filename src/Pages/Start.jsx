import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: relative;
    overflow: hidden; /* 넘치는 부분을 숨김 */
`;

const BackgroundImageLeft = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: calc((100% - 375px) / 2); /* 남은 공간의 절반을 사용 */
    height: 100%;
    background-image: url('/left.png');
    background-repeat: no-repeat;
    background-size: cover;
`;

const BackgroundImageRight = styled.div`
    position: absolute;
    top: 0;
    right: 0;
    width: calc((100% - 375px) / 2); /* 남은 공간의 절반을 사용 */
    height: 100%;
    background-image: url('/right.png');
    background-repeat: no-repeat;
    background-size: cover;
`;

const AppWrapper = styled.div`
    width: 375px; /* width 값을 고정 */
    height: 100vh;
    background-color: #A2CA71;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
`;

const Logo = styled.img`
    width: 60%;
    margin-bottom: 20%;
`;

const StartButton = styled.button`
    background-color: #387F39;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 35px;
    width: 60%;
`;

const Start = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/login');
    };

    return (
        <Container>
            <BackgroundImageLeft />
            <AppWrapper>
                <Logo src="/logo.png" alt="Logo" />
                <StartButton onClick={handleStartClick}>시작하기</StartButton>
            </AppWrapper>
            <BackgroundImageRight />
        </Container>
    );
};

export default Start;
