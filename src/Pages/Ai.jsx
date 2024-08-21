import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Ai = () => {
  const [prompt, setPrompt] = useState('');
  const navigate = useNavigate();

  const handlePromptChange = (e) => {
    setPrompt(e.target.value);
  };

  const handleGenerate = () => {
    // 여기에 프롬프트를 기반으로 AI 스토리를 생성하는 API 호출 로직을 추가
    console.log('프롬프트로 스토리 생성:', prompt);
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
            />
            <GenerateButton onClick={handleGenerate}>생성하기</GenerateButton>
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
