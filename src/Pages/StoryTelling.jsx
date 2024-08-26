import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const StoryTelling = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 스토리텔링 대사 배열
  const dialogues = [
    "-안녕! 나는 이 모험의 안내자, 탐험 오랑이야. 지금부터 너는 나와 함께 보물을 찾는 신나는 여정을 떠나게 될 거야!",
    "-이 게임에서는 두 가지 방법으로 모험을 즐길 수 있어. 직접 스테이지를 만들고 모험을 디자인할 수도 있고, 다른 탐험가들이 만든 퀘스트를 플레이할 수도 있어.",
    "-먼저 크리에이터 모드에서 너만의 모험을 만들어봐! 스테이지마다 깃발이 없는 오랑이 마커를 선택하고, 그곳에 보물을 숨길 수 있어. 너만의 퀘스트를 디자인해 다른 탐험가들에게 도전장을 내밀어봐!",
    "-또는 플레이어 모드에서 다른 탐험가들이 만든 퀘스트를 플레이할 수 있어. 각 스테이지에서 OX 퀴즈를 풀고 보물을 찾아내면, 찾은 보물로 마커가 바뀌게 돼. 모든 스테이지를 클리어하고, 별을 모아봐!",
    "-각 퀘스트를 완료할 때마다, 클리어한 스테이지 수에 따라 별을 받을 수 있어. 별이 많아질수록 너의 모험이 얼마나 대단했는지를 증명할 수 있지!",
    "-이제, 모험을 시작할 준비가 됐니? 크리에이터 모드로 새로운 모험을 디자인하거나, 플레이어 모드로 다른 탐험가들의 도전을 받아들여봐!"
  ];

  useEffect(() => {
    if (dialogues[currentStep]) {
      setIsTyping(true);
      setDisplayedText(''); // 초기화

      let currentIndex = 0;
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + dialogues[currentStep].charAt(currentIndex));
        currentIndex++;
        if (currentIndex >= dialogues[currentStep].length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleNext = () => {
    if (!isTyping && currentStep < dialogues.length - 1) {
      setCurrentStep(currentStep + 1);
    } else if (!isTyping && currentStep === dialogues.length - 1) {
      navigate('/select');
    }
  };

  const handleSkip = () => {
    navigate('/select'); // 스킵하고 바로 /select로 이동
  };

  return (
    <Container>
      <BackgroundImageLeft />
      <BackgroundImageRight />
      <AppWrapper>
        <ScrollContent>
          <ContentWrapper>
            <MonkeyImage src={`${process.env.PUBLIC_URL}/monkeys.png`} alt="Monkey" />
            <SpeechBubble onClick={handleNext}>
              <Text>{displayedText}</Text>
              <NextButton>⏩ 계속하려면 클릭</NextButton>
            </SpeechBubble>
            <SkipButton onClick={handleSkip}>⏭ 스킵</SkipButton>
          </ContentWrapper>
        </ScrollContent>
      </AppWrapper>
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
  width: calc(50% - 187.5px); /* 50%에서 AppWrapper의 절반을 뺀 값 */
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
  width: calc(50% - 187.5px); /* 50%에서 AppWrapper의 절반을 뺀 값 */
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
  background-color: #A2CA71;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 중앙 정렬 */
  align-items: center;
  position: relative;
  z-index: 1;
`;

const ScrollContent = styled.div`
  flex-grow: 1;
  width: 100%;
  overflow-y: auto;
  padding: 10px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 중앙 정렬 */
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const MonkeyImage = styled.img`
  width: 180px;
  margin-bottom: 20px;
  animation: bounce 2s infinite; /* 애니메이션 추가 */
  
  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-20px);
    }
    60% {
      transform: translateY(-10px);
    }
  }
`;

const SpeechBubble = styled.div`
  background: #fff;
  border-radius: 25px;
  padding: 20px;
  max-width: 350px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  position: relative;
  cursor: pointer;
  margin-top: 10px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    border-width: 15px;
    border-style: solid;
    border-color: #fff transparent transparent transparent;
  }
`;

const Text = styled.p`
  font-size: 18px;
  color: #333;
  text-align: center;
`;

const NextButton = styled.div`
  font-size: 14px;
  color: #555;
  text-align: right;
  margin-top: 10px;
`;

const SkipButton = styled.button`
  margin-top: 30px;
  background-color: #387F39;
  color: white;
  padding: 10px 30px;
  border: none;
  border-radius: 30px;
  cursor: pointer;
  font-size: 16px;
  
  &:hover {
    color: black;
  }
`;

export default StoryTelling;
