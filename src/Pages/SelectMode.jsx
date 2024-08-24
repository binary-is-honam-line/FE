import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    position: relative;
    overflow: hidden;
`;

const BackgroundImageLeft = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: calc(50% - 187.5px); /* 50%에서 AppWrapper의 절반을 뺀 값 */
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
    width: calc(50% - 187.5px); /* 50%에서 AppWrapper의 절반을 뺀 값 */
    height: 100%;
    background-image: url('/right.png');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: right center;
`;

const AppWrapper = styled.div`
    width: 100%;
    max-width: 375px;
    height: 100vh;
    background-color: #A2CA71;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
`;

const Logo = styled.img`
    width: 150px;
    margin-top: 15%;
    margin-bottom: 30px;
`;

const ModeButton = styled.button`
    background-color: #387F39;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 20px;
    width: 70%;
    height: 15%;
    margin: 8% 0;
    &:hover {
        background-color: #306e2b;
    }
`;

const TreasureImage = styled.img`
    position: absolute;
    bottom: 10px;
    left: 20px;
    width: 200px;
`;

const MonkeyImage = styled.img`
    position: absolute;
    bottom: 5px;
    right: 10px;
    width: 150px;
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
            <BackgroundImageLeft />
            <BackgroundImageRight />
            <AppWrapper>
                <Logo src="/logo.png" alt="Logo" />
                <ModeButton onClick={handleCreatorModeClick}>크리에이터 모드</ModeButton>
                <ModeButton onClick={handlePlayerModeClick}>플레이어 모드</ModeButton>
                <TreasureImage src="/treasure.png" alt="Treasure" />
                <MonkeyImage src="/monkeys.png" alt="Monkey" />
            </AppWrapper>
        </Container>
    );
};

export default SelectMode;
