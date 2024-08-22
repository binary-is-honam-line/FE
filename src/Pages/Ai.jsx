import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import api from './Api';

const Ai = () => {
  const [prompt, setPrompt] = useState('');
  const [mainStory, setMainStory] = useState('');
  const [stages, setStages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // 페이지당 표시할 아이템 수
  const { questId } = useParams();
  const navigate = useNavigate();

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = () => {
    if (!questId) {
      console.error("questId가 정의되지 않았습니다.");
      return;
    }
    
    api.post(`/api/story-teller/${questId}/story`, null, {
      params: { input: prompt }
    })
    .then(() => {
      fetchStories();
    })
    .catch((error) => {
      console.error("스토리 생성 중 에러 발생:", error);
    });
  };

  const fetchStories = () => {
    if (!questId) {
      console.error("questId가 정의되지 않았습니다.");
      return;
    }
    
    api.get(`/api/story-teller/${questId}/story`)
    .then((response) => {
      setMainStory(response.data.mainDto.mainStory);
      setStages(response.data.stageDtoList);
    })
    .catch((error) => {
      console.error("스토리 불러오기 중 에러 발생:", error);
    });
  };

  useEffect(() => {
    if (questId) {
      fetchStories();
    }
  }, [questId]);

  // 페이지네이션 로직
  const indexOfLastStage = currentPage * itemsPerPage;
  const indexOfFirstStage = indexOfLastStage - itemsPerPage;
  const currentStages = stages.slice(indexOfFirstStage, indexOfLastStage);
  const totalPages = Math.ceil(stages.length / itemsPerPage);

  const nextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  return (
    <Container>
      <BackgroundImageLeft />
      <BackgroundImageRight />
      <AppWrapper>
        <Title>AI 스토리 작가</Title>
        <PromptInput
          placeholder="여기에 프롬프트를 입력하세요."
          value={prompt}
          onChange={handlePromptChange}
          style = {{ minHeight: '50px' }}
        />
        <GenerateButton onClick={handleGenerate}>생성하기</GenerateButton>

        {mainStory && (
          <StorySection>
            <SectionTitle>메인 스토리</SectionTitle>
            <StoryText>{mainStory}</StoryText>
          </StorySection>
        )}

        {currentStages.length > 0 && (
          <SectionContainer>
            <SectionTitle>장소 스토리</SectionTitle>
            {currentStages.map((stage, index) => (
              <StoryBox key={index}>
                <StageTitle>{stage.stageName}</StageTitle>
                <StageStory>{stage.stageStory}</StageStory>
              </StoryBox>
            ))}
          </SectionContainer>
        )}

        {/* 페이지네이션 버튼 */}
        <Pagination>
          <PageButton onClick={prevPage} disabled={currentPage === 1}>
            이전
          </PageButton>
          <PageNumber>{currentPage} / {totalPages}</PageNumber>
          <PageButton onClick={nextPage} disabled={currentPage === totalPages}>
            다음
          </PageButton>
        </Pagination>
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
      </BottomBar>
    </Container>
  );
};

// 스타일 컴포넌트들
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
  overflow-y: auto;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 80px;
`;

const Title = styled.h1`
  font-size: 20px;
  text-align: center;
  margin-bottom: 20px;
`;

const PromptInput = styled.textarea`
  width: 90%;
  padding: 15px;
  font-size: 16px;
  border: 1px solid #A2CA71;
  border-radius: 5px;
  margin-bottom: 20px;
  background-color: white;
  resize: none;
`;

const GenerateButton = styled.button`
  width: 100%;
  padding: 15px;
  background-color: #BEDC74;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #88bb55;
  }
`;

const StorySection = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const SectionContainer = styled.div`
  width: 100%;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h2`
  font-size: 18px;
  margin-bottom: 5px;
  color: black;
`;

const StoryText = styled.p`
  font-size: 14px;
  color: #333;
  white-space: pre-wrap;
`;

const StoryBox = styled.div`
  padding: 10px;
  background-color: #E6EFCE;
  border-left: 5px solid #BEDC74;
  border-radius: 5px;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StageTitle = styled.h3`
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 5px;
  background-color: #BEDC74;
  padding: 5px;
  border-radius: 3px;
  color: #333;
`;

const StageStory = styled.p`
  font-size: 14px;
  color: #333;
  white-space: pre-wrap;
  padding: 5px;
  border-radius: 5px;
  background-color: #FFF;
  margin-top: 5px;
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
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#A2CA71')};
  color: ${({ disabled }) => (disabled ? '#fff' : '#333')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};

  &:hover {
    background-color: #A2CA71;
    color: #fff;
  }
`;

const PageNumber = styled.span`
  padding: 8px 12px;
  font-size: 16px;
  color: #333;
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

export default Ai;
