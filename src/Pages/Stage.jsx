import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useParams } from 'react-router-dom';
import api from './Api';

const Stage = () => {
  const navigate = useNavigate();
  const { questId, stageId } = useParams();

  const [stage, setStage] = useState({
    stageName: '',
    stageAddress: '',
    stageDes: '',
    stageStory: '',
    quizContent: '',
    quizAnswer: '',
  });

  useEffect(() => {
    // 스테이지 상세 정보 불러오기
    api.get(`/api/stages/${questId}/${stageId}`)
      .then(response => {
        setStage(response.data);
      })
      .catch(error => {
        console.error('스테이지 정보를 불러오는데 실패했습니다.', error);
      });
  }, [questId, stageId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStage(prevStage => ({ ...prevStage, [name]: value }));
  };

  const handleSave = () => {
    // 스테이지 수정 API 호출
    api.put(`/api/stages/${questId}/${stageId}`, null, {
      params: {
        stageDes: stage.stageDes,
        stageStory: stage.stageStory,
        quizContent: stage.quizContent,
        quizAnswer: stage.quizAnswer,
      },
    })
      .then(() => {
        alert('스테이지가 성공적으로 저장되었습니다.');
        navigate(`/list/${questId}`);
      })
      .catch(error => {
        console.error('스테이지 저장에 실패했습니다.', error);
        alert('스테이지 저장에 실패했습니다.');
      });
  };

  const handleDelete = () => {
    // 스테이지 삭제 API 호출
    if (window.confirm('정말로 이 스테이지를 삭제하시겠습니까?')) {
      api.delete(`/api/stages/${questId}/${stageId}`)
        .then(() => {
          alert('스테이지가 성공적으로 삭제되었습니다.');
          navigate(`/list/${questId}`);
        })
        .catch(error => {
          console.error('스테이지 삭제에 실패했습니다.', error);
          alert('스테이지 삭제에 실패했습니다.');
        });
    }
  };

  return (
    <Container>
      <BackgroundImageLeft />
      <BackgroundImageRight />
      <AppWrapper>
        <Header>
          <BackButton onClick={() => navigate(`/list/${questId}`)}>←</BackButton>
          <Title>{stage.stageName}</Title>
        </Header>
        <Form>
          <Label>위치</Label>
          <Value>{stage.stageAddress}</Value>

          <Label>설명</Label>
          <Textarea
            name="stageDes"
            value={stage.stageDes}
            onChange={handleInputChange}
          />

          <Label>스토리</Label>
          <Textarea
            name="stageStory"
            value={stage.stageStory}
            onChange={handleInputChange}
          />

          <Label>퀴즈</Label>
          <Label>내용</Label>
          <Textarea
            name="quizContent"
            value={stage.quizContent}
            onChange={handleInputChange}
          />

          <Label>정답</Label>
          <Input
            name="quizAnswer"
            value={stage.quizAnswer}
            onChange={handleInputChange}
          />

          <SaveButton onClick={handleSave}>저장하기</SaveButton>
        </Form>
      </AppWrapper>

      <BottomBar>
        <BottomButton onClick={() => navigate(`/search/${questId}`)}>
          <ButtonImage src={`${process.env.PUBLIC_URL}/search.png`} alt="Search" />
          <ButtonLabel>장소 검색</ButtonLabel>
        </BottomButton>
        <BottomButton onClick={() => navigate(`/list/${questId}`)}>
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
    background-color: #fefefe;
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
    margin-bottom: 80px; /* 하단바를 고려한 여백 */
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
    width: 100%;
`;

const BackButton = styled.button`
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    align-self: flex-start;
`;

const Title = styled.h1`
    font-size: 20px;
    margin: 10px 0 0 0;
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Label = styled.label`
    font-size: 15px;
    margin-bottom: 5px;
    margin-top: 15px;
    font-weight: bold;
`;

const Value = styled.div`
    font-size: 14px;
    margin-bottom: 10px;
`;

const Textarea = styled.textarea`
    padding: 10px;
    font-size: 14px;
    border: 1px solid #A2CA71;
    border-radius: 5px;
    margin-bottom: 15px;
    background-color: white;
    width: 100%;
    box-sizing: border-box;
`;

const Input = styled.input`
    padding: 10px;
    font-size: 16px;
    border: 1px solid #A2CA71;
    border-radius: 5px;
    margin-bottom: 15px;
    background-color: white;
    width: 100%;
    box-sizing: border-box;
`;

const SaveButton = styled.button`
    padding: 10px;
    background-color: #99cc66;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    margin-bottom: 20px;
    width: 100%;

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

export default Stage;
