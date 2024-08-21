import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import api from './Api';

const List = () => {
  const navigate = useNavigate();
  const { questId } = useParams();
  const [places, setPlaces] = useState([]);
  const [isStoryModalOpen, setStoryModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    if (questId) {
      api.get(`/api/stages/${questId}`)
        .then(response => {
          console.log('API Response:', response.data);
          if (response.data && response.data.length > 0) {
            setPlaces(response.data);
            response.data.forEach(place => {
              console.log("Stage ID:", place.stageId);
            });
          } else {
            console.error("No stages found for the given Quest ID.");
          }
        })
        .catch(error => {
          if (error.response && error.response.status === 404) {
            console.error("스테이지를 찾을 수 없습니다. Quest ID가 올바른지 확인하세요.");
          } else {
            console.error("API call failed. Details:", error);
          }
        });
    }
  }, [questId]);

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
        <DistributeButton onClick={() => setStoryModalOpen(true)}>퀘스트 배포하기</DistributeButton>
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
        <BottomButton onClick={() => navigate('/ai')}>
          <ButtonImage src={`${process.env.PUBLIC_URL}/ai.png`} alt="AI Story" />
          <ButtonLabel>AI 스토리</ButtonLabel>
          <ButtonLabel>작가</ButtonLabel>
        </BottomButton>
      </BottomBar>
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
  z-index: 1;
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
    color: #ff6f61;
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

export default List;
