import React from 'react';
import styled from 'styled-components';
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
    font-size: 24px;
    font-weight: bold;
    position: absolute;
    top: 20px;
    left: 20px;
`;

const Title = styled.div`
    margin: 20px 0;
    font-size: 18px;
    text-align: center;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StartButton = styled.button`
    background-color: #FFD8E1;
    color: black;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 35px;
    width: 60%;
    margin-bottom: 20%;
`;

const Start = () => {
    const navigate = useNavigate();

    const handleStartClick = () => {
        navigate('/login');
    };

    const handleLogoClick = () => {
        navigate('/select');
    };

    return (
        <Container>
            <AppWrapper>
                <Logo onClick={handleLogoClick}>Logo</Logo>
                <Title>오랑께</Title>
                <StartButton onClick={handleStartClick}>시작하기</StartButton>
            </AppWrapper>
        </Container>
    );
};

export default Start;