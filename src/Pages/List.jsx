import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';  // API 호출을 위한 axios 라이브러리

const List = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [isStoryModalOpen, setStoryModalOpen] = useState(false);  // 함수 선언 추가
  const [isEditModalOpen, setEditModalOpen] = useState(false);    // 함수 선언 추가

  useEffect(() => {
    // 로컬 스토리지에서 장소 로드
    const savedPlaces = JSON.parse(localStorage.getItem('places')) || [];
    setPlaces(savedPlaces);
  }, []);
  
  const handleDelete = (id) => {
    // UI에서 해당 박스 제거
    const updatedPlaces = places.filter((_, index) => index !== id);
    setPlaces(updatedPlaces);
  
    // 로컬 스토리지에서도 삭제
    localStorage.setItem('places', JSON.stringify(updatedPlaces));
  };
  
  const PlaceBox = ({ id, name, address, description, onEdit, onDelete }) => (
    <Box>
      <PlaceInfo>
        <PlaceName>{name}</PlaceName>
        <PlaceAddress>{address}</PlaceAddress>
        <PlaceDescription>{description}</PlaceDescription>
      </PlaceInfo>
      <PlaceButtons>
        <PlaceButton onClick={onEdit}>수정하기</PlaceButton>
        <PlaceButton onClick={() => onDelete(id)}>삭제하기</PlaceButton>
      </PlaceButtons>
    </Box>
  );
  
  return (
    <Container>
      <AppWrapper>
        <Header>
          <Title>내가 담은 장소</Title>
        </Header>
        <DistributeButton onClick={() => setStoryModalOpen(true)}>스토리 배포하기</DistributeButton>
        <PlaceList>
          {places.map((place, index) => (
            <PlaceBox
              key={index}
              id={index}
              name={place.place_name}
              address={place.address_name || place.road_address_name}
              description={"설명을 입력해주세요"}
              onEdit={() => setEditModalOpen(true)}
              onDelete={handleDelete}
            />
          ))}
        </PlaceList>
      </AppWrapper>
      <BottomBar>
        <BottomButton onClick={() => navigate('/search')}>
          <ButtonImage src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" />
          <ButtonLabel>장소 검색</ButtonLabel>
        </BottomButton>
        <BottomButton onClick={() => navigate('/list')}>
          <ButtonImage src={`${process.env.PUBLIC_URL}/list.png`} alt="List" />
          <ButtonLabel>장소 목록</ButtonLabel>
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
  background-color: #F6E96B;
  position: relative;
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

const PlaceDescription = styled.p`
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
