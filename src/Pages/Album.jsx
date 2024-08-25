import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const Album = () => {
    const navigate = useNavigate();
    const latestQuestId = sessionStorage.getItem('latestQuestId');
    const [quests, setQuests] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    // 데이터 불러오기
    useEffect(() => {
        const fetchQuests = async () => {
            try {
                // 클리어한 퀘스트 목록 가져오기
                const response = await api.get('/api/clear/quest-album');
                const clearedQuests = response.data;
                // 퀘스트 상세 정보와 이미지를 함께 불러오기
                const questsData = await Promise.all(clearedQuests.map(async (quest) => {
                    const imageResponse = await api.get(`/api/play/${quest.questId}/image`, { responseType: 'blob' });
                    const imageUrl = URL.createObjectURL(imageResponse.data);
                    return {
                        ...quest,
                        image: imageUrl,
                    };
                }));

                setQuests(questsData);
            } catch (error) {
                console.error("퀘스트 데이터를 불러오는 중 오류가 발생했습니다:", error);
            }
        };

        fetchQuests();
    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : quests.length - 1));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < quests.length - 1 ? prevIndex + 1 : 0));
    };

    const handlePlayClick = () => {
        if (latestQuestId) {
            navigate(`/play/${latestQuestId}`);
        } else {
            alert("진행 중인 퀘스트가 없습니다.");
        }
    };

    const currentQuest = quests.length > 0 ? quests[currentIndex] : null;

    return (
        <Container>
            <BackgroundImageLeft />
            <BackgroundImageRight />
            <AppWrapper>
                <ScrollContent>
                    <Header>
                        <Title>퀘스트 앨범</Title>
                    </Header>
                    <Content>
                        {currentQuest ? (
                            <>
                                <SideButton onClick={handlePrev}>{'<'}</SideButton>
                                <QuestBox>
                                    <QuestImageWrapper>
                                        <QuestImage src={currentQuest.image} alt="대표 사진" />
                                    </QuestImageWrapper>
                                    <QuestName>{currentQuest.questName}</QuestName>
                                    <QuestInfo>
                                        <InfoItem>
                                            <InfoIcon src="/location.png" alt="위치 아이콘" />
                                            {currentQuest.location}
                                        </InfoItem>
                                        <InfoItem>
                                            <InfoIcon src="/user.png" alt="사용자 아이콘" />
                                            {currentQuest.userNickname}
                                        </InfoItem>
                                    </QuestInfo>
                                    <Label>스토리</Label>
                                    <Story>{currentQuest.mainStory}</Story>
                                    <Label>스테이지</Label>
                                    <Stages>
                                        {currentQuest.stageNames.map((stage, index) => (
                                            <Stage key={index}>{stage}</Stage>
                                        ))}
                                    </Stages>
                                    <ClearDate>{currentQuest.date} 클리어</ClearDate>
                                </QuestBox>
                                <SideButton onClick={handleNext}>{'>'}</SideButton>
                            </>
                        ) : (
                            <LoadingMessage>퀘스트 앨범을 불러오는 중...</LoadingMessage>
                        )}
                    </Content>
                </ScrollContent>

                <BottomBar>
                    <BottomButton onClick={() => navigate('/player')}>
                        <ButtonImageBottom
                            src={`${process.env.PUBLIC_URL}/search.png`}
                        />
                        <ButtonLabelBottom>퀘스트 검색</ButtonLabelBottom>
                    </BottomButton>
                    <BottomButton onClick={handlePlayClick}>
                        <ButtonImageBottom
                            src={`${process.env.PUBLIC_URL}/play.png`}
                        />
                        <ButtonLabelBottom>플레이</ButtonLabelBottom>
                    </BottomButton>
                    <BottomButton onClick={() => navigate('/mypage')}>
                        <ButtonImageBottom
                            src={`${process.env.PUBLIC_URL}/mypage.png`}
                        />
                        <ButtonLabelBottom>마이페이지</ButtonLabelBottom>
                    </BottomButton>
                    <BottomButton onClick={() => navigate('/select')}>
                        <ButtonImageBottom src={`${process.env.PUBLIC_URL}/mode.png`} />
                        <ButtonLabelBottom>모드선택</ButtonLabelBottom>
                    </BottomButton>
                </BottomBar>
            </AppWrapper>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #F6E96B;
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
    height: 100vh;
    background-color: #FEFEFE;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
`;

const ScrollContent = styled.div`
    flex-grow: 1;
    width: 100%;
    overflow-y: auto;
    padding: 10px 20px;
    box-sizing: border-box;
    margin-top: 20px;
    margin-bottom: 80px;
    display: flex;
    flex-direction: column;
    align-items: center; /* 수평 중앙 정렬 */
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
`;

const Title = styled.h1`
    font-size: 20px;
    margin: 10px 0 0 0;
`;

const Content = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex-grow: 1;
    width: 100%;
`;

const SideButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: black;

    &:hover {
        color: #555;
    }
`;

const QuestBox = styled.div`
    width: 90%;
    max-width: 375px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
    padding: 15px;
    box-sizing: border-box;
    border: 2px solid #A2CA71;
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

const QuestName = styled.h2`
    font-size: 18px;
    margin-bottom: 10px;
`;

const QuestInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 15px;
`;

const InfoItem = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 5px;
`;

const InfoIcon = styled.img`
    width: 16px;
    height: 16px;
    margin-right: 5px;
`;

const Label = styled.div`
    font-weight: bold;
    margin-bottom: 5px;
    margin-top: 10px;
`;

const Story = styled.div`
    margin-bottom: 10px;
    white-space: pre-wrap;
`;

const Stages = styled.div`
    margin-bottom: 10px;
`;

const Stage = styled.div`
    margin-bottom: 5px;
`;

const ClearDate = styled.div`
    text-align: center;
    color: black;
    font-size: 12px;
    background-color: #A2CA71;
    padding: 10px;
    border-radius: 5px;
`;

const BottomBar = styled.div`
    width: 100%;  
    max-width: 375px;
    height: 80px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #A2CA71;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
`;

const BottomButton = styled.button`
    background-color: transparent;
    border: none;
    font-size: 14px;
    color: black;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;

    &:hover {
        color: #387F39;
    }
`;

const ButtonImageBottom = styled.img`
    width: 24px;
    height: 24px;
    margin-bottom: 5px;
`;

const ButtonLabelBottom = styled.div`
    font-size: 12px;
    text-align: center;
`;

const LoadingMessage = styled.p`
    text-align: center;
    font-size: 16px;
    color: #555;
`;

export default Album;
