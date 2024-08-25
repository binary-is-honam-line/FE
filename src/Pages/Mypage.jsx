import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const Mypage = () => {
  const navigate = useNavigate();
  const [latestQuestId, setLatestQuestId] = useState(null);
  const [questClearedCount, setQuestClearedCount] = useState(0);

  useEffect(() => {
    // sessionStorage에서 최근에 플레이한 questId를 가져오기
    const storedQuestId = sessionStorage.getItem('latestQuestId');
    if (storedQuestId) {
      setLatestQuestId(storedQuestId);
    }

    // 클리어한 퀘스트 갯수를 가져오기
    api.get('/api/clear/quest-album/count')
      .then(response => {
        setQuestClearedCount(response.data);
      })
      .catch(error => {
        console.error('클리어한 퀘스트 갯수를 가져오는 데 실패했습니다.', error);
      });
  }, []);

  const handleLogout = async () => {
    try {
      const user = JSON.parse(sessionStorage.getItem('user'));
      await api.post('/logout');
      sessionStorage.removeItem('user'); // 세션에서 사용자 정보 제거
      console.log(`${user.email} has logged out.`);
      navigate('/login'); // 즉시 로그인 페이지로 이동
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  const handlePlayClick = () => {
    if (latestQuestId) {
      navigate(`/play/${latestQuestId}`);
    } else {
      alert("진행 중인 퀘스트가 없습니다.");
    }
  };

  const getStarImage = () => {
    if (questClearedCount >= 30) {
      return `${process.env.PUBLIC_URL}/star5.png`;
    } else if (questClearedCount >= 20) {
      return `${process.env.PUBLIC_URL}/star4.png`;
    } else if (questClearedCount >= 10) {
      return `${process.env.PUBLIC_URL}/star3.png`;
    } else if (questClearedCount >= 5) {
      return `${process.env.PUBLIC_URL}/star2.png`;
    } else if (questClearedCount >= 1) {
      return `${process.env.PUBLIC_URL}/star1.png`;
    } else {
      return `${process.env.PUBLIC_URL}/monkeys.png`;
    }
  };

  return (
    <Container>
      <BackgroundImageLeft />
      <BackgroundImageRight />
      <AppWrapper>
        <Header>
          <Title>마이페이지</Title>
        </Header>

        <StarSection>
          <StarImage src={getStarImage()} />
        </StarSection>

        <ButtonGrid>
          <GridButton onClick={() => navigate('/edit')}>
            <ButtonImage src={`${process.env.PUBLIC_URL}/edit.png`} />
            <ButtonLabel>회원 정보 수정</ButtonLabel>
          </GridButton>
          <GridButton onClick={() => navigate('/password-reset')}>
            <ButtonImage src={`${process.env.PUBLIC_URL}/password.png`} />
            <ButtonLabel>비밀번호 재설정</ButtonLabel>
          </GridButton>
          <GridButton onClick={() => navigate('/album')}>
            <ButtonImage src={`${process.env.PUBLIC_URL}/album.png`} />
            <ButtonLabel>퀘스트 앨범</ButtonLabel>
          </GridButton>
          <GridButton onClick={handleLogout}>
            <ButtonImage src={`${process.env.PUBLIC_URL}/logout.png`} />
            <ButtonLabel>로그아웃</ButtonLabel>
          </GridButton>
        </ButtonGrid>
        
        <BottomBar>
          <BottomButton onClick={() => navigate('/player')}>
            <ButtonImageBottom
              src={`${process.env.PUBLIC_URL}/search.png`}
            />
            <ButtonLabelBottom>퀘스트 검색</ButtonLabelBottom>
          </BottomButton>
          <BottomButton onClick={handlePlayClick}>
            <ButtonImageBottom
              src={`${process.env.PUBLIC_URL}/play.png`}
            />
            <ButtonLabelBottom>플레이</ButtonLabelBottom>
          </BottomButton>
          <BottomButton onClick={() => navigate('/mypage')}>
            <ButtonImageBottom
              src={`${process.env.PUBLIC_URL}/mypage.png`}
            />
            <ButtonLabelBottom>마이페이지</ButtonLabelBottom>
          </BottomButton>
          <BottomButton onClick={() => navigate('/select')}>
            <ButtonImageBottom src={`${process.env.PUBLIC_URL}/mode.png`} />
            <ButtonLabelBottom>모드선택</ButtonLabelBottom>
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
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
`;

const Header = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
`;

const Title = styled.h1`
    font-size: 24px;
    color: #333;
    margin-bottom: 10px;
    text-align: center;
`;

const StarSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 20px;
`;

const StarImage = styled.img`
    width: 100px;
    height: 100px;
`;

const ButtonGrid = styled.div`
    width: 80%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 10px;
    justify-content: center;
    align-items: center;
    margin-top: auto;
    margin-bottom: auto;
`;

const GridButton = styled.button`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    background-color: #BEDC74;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    width: 100%;
    aspect-ratio: 1;

    &:hover {
        background-color: #387F39;
        color: white;
    }

    &:hover img {
        filter: brightness(0) invert(1);
    }
`;

const ButtonImage = styled.img`
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
`;

const ButtonLabel = styled.span`
    font-size: 14px;
    color: #333;
`;

const BottomBar = styled.div`
    width: 100%;  
    max-width: 375px;
    height: 80px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    background-color: #A2CA71;
    box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
    position: fixed;
    bottom: 0;
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

const ButtonImageBottom = styled.img`
    width: 24px;
    height: 24px;
    margin-bottom: 5px;
`;

const ButtonLabelBottom = styled.div`
    font-size: 12px;
    text-align: center;
`;

export default Mypage;