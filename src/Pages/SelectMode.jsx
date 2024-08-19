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
    justify-content: center;
    position: relative;
`;

const Title = styled.div`
    margin: 20px 0;
    font-size: 24px;
    text-align: center;
    font-weight: bold;
`;

const ModeButton = styled.button`
    background-color: #FFD8E1;
    color: black;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 20px;
    width: 70%;
    margin: 10px 0;
    &:hover {
        background-color: #FFB6C1;
    }
`;

const SelectMode = () => {
    const navigate = useNavigate();

    const handleCreatorModeClick = () => {
        navigate('/creator');
    };

    const handlePlayerModeClick = () => {
        navigate('/player');
    };

    return (
        <Container>
            <AppWrapper>
                <Title>모드를 선택하세요</Title>
                <ModeButton onClick={handleCreatorModeClick}>크리에이터 모드</ModeButton>
                <ModeButton onClick={handlePlayerModeClick}>플레이어 모드</ModeButton>
            </AppWrapper>
        </Container>
    );
};

export default SelectMode;
