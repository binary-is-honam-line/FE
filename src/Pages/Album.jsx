import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Album = () => {
    const navigate = useNavigate();
    const latestQuestId = sessionStorage.getItem('latestQuestId');

    // 하드코딩된 퀘스트 데이터
    const quests = [
        {
            image: 'https://via.placeholder.com/400',  // 대표 사진
            questName: '광주 문화 여행',
            location: '광주',
            nickname: '집에가고싶은농곰',
            mainStory: '메인 스토리\n~~~~~~~~~~~~~~~~~~~~~~~~~~~\n~~~~~~~~~~~~~~~~~~~~~~~~~~~',
            stages: ['국립아시아문화전당', '광주 사직공원', '양림동역사마을'],
            clearDate: '2024.08.18',
        },
        {
            image: 'https://via.placeholder.com/400',  // 다른 퀘스트의 대표 사진
            questName: '목포 먹방 투어',
            location: '목포',
            nickname: '배고파',
            mainStory: '목포의 맛집을 다녀보세요!',
            stages: ['목포회센타', '코로방제과점', '대반동201'],
            clearDate: '2024.08.20',
        },
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

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

    const currentQuest = quests[currentIndex];

  return (
    <Container>
      <BackgroundImageLeft />
      <BackgroundImageRight />
      <AppWrapper>
        <Header>
            <BackButton onClick={() => navigate(-1)}>←</BackButton>
            <Title>퀘스트 앨범</Title>
        </Header>
        <Content>
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
                            {currentQuest.nickname}
                    </InfoItem>
                    </QuestInfo>
                    <Label>스토리</Label>
                    <Story>{currentQuest.mainStory}</Story>
                    <Label>스테이지</Label>
                    <Stages>
                        {currentQuest.stages.map((stage, index) => (
                            <Stage key={index}>{stage}</Stage>
                        ))}
                    </Stages>
                    <ClearDate>{currentQuest.clearDate} 클리어</ClearDate>
            </QuestBox>
            <SideButton onClick={handleNext}>{'>'}</SideButton>
        </Content>

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


const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    align-self: flex-start;
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
    white-space: pre-wrap; /* 줄바꿈을 유지하기 위해 추가 */
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

export default Album;
