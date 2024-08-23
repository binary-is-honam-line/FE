import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from './Api';
import LocationSelector from './LocationSelector';

const PAGE_SIZE = 5; // 페이지당 퀘스트 수

const CreatorMode = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태
  const [selectedStory, setSelectedStory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [questName, setQuestName] = useState('');
  const [location, setLocation] = useState(''); // LocationSelector와 연결될 상태
  const [mainStory, setMainStory] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [headCount, setHeadCount] = useState(''); // 적정 인원 수 상태
  const [time, setTime] = useState(''); // 예상 시간 상태

  useEffect(() => {
    api.get('/api/quests/')
      .then(response => {
        const quests = response.data;
        const fetchDetails = quests.map(quest =>
          api.get(`/api/quests/${quest.questId}/update`)
            .then(detailResponse => {
              quest.headCount = detailResponse.data.headCount;
              quest.time = detailResponse.data.time;
              return api.get(`/api/quests/${quest.questId}/image`, { responseType: 'blob' });
            })
            .then(imageResponse => {
              quest.image = URL.createObjectURL(imageResponse.data);
              return quest;
            })
        );
        Promise.all(fetchDetails).then(updatedQuests => {
          setStories(updatedQuests);
        });
      })
      .catch(error => {
        console.error("퀘스트 목록을 불러오는데 실패했습니다.", error);
      });
  }, []);
  
  const handleAddStory = () => {
    api.post('/api/quests/create')
      .then(response => {
        const questId = response.data.questId; // 생성된 퀘스트의 questId
        sessionStorage.setItem('latestQuestId', questId); // 최신 questId를 세션 스토리지에 저장
        navigate(`/search/${questId}`); // 새 퀘스트의 상세 페이지로 이동
      })
      .catch(error => {
        console.error("퀘스트를 생성하는데 실패했습니다.", error);
      });
  };  

  const handleEditStory = (questId) => {
    api.get(`/api/quests/${questId}/update`)
      .then(response => {
        console.log("API Response:", response.data); // 응답 데이터를 출력
        const { questName, location, mainStory, headCount, time } = response.data;
        setQuestName(questName);
        setLocation(location);
        setMainStory(mainStory);
        setHeadCount(headCount);  // 적정 인원 수 설정
        setTime(time);  // 예상 시간 설정
        return api.get(`/api/quests/${questId}/image`, { responseType: 'blob' });
      })
      .then(imageResponse => {
        setImagePreview(URL.createObjectURL(imageResponse.data));
        setSelectedStory(questId);
        setShowModal(true);
      })
      .catch(error => {
        console.error("퀘스트 정보를 불러오는데 실패했습니다.", error);
      });
  };
  

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSaveChanges = () => {
    api.post(`/api/quests/${selectedStory}/save`, null, {
      params: {
        questName,
        location,
        mainStory,
        headCount,  // 적정 인원 수 저장
        time  // 예상 시간 저장
      }
    })
      .then(() => {
        if (selectedImage) {
          const formData = new FormData();
          formData.append('file', selectedImage);
          return api.post(`/api/quests/${selectedStory}/image`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        }
      })
      .then(() => {
        setShowModal(false);
        window.location.reload();
      })
      .catch(error => {
        console.error("퀘스트를 수정하는데 실패했습니다.", error);
      });
  };

  const handleDeleteStory = (questId) => {
    api.delete(`/api/quests/${questId}`)
      .then(() => {
        setStories(prevStories => prevStories.filter(story => story.questId !== questId));
      })
      .catch(error => {
        console.error("퀘스트를 삭제하는데 실패했습니다.", error);
      });
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // 페이지당 퀘스트 리스트
  const paginatedStories = stories.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const totalPages = Math.ceil(stories.length / PAGE_SIZE);

  return (
    <Container>
      <BackgroundImageLeft />
      <BackgroundImageRight />
      <AppWrapper>
        <Header>
          <BackButton onClick={() => navigate('/select')}>뒤로 가기</BackButton>
        </Header>
        <Title>내가 만든 퀘스트</Title>
        <AddStoryButton onClick={handleAddStory}>퀘스트 추가하기</AddStoryButton>
        <StoryList>
          {paginatedStories.length > 0 ? (
            paginatedStories.map((story, index) => (
              <StoryBox key={index}>
                <StoryContent>
                  <StoryInfo>
                    <StoryTitle>{story.questName}</StoryTitle>
                    <StoryLocation>
                      <StoryImageIcon src="/location.png" alt="위치 이미지" />
                      {story.location}
                    </StoryLocation>
                    <StoryAuthor>
                      <StoryImageIcon src="/user.png" alt="사용자 이미지" />
                      {story.userNickname}
                    </StoryAuthor>
                    <StoryCount>
                      <StoryImageIcon src="/count.png" alt="적정인원수 이미지" />
                      {story.headCount}
                    </StoryCount>
                    <StoryTime>
                      <StoryImageIcon src="/time.png" alt="예상시간 이미지" />
                      {story.time}
                    </StoryTime>
                  </StoryInfo>
                  <StoryImage src={story.image || "https://via.placeholder.com/100"} alt="대표사진" />
                </StoryContent>
                <StoryButtons>
                  <StoryButton onClick={() => handleEditStory(story.questId)}>수정하기</StoryButton>
                  <StoryButton onClick={() => handleDeleteStory(story.questId)}>삭제하기</StoryButton>
                </StoryButtons>
              </StoryBox>
            ))
          ) : (
            <NoStoryMessage>아직 생성된 퀘스트가 없습니다.</NoStoryMessage>
          )}
        </StoryList>

        {/* 페이지네이션 컨트롤 */}
        {totalPages > 1 && (
          <Pagination>
            {Array.from({ length: totalPages }, (_, index) => (
              <PageButton
                key={index}
                onClick={() => handlePageChange(index + 1)}
                active={index + 1 === currentPage}
              >
                {index + 1}
              </PageButton>
            ))}
          </Pagination>
        )}
      </AppWrapper>

      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>퀘스트 수정하기</ModalTitle>
            <ModalLabel>이름</ModalLabel>
            <ModalInput
              type="text"
              value={questName}
              onChange={(e) => setQuestName(e.target.value)}
            />
            <ModalLabel>위치</ModalLabel>
            {/* LocationSelector 컴포넌트를 위치 선택 부분으로 사용합니다 */}
            <LocationSelector selectedLocation={location} setSelectedLocation={setLocation} />
            <ModalLabel>메인스토리</ModalLabel>
            <ModalTextarea
              value={mainStory}
              onChange={(e) => setMainStory(e.target.value)}
            />
            <ModalLabel>추천 인원 수</ModalLabel>
            <ModalInput
              type="number"
              placeholder="5"
              value={headCount}
              onChange={(e) => setHeadCount(e.target.value)}
            />
            <ModalLabel>예상 시간</ModalLabel>
            <ModalInput
              type="text"
              placeholder="예: 03:00:00 (시간:분:초)"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
            <ModalLabel>대표 사진</ModalLabel>
            <ModalImagePreview src={imagePreview} alt="대표 사진" />
            <ModalInput
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <ModalButtons>
              <ModalButton onClick={() => setShowModal(false)}>취소</ModalButton>
              <ModalButton onClick={handleSaveChanges}>수정</ModalButton>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

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
  background-color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 16px;
  margin-top: 5%;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  text-align: center;
  margin: 10px 0;
`;

const AddStoryButton = styled.button`
  display: block;
  padding: 10px 20px;
  background-color: #BEDC74;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 90%;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 20px;

  &:hover {
    background-color: #A2CA71;
  }
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

const StoryButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const StoryButton = styled.button`
  padding: 10px 20px;
  background-color: #BEDC74;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 48%;

  &:hover {
    background-color: #A2CA71;
  }
`;

const NoStoryMessage = styled.div`
  text-align: center;
  color: #aaa;
  font-size: 16px;
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  margin: 0 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: ${({ active }) => (active ? '#A2CA71' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  cursor: pointer;

  &:hover {
    background-color: #A2CA71;
    color: #fff;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 375px;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
  max-height: 90vh;
  overflow-y: auto; /* 모달이 너무 크면 스크롤 생기도록 */
`;

const ModalTitle = styled.h2`
  margin-bottom: 15px;
  text-align: center;
`;

const ModalLabel = styled.label`
  margin-bottom: 5px;
  margin-top: 10px;
  display: block;
  font-weight: bold;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  resize: none;
`;

const ModalImagePreview = styled.img`
  width: 100%;
  max-width: 100px;
  height: auto;
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background-color: #BEDC74;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 48%;

  &:hover {
    background-color: #A2CA71;
  }
`;

export default CreatorMode;
