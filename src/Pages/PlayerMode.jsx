import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import LocationSelector from './LocationSelector';
import PlayModal from './PlayModal';

const PlayerMode = () => {
  const [keyword, setKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState('');
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [quests, setQuests] = useState([
    {
      questId: 1,
      questName: "광주 맛집 여행",
      location: "광주",
      nickname: "배고픈담곰이",
      headCount: "4",
      time: "02:00:00",
      imageUrl: "/monkey.png",
    },
    {
      questId: 2,
      questName: "목포 맛집 여정",
      location: "목포",
      nickname: "집에가고싶은농곰",
      headCount: "3",
      time: "01:30:00",
      imageUrl: "/monkeys.png",
    },
  ]);

  const [selectedQuest, setSelectedQuest] = useState(null); // 선택된 퀘스트 상태

  const navigate = useNavigate();

  const searchQuests = () => {
    setIsSearchClicked(true);
  };

  const filteredQuests = quests.filter(quest => {
    if (selectedLocation && keyword) {
      return quest.location === selectedLocation && quest.questName.includes(keyword);
    } else if (selectedLocation) {
      return quest.location === selectedLocation;
    } else if (keyword) {
      return quest.questName.includes(keyword);
    } else {
      return true;
    }
  });

  const handlePlayClick = (quest) => {
    setSelectedQuest(quest); // 선택된 퀘스트 설정
  };

  const handleCloseModal = () => {
    setSelectedQuest(null); // 모달 닫기
  };

  const handlePlayQuest = () => {
    navigate(`/play/${selectedQuest.questId}`); // 퀘스트 플레이 화면으로 이동
  };

  return (
    <Container>
      <BackgroundImageLeft />
      <BackgroundImageRight />
      <AppWrapper>
        <SearchBarWrapper>
          <LocationContainer>
            <LocationSelector 
              selectedLocation={selectedLocation}
              setSelectedLocation={setSelectedLocation}
              noBorder={true}
            />
          </LocationContainer>
          <SearchInput
            type="text"
            placeholder="퀘스트 키워드 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <SearchButton onClick={searchQuests} isClicked={isSearchClicked}>
            <SearchIcon src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" />
          </SearchButton>
        </SearchBarWrapper>

        <StoryList>
          {filteredQuests.map((quest) => (
            <StoryBox key={quest.questId}>
              <StoryContent>
                <StoryInfo>
                  <StoryTitle>{quest.questName}</StoryTitle>
                  <StoryLocation>
                    <StoryImageIcon src="/location.png" alt="Location" />
                    {quest.location}
                  </StoryLocation>
                  <StoryAuthor>
                    <StoryImageIcon src="/user.png" alt="User" />
                    {quest.nickname}
                  </StoryAuthor>
                  <StoryCount>
                    <StoryImageIcon src="/count.png" alt="Head Count" />
                    적정 인원: {quest.headCount}명
                  </StoryCount>
                  <StoryTime>
                    <StoryImageIcon src="/time.png" alt="Time" />
                    예상 시간: {quest.time}
                  </StoryTime>
                </StoryInfo>
                <StoryImage src={quest.imageUrl} alt="Quest" />
              </StoryContent>
              <PlayButton onClick={() => handlePlayClick(quest)}>플레이 하기</PlayButton>
            </StoryBox>
          ))}
        </StoryList>

        <BottomBar>
          <BottomButton onClick={() => navigate('/player')}>
            <ButtonImage
              src={`${process.env.PUBLIC_URL}/search.png`}
            />
            <ButtonLabel>퀘스트 검색</ButtonLabel>
          </BottomButton>
          <BottomButton onClick={() => navigate('/play')}>
            <ButtonImage
              src={`${process.env.PUBLIC_URL}/play.png`}
            />
            <ButtonLabel>플레이</ButtonLabel>
          </BottomButton>
          <BottomButton onClick={() => navigate('/mypage')}>
            <ButtonImage
              src={`${process.env.PUBLIC_URL}/mypage.png`}
            />
            <ButtonLabel>마이페이지</ButtonLabel>
          </BottomButton>
          <BottomButton onClick={() => navigate('/select')}>
            <ButtonImage src={`${process.env.PUBLIC_URL}/mode.png`} />
            <ButtonLabel>모드선택</ButtonLabel>
          </BottomButton>
        </BottomBar>
      </AppWrapper>

      {selectedQuest && (
        <PlayModal
          quest={selectedQuest}
          onClose={handleCloseModal}
          onPlay={handlePlayQuest}
        />
      )}
    </Container>
  );
};

// 스타일링

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
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  height: 50px;
  margin-top: 20px;
  border-radius: 15px;
  overflow: hidden;
  border: 2px solid #A2CA71;
  background-color: #ffffff;
`;

const LocationContainer = styled.div`
  flex: 1.5;
  padding: 10px;
  background-color: #f0f0f0;
  border-right: 1px solid #A2CA71;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const SearchInput = styled.input`
  flex: 2.5;
  padding: 10px;
  border: none;
  outline: none;
  font-size: 16px;
`;

const SearchButton = styled.button`
  padding: 0 20px;
  height: 100%;
  background-color: #A2CA71;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #81B265;
  }
`;

const SearchIcon = styled.img`
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
  background-color: transparent;
`;

const StoryList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  width: 90%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StoryBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 2px solid #DEDEDE;
  border-radius: 10px;
  background-color: white;
  padding: 15px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

const StoryContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StoryInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const StoryImageIcon = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 2px;
`;

const StoryTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 1px;
`;

const StoryLocation = styled.p`
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  margin-bottom: 1px;
`;

const StoryAuthor = styled.p`
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  margin-bottom: 1px;
`;

const StoryCount = styled.p`
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
  margin-bottom: 1px;
`;

const StoryTime = styled.p`
  font-size: 14px;
  color: #666;
  display: flex;
  align-items: center;
`;

const StoryImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 10px;
  margin-left: 20px;
`;

const PlayButton = styled.button`
  padding: 10px 20px;
  background-color: #A2CA71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 10px;

  &:hover {
    background-color: #81B265;
  }
`;

const BottomBar = styled.div`
  width: 100%;
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
  color: #333333;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

  &:hover {
    color: #387F39;
  }
`;

const ButtonImage = styled.img`
  width: 24px;
  height: 24px;
  margin-bottom: 5px;
`;

const ButtonLabel = styled.div`
  font-size: 12px;
  text-align: center;
`;

export default PlayerMode;
