import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const List = () => {
  const [isStoryModalOpen, setStoryModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);

  const openStoryModal = () => setStoryModalOpen(true);
  const closeStoryModal = () => setStoryModalOpen(false);

  const openEditModal = () => setEditModalOpen(true);
  const closeEditModal = () => setEditModalOpen(false);

  const handleDelete = (id) => {
    // 여기서 삭제 로직을 처리
    console.log(`Delete place with id: ${id}`);
  };

  const navigate = useNavigate();

  return (
    <Container>
      <AppWrapper>
        <Header>
          <Title>내가 담은 장소</Title>
          <DistributeButton onClick={openStoryModal}>스토리 배포하기</DistributeButton>
        </Header>
        <PlaceList>
          {/* 예시 -> 나중에 컴포넌트화 */}
          <PlaceBox>
            <PlaceInfo>
              <PlaceName>장소명: 광주광역시청</PlaceName>
              <PlaceAddress>주소: 광주광역시 서구</PlaceAddress>
              <PlaceDescription>설명: 광주의 시청</PlaceDescription>
            </PlaceInfo>
            <PlaceButtons>
              <PlaceButton onClick={openEditModal}>수정하기</PlaceButton>
              <PlaceButton onClick={() => handleDelete(1)}>삭제하기</PlaceButton>
            </PlaceButtons>
          </PlaceBox>
        </PlaceList>

        {isStoryModalOpen && (
          <ModalBackdrop>
            <ModalContent>
              <ModalTitle>스토리 배포</ModalTitle>
              <ModalLabel>이름:</ModalLabel>
              <ModalInput placeholder="스토리 이름을 입력하세요" />
              <ModalLabel>지역:</ModalLabel>
              <ModalInput placeholder="지역을 입력하세요" />
              <ModalLabel>설명:</ModalLabel>
              <ModalTextarea placeholder="스토리 설명을 입력하세요" />
              <ModalLabel>대표사진:</ModalLabel>
              <ModalInput type="file" />
              <ModalButtons>
                <ModalButton onClick={closeStoryModal}>취소</ModalButton>
                <ModalButton $primary>배포</ModalButton>
              </ModalButtons>
            </ModalContent>
          </ModalBackdrop>
        )}

        {isEditModalOpen && (
          <ModalBackdrop>
            <ModalContent>
              <ModalTitle>설명 수정</ModalTitle>
              <ModalLabel>설명:</ModalLabel>
              <ModalTextarea placeholder="장소에 대한 설명을 수정하세요" />
              <ModalButtons>
                <ModalButton onClick={closeEditModal}>취소</ModalButton>
                <ModalButton $primary>수정 완료</ModalButton>
              </ModalButtons>
            </ModalContent>
          </ModalBackdrop>
        )}

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
      </AppWrapper>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #FEFEFE;
`;

const AppWrapper = styled.div`
  width: 375px;
  height: 100vh;
  background-color: #FEF69B;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  width: 100%;
`;

const Title = styled.h1`
  font-size: 20px;
`;

const DistributeButton = styled.button`
  padding: 10px 20px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #218838;
  }
`;

const PlaceList = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
  margin-bottom: 80px; /* 하단바와의 간격 확보 */
`;

const PlaceBox = styled.div`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #FFFFFF;
  margin-bottom: 10px;
`;

const PlaceInfo = styled.div`
  margin-bottom: 10px;
`;

const PlaceName = styled.h2`
  font-size: 18px;
`;

const PlaceAddress = styled.p`
  margin: 5px 0;
`;

const PlaceDescription = styled.p`
  margin: 5px 0;
`;

const PlaceButtons = styled.div`
  display: flex;
  gap: 10px;
`;

const PlaceButton = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const ModalBackdrop = styled.div`
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
  background-color: #fefefe;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 400px;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;

const ModalLabel = styled.label`
  font-size: 18px;
  margin-bottom: 5px;
  display: block;
`;

const ModalInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
`;

const ModalTextarea = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #ccc;
  resize: none;
  margin-bottom: 20px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  border: none;
  cursor: pointer;
  font-size: 16px;
  background-color: ${(props) => (props.$primary ? "#28a745" : "#ccc")};
  color: ${(props) => (props.$primary ? "white" : "black")};

  &:hover {
    background-color: ${(props) => (props.$primary ? "#218838" : "#bbb")};
  }
`;

const BottomBar = styled.div`
  width: 100%;
  height: 80px;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #ffffff;
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
