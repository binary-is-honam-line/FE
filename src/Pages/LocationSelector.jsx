import React, { useState } from 'react';
import styled from 'styled-components';

const locations = [
  ['광주', '전남', '전북', '호남'],
  ['전주', '순천', '익산', '여수'],
  ['군산', '목포', '광양', '나주'],
  ['정읍', '완주', '김제', '남원'],
  ['무안', '신안'],
];

const LocationSelector = ({ selectedLocation, setSelectedLocation, noBorder }) => {
  const [tempLocation, setTempLocation] = useState(selectedLocation || ''); // 임시로 선택된 지역
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocationClick = (location) => {
    setTempLocation(location); // 선택한 지역을 임시 변수에 저장
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelect = () => {
    setSelectedLocation(tempLocation); // 임시 저장된 지역을 최종 선택된 지역으로 저장
    closeModal(); // 모달 닫기
  };

  return (
    <Container>
      <InputBox 
        onClick={openModal} 
        readOnly 
        value={selectedLocation || ' '} 
        placeholder="지역을 선택하세요." 
        noBorder={noBorder} // 추가된 props
      />
      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <Title>지역 선택</Title>
            <LocationGrid>
              {locations.map((row, rowIndex) => (
                <Row key={rowIndex}>
                  {row.map((location, colIndex) => (
                    <LocationButton 
                      key={colIndex} 
                      onClick={() => handleLocationClick(location)}
                      isSelected={tempLocation === location} // 선택된 지역 스타일 적용
                    >
                      {location}
                    </LocationButton>
                  ))}
                </Row>
              ))}
            </LocationGrid>
            <ButtonContainer>
              <ActionButton onClick={closeModal}>취소하기</ActionButton>
              <ActionButton onClick={handleSelect}>선택하기</ActionButton>
            </ButtonContainer>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const InputBox = styled.input`
  width: 70%;
  padding: 5px;
  font-size: 12px;
  border: ${({ noBorder }) => (noBorder ? 'none' : '1px solid #ccc')}; 
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ noBorder }) => (noBorder ? 'transparent' : '#fff')}; 
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
`;

const ModalContent = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 375px;
  text-align: center;
  box-sizing: border-box;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const LocationGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const LocationButton = styled.button`
  flex: 1;
  padding: 10px;
  background-color: ${({ isSelected }) => (isSelected ? '#A2CA71' : '#f0f0f0')};
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #e0e0e0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
`;

const ActionButton = styled.button`
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

export default LocationSelector;
