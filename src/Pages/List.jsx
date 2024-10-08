import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import api from './Api';
import LocationSelector from './LocationSelector';

const List = () => {
  const navigate = useNavigate();
  const { questId } = useParams();
  const [places, setPlaces] = useState([]);
  const [isStoryModalOpen, setStoryModalOpen] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [questName, setQuestName] = useState('');
  const [location, setLocation] = useState('');
  const [mainStory, setMainStory] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDistributing, setIsDistributing] = useState(false);
  const [headCount, setHeadCount] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    // 최신 questId를 세션 스토리지에서 가져옴
    const latestQuestId = sessionStorage.getItem('latestQuestId');

    if (questId !== latestQuestId) {
      // questId가 최신 questId와 일치하지 않으면 /select로 리디렉션
      navigate('/select');
      return; // 리디렉션 후 더 이상의 로직을 실행하지 않도록 리턴
    }

    if (questId) {
      api.get(`/api/stages/${questId}`)
        .then(response => {
          if (response.data && response.data.length > 0) {
            setPlaces(response.data);
          } else {
            console.error("No stages found for the given Quest ID.");
          }
        })
        .catch(error => {
          console.error("API call failed. Details:", error);
        });
    }
  }, [questId, navigate]);

  const handleDelete = (stageId) => {
    if (window.confirm('정말로 이 스테이지를 삭제하시겠습니까?')) {
      api.delete(`/api/stages/${questId}/${stageId}`)
        .then(() => {
          alert('스테이지가 성공적으로 삭제되었습니다.');
          setPlaces(places.filter(place => place.stageId !== stageId));
        })
        .catch(error => {
          console.error('스테이지 삭제에 실패했습니다.', error);
          alert('스테이지 삭제에 실패했습니다.');
        });
    }
  };

  const handleOpenModal = () => {
    // 퀘스트 수정 정보를 불러오기
    api.get(`/api/quests/${questId}/update`)
      .then(response => {
        const { questName, location, mainStory, image, headCount, time } = response.data;
        setQuestName(questName);
        setLocation(location);
        setMainStory(mainStory);
        setHeadCount(headCount.toString()); // headCount를 문자열로 변환하여 상태에 설정
        setTime(time);

        setImagePreview(`${process.env.PUBLIC_URL}/${image}`); // 서버로부터 이미지 URL을 가져옴
        setSelectedQuest(questId);
        setStoryModalOpen(true);
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

  const handleDistribute = () => {
    setIsDistributing(true);
    api.post(`/api/quests/${selectedQuest}/save`, null, {
      params: {
        questName,
        location,
        mainStory,
        headCount: headCount ? Number(headCount) : null, // headCount가 비어 있으면 null로 전달
        time
      }
    })
      .then(() => {
        if (selectedImage) {
          const formData = new FormData();
          formData.append('file', selectedImage);

          return api.post(`/api/quests/${selectedQuest}/image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });
        }
      })
      .then(() => {
        setIsDistributing(false);
        alert('배포가 완료되었습니다.');
        navigate('/creator');
      })
      .catch(error => {
        console.error("퀘스트를 수정하는데 실패했습니다.", error);
        setIsDistributing(false);
      });
  };

  const PlaceBox = ({ stageId, name, address }) => (
    <Box>
      <PlaceInfo>
        <PlaceName>{name}</PlaceName>
        <PlaceAddress>{address}</PlaceAddress>
      </PlaceInfo>
      <PlaceButtons>
        <PlaceButton onClick={() => navigate(`/stage/${questId}/${stageId}`)}>수정하기</PlaceButton>
        <PlaceButton onClick={() => handleDelete(stageId)}>삭제하기</PlaceButton>
      </PlaceButtons>
    </Box>
  );

  return (
    <Container>
      <BackgroundImageLeft />
      <BackgroundImageRight />
      <AppWrapper>
        <Header>
          <Title>내가 담은 스테이지</Title>
        </Header>
        <DistributeButton onClick={handleOpenModal}>퀘스트 배포하기</DistributeButton>
        <PlaceList>
          {places.map((place) => (
            <PlaceBox
              key={place.stageId}
              stageId={place.stageId}
              name={place.stageName}
              address={place.stageAddress}
            />
          ))}
        </PlaceList>
      </AppWrapper>
      <BottomBar>
        <BottomButton onClick={() => navigate(`/search/${questId}`)}>
          <ButtonImage src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" />
          <ButtonLabel>스테이지 검색</ButtonLabel>
        </BottomButton>
        <BottomButton onClick={() => navigate(`/list/${questId}`)}>
          <ButtonImage src={`${process.env.PUBLIC_URL}/list.png`} alt="List" />
          <ButtonLabel>스테이지 목록</ButtonLabel>
        </BottomButton>
        <BottomButton onClick={() => navigate(`/ai/${questId}`)}>
          <ButtonImage src={`${process.env.PUBLIC_URL}/ai.png`} alt="AI Story" />
          <ButtonLabel>AI 스토리</ButtonLabel>
          <ButtonLabel>작가</ButtonLabel>
        </BottomButton>
        <BottomButton onClick={() => navigate('/select')}>
          <ButtonImage src={`${process.env.PUBLIC_URL}/mode.png`} />
          <ButtonLabel>모드선택</ButtonLabel>
        </BottomButton>
      </BottomBar>

      {isStoryModalOpen && (
        <ModalOverlay>
          <ModalContent>
            <ScrollContent>
              <ModalTitle>퀘스트 배포</ModalTitle>
              <ModalLabel>이름</ModalLabel>
              <ModalInput
                type="text"
                value={questName}
                onChange={(e) => setQuestName(e.target.value)}
              />
              <ModalLabel>위치</ModalLabel>
              <LocationSelector
                selectedLocation={location}
                setSelectedLocation={setLocation}
              />
              <ModalLabel>메인 스토리</ModalLabel>
              <ModalTextarea
                value={mainStory}
                onChange={(e) => setMainStory(e.target.value)}
                style={{ minHeight: '100px' }}
              />
              <ModalLabel>적정 인원</ModalLabel>
              <ModalInput
                type="number"
                placeholder="5"
                value={headCount}
                onChange={(e) => setHeadCount(e.target.value)}  // 숫자가 아닌 문자열로 다룹니다
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
                <ModalButton onClick={() => setStoryModalOpen(false)}>취소</ModalButton>
                <ModalButton onClick={handleDistribute} disabled={isDistributing}>
                  {isDistributing ? '배포 중...' : '배포'}
                </ModalButton>
              </ModalButtons>
            </ScrollContent>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100vh;
  width: 100%;
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
  flex-grow: 1;
  background-color: #FEFEFE;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  margin-bottom: 80px;
  padding: 20px;
  z-index: 1;
  box-sizing: border-box;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 20px;
`;

const DistributeButton = styled.button`
  width: 90%;
  padding: 15px;
  background-color: #99CC66;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 20px;

  &:hover {
    background-color: #88BB55;
  }
`;

const PlaceList = styled.div`
  flex-grow: 1;
  width: 90%;
  overflow-y: auto;
`;

const Box = styled.div`
  padding: 15px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #FFFFFF;
  margin-bottom: 15px;
`;

const PlaceInfo = styled.div`
  margin-bottom: 15px;
`;

const PlaceName = styled.h2`
  font-size: 18px;
  margin-bottom: 5px;
`;

const PlaceAddress = styled.p`
  margin: 5px 0;
  font-size: 14px;
  color: #666;
`;

const PlaceButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const PlaceButton = styled.button`
  flex: 1;
  padding: 10px;
  background-color: #99CC66;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #88BB55;
  }
`;

const BottomBar = styled.div`
  width: 100%;  
  max-width: 375px;
  height: 80px;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #A2CA71;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
  z-index: 100;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 100%;
  max-width: 375px;
  height: 80vh; /* 전체 높이의 80%로 설정 */
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
`;

const ScrollContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  margin-bottom: 10px;
`;

const ModalLabel = styled.label`
  margin-bottom: 5px;
  margin-top: 10px;
  display: block;
  text-align: left;
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
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const ModalImagePreview = styled.img`
  width: 100%;
  max-width: 100px;
  height: auto;
  margin-bottom: 10px;
  border-radius: 5px;
  display: block;
  margin-left: 0;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  background-color: #99cc66;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 48%;

  &:hover {
    background-color: #88bb55;
  }

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

export default List;
