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
  const [tempLocation, setTempLocation] = useState(selectedLocation || ''); 
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLocationClick = (location) => {
    setTempLocation(location);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSelect = () => {
    setSelectedLocation(tempLocation);
    closeModal();
  };

  return (
    <Container>
      <InputBox 
        onClick={openModal} 
        readOnly 
        value={selectedLocation || ' '}
        placeholder="지역을 선택하세요." 
        $noBorder={noBorder}
      />
      {isModalOpen && (
        <ModalOverlay onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <Title>지역 선택</Title>
            <ScrollContent>
              <LocationGrid>
                {locations.map((row, rowIndex) => (
                  <Row key={rowIndex}>
                    {row.map((location, colIndex) => (
                      <LocationButton 
                        key={colIndex} 
                        onClick={() => handleLocationClick(location)}
                        $isSelected={tempLocation === location}
                      >
                        {location}
                      </LocationButton>
                    ))}
                  </Row>
                ))}
              </LocationGrid>
            </ScrollContent>
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
  border: ${({ $noBorder }) => ($noBorder ? 'none' : '1px solid #ccc')}; 
  border-radius: 4px;
  cursor: pointer;
  background-color: ${({ $noBorder }) => ($noBorder ? 'transparent' : '#fff')}; 
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
  max-height: 80vh; /* 모달의 최대 높이 설정 */
  text-align: center;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const ScrollContent = styled.div`
  flex-grow: 1;
  overflow-y: auto; /* 스크롤 가능하게 설정 */
  margin-bottom: 20px; /* 하단 버튼과의 간격 설정 */
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
  background-color: ${({ $isSelected }) => ($isSelected ? '#A2CA71' : '#f0f0f0')}; 
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
