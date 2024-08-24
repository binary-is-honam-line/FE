import React from 'react';
import styled, { keyframes } from 'styled-components';

const PlayModal = ({ quest, onClose, onPlay }) => {
    return (
        <Overlay>
            <ModalContainer>
                <Header>
                    <Title>퀘스트 정보</Title>
                </Header>
                <QuestImageWrapper>
                    <QuestImage src={`${process.env.PUBLIC_URL}${quest.imageUrl}`} alt="Quest Image" />
                </QuestImageWrapper>
                <QuestInfo>
                    <QuestName>{quest.questName}</QuestName>
                    <InfoItem>
                        <InfoIcon src={`${process.env.PUBLIC_URL}/location.png`} alt="Location Icon" />
                        {quest.location}
                    </InfoItem>
                    <InfoItem>
                        <InfoIcon src={`${process.env.PUBLIC_URL}/user.png`} alt="User Icon" />
                        {quest.nickname}
                    </InfoItem>
                    <Separator />
                    <Label>스토리</Label>
                    <MainStory>{quest.mainStory}</MainStory>
                    <Separator />
                    <Label>장소</Label>
                    <Stages>
                        {quest.stages && quest.stages.length > 0 ? (
                            quest.stages.map((stage, index) => (
                                <Stage key={index}>{stage}</Stage>
                            ))
                        ) : (
                            <p>장소 정보가 없습니다.</p>
                        )}
                    </Stages>
                </QuestInfo>
                <AnimationWrapper>
                    <TreasureImage src={`${process.env.PUBLIC_URL}/treasure.png`} alt="Treasure" />
                    <MonkeyImage src={`${process.env.PUBLIC_URL}/monkeys.png`} alt="Monkeys" />
                </AnimationWrapper>
                <ButtonContainer>
                    <CancelButton onClick={onClose}>취소</CancelButton>
                    <PlayButton onClick={onPlay}>플레이</PlayButton>
                </ButtonContainer>
            </ModalContainer>
        </Overlay>
    );
};

const moveMonkeysRight = keyframes`
    0% {
        transform: translateX(0);
    }
    100% {
        transform: translateX(230px);
    }
`;

const Overlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContainer = styled.div`
    background: #fff;
    padding: 20px;
    border-radius: 15px;
    width: calc(100% - 40px);
    max-width: 335px;
    box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
    text-align: left;
    position: relative;
    z-index: 1001;
`;

const Header = styled.div`
    text-align: center;
    margin-bottom: 15px;
`;

const Title = styled.h3`
    font-size: 16px;
    font-weight: bold;
`;

const QuestImageWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 15px;
`;

const QuestImage = styled.img`
    width: 50%;
    border-radius: 10px;
`;

const QuestInfo = styled.div`
    margin-bottom: 20px;
`;

const QuestName = styled.h2`
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: bold;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font-size: 14px;
    color: #666;
`;

const InfoIcon = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 5px;
`;

const Separator = styled.div`
    border-top: 2px solid #A2CA71;
    margin: 15px 0;
`;

const Label = styled.p`
    font-weight: bold;
    margin-top: 10px;
    margin-bottom: 5px;
`;

const MainStory = styled.div`
    margin-bottom: 10px;
    white-space: pre-wrap;
`;

const Stages = styled.div`
    margin-bottom: 10px;
`;

const Stage = styled.div`
    margin-bottom: 5px;
`;

const AnimationWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 100px;
    margin-bottom: 20px;
    overflow: hidden;
`;

const TreasureImage = styled.img`
    position: absolute;
    right: 0;
    bottom: 0;
    height: 100%;
`;

const MonkeyImage = styled.img`
    position: absolute;
    left: 0;
    bottom: 0;
    height: 80px;
    animation: ${moveMonkeysRight} 2s ease-in-out infinite alternate;
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const CancelButton = styled.button`
    background-color: #A2CA71;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 45%;

    &:hover {
        background-color: #6EA954;
    }
`;

const PlayButton = styled.button`
    background-color: #A2CA71;
    padding: 10px 20px;
    color: black;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    width: 45%;

    &:hover {
        background-color: #6EA954;
    }
`;

export default PlayModal;