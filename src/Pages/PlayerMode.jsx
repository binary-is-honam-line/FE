import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';
import LocationSelector from './LocationSelector';
import PlayModal from './PlayModal';
import api from './Api';

const PAGE_SIZE = 5; // 페이지당 퀘스트 수

const PlayerMode = () => {
  const [keyword, setKeyword] = useState("");
  const [selectedLocation, setSelectedLocation] = useState('');
  const [quests, setQuests] = useState([]);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [questDetail, setQuestDetail] = useState(null); // 모달에 표시할 퀘스트 상세 정보
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const navigate = useNavigate();

  // 초기 랜덤 퀘스트 5개 가져오기
  useEffect(() => {
    const fetchInitialQuests = async () => {
      try {
        const response = await api.get('/api/search/suggest');
        const questsWithImages = await Promise.all(
          response.data.map(async (quest) => {
            const imageUrl = await fetchQuestImage(quest.questId);
            return { ...quest, imageUrl };
          })
        );
        setQuests(questsWithImages);
      } catch (error) {
        console.error('Error fetching initial quests:', error);
      }
    };

    fetchInitialQuests();
  }, []);

  // 퀘스트 이미지 가져오기
  const fetchQuestImage = async (questId) => {
    try {
      const response = await api.get(`/api/quests/${questId}/image`, {
        responseType: 'blob',
      });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error(`Error fetching image for quest ${questId}:`, error);
      return '/defaultImage.png'; // 기본 이미지 경로
    }
  };

  // 검색 퀘스트 가져오기 (전체 목록)
  const searchQuests = async () => {
    try {
      const response = await api.get('/api/search/', {
        params: {
          keyword: keyword || '',  // 키워드가 없을 경우 빈 문자열로 처리
          location: selectedLocation || '',  // 지역이 선택되지 않으면 빈 문자열로 처리
        },
      });
      const questsWithImages = await Promise.all(
        response.data.map(async (quest) => {
          const imageUrl = await fetchQuestImage(quest.questId);
          return { ...quest, imageUrl };
        })
      );
      setQuests(questsWithImages);
      setCurrentPage(1); // 검색 시 첫 페이지로 이동
    } catch (error) {
      console.error('Error searching quests:', error);
    }
  };

  // 퀘스트 상세 정보 가져오기 (이미지 제외)
  const fetchQuestDetail = async (questId) => {
    try {
      const response = await api.get(`/api/play/${questId}/detail`);
      setQuestDetail(response.data);
    } catch (error) {
      console.error('Error fetching quest detail:', error);
    }
  };

  const handlePlayClick = async (quest) => {
    try {
      // 클리어한 퀘스트 목록 조회
      const response = await api.get('/api/clear/quest-album');
      const clearedQuests = response.data;

      // 플레이하려는 퀘스트가 클리어한 목록에 있는지 확인
      const isCleared = clearedQuests.some(clearedQuest => clearedQuest.questId === quest.questId);

      if (isCleared) {
        setAlertMessage(
          <>
            이미 클리어된 퀘스트입니다.
            <br />
            다른 퀘스트를 플레이해주세요.
          </>
        );
                setIsAlertOpen(true);
      } else {
        // 클리어되지 않은 경우에만 퀘스트 상세 정보 가져오기
        fetchQuestDetail(quest.questId); 
        setSelectedQuest(quest);
      }
    } catch (error) {
      console.error("퀘스트 클리어 상태를 확인하는 중 오류가 발생했습니다.", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedQuest(null);
    setQuestDetail(null); // 모달 닫을 때 데이터 초기화
  };

  const handlePlayQuest = () => {
    // 플레이 시 현재 퀘스트 ID를 sessionStorage에 저장
    sessionStorage.setItem('latestQuestId', selectedQuest.questId);
    navigate(`/play/${selectedQuest.questId}`);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePlayButtonClick = () => {
    const latestQuestId = sessionStorage.getItem('latestQuestId');
    if (latestQuestId) {
      navigate(`/play/${latestQuestId}`);
    } else {
      alert("진행 중인 퀘스트가 없습니다.");
    }
  };

  // 페이지당 퀘스트 리스트
  const paginatedQuests = quests.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(quests.length / PAGE_SIZE);

  return (
    <Container>
      <BackgroundImageLeft />
      <BackgroundImageRight />
      <AppWrapper>
        <FixedHeader>
          <SearchBarWrapper>
            <LocationContainer>
              <LocationSelector 
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                noBorder={true} // 여기서는 $를 빼고 전달
              />
            </LocationContainer>
            <SearchInput
              type="text"
              placeholder="퀘스트 키워드 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <SearchButton onClick={searchQuests}>
              <SearchIcon src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" />
            </SearchButton>
          </SearchBarWrapper>
        </FixedHeader>

        <ScrollableContent>
          <StoryList>
            {paginatedQuests.map((quest) => (
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
                      {quest.userNickname}
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
                  <StoryImage src={quest.imageUrl || '/defaultImage.png'} alt="Quest" />
                </StoryContent>
                <PlayButton onClick={() => handlePlayClick(quest)}>플레이 하기</PlayButton>
              </StoryBox>
            ))}
          </StoryList>
        </ScrollableContent>

        <PaginationWrapper>
          {totalPages > 1 && (
            <Pagination>
              {Array.from({ length: totalPages }, (_, index) => (
                <PageButton
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  $active={index + 1 === currentPage}
                >
                  {index + 1}
                </PageButton>
              ))}
            </Pagination>
          )}
        </PaginationWrapper>

        <BottomBar>
          <BottomButton onClick={() => navigate('/player')}>
            <ButtonImage
              src={`${process.env.PUBLIC_URL}/search.png`}
            />
            <ButtonLabel>퀘스트 검색</ButtonLabel>
          </BottomButton>
          <BottomButton onClick={handlePlayButtonClick}>
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

      {isAlertOpen && (
        <CustomModal>
          <ModalContent>
            <ModalText>{alertMessage}</ModalText>
            <ModalButton onClick={() => setIsAlertOpen(false)}>확인</ModalButton>
          </ModalContent>
        </CustomModal>
      )}

      {questDetail && (
        <PlayModal
          quest={questDetail} // questDetail을 PlayModal에 전달
          onClose={handleCloseModal}
          onPlay={handlePlayQuest}
        />
      )}
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
  height: 100%;
  background-color: #FEFEFE;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const FixedHeader = styled.div`
  width: 100%;
  background-color: #FEFEFE;
  z-index: 2;
  position: relative;
`;

const SearchBarWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  height: 50px;
  margin: 20px auto;
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
  padding: 0 10px;
  height: 100%;
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

const ScrollableContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
  display: flex;
  justify-content: center;
  max-height: calc(100vh - 35%);
`;

const StoryList = styled.div`
  width: 80%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const PaginationWrapper = styled.div`
  position: fixed;
  bottom: 80px;
  width: 100%;
  max-width: 375px;
  display: flex;
  justify-content: center;
  background-color: #FEFEFE;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  padding: 10px 0;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  margin: 0 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: ${({ $active }) => ($active ? '#A2CA71' : '#fff')}; 
  color: ${({ $active }) => ($active ? '#fff' : '#333')};
  cursor: pointer;

  &:hover {
    background-color: #A2CA71;
    color: #fff;
  }
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
  width: 50%;
  height: 50%;
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
  max-width: 375px;
  height: 80px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #A2CA71;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  position: fixed;
  bottom: 0;
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

const CustomModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 300px;
  text-align: center;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalText = styled.p`
  margin-bottom: 20px;
  font-size: 16px;
  color: #333;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background-color: #A2CA71;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #81B265;
  }
`;

export default PlayerMode;
