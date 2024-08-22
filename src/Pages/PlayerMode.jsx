import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

const PlayerMode = () => {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  const searchQuests = () => {
    if (!keyword.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    }
    console.log(`Searching quests with keyword: ${keyword}`);
  };

  return (
    <Container>
      <BackgroundImageLeft />
      <BackgroundImageRight />
      <AppWrapper>
        <SearchBarWrapper>
          <SearchInput
            type="text"
            placeholder="퀘스트 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <SearchButton onClick={searchQuests}>
            <SearchIcon
              src={`${process.env.PUBLIC_URL}/search.png`}
              alt="Search"
            />
          </SearchButton>
        </SearchBarWrapper>
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
  padding: 0; /* 패딩 제거 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`;

const SearchBarWrapper = styled.div`
  width: 80%;
  height: 50px;
  display: flex;
  justify-content: space-between;
  border-radius: 15px;
  overflow: hidden;
  border: 2px solid #A2CA71;
  margin-top: 20px;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
`;

const SearchButton = styled.button`
  padding: 0 20px;
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
