import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const CreatorMode = ({ stories = [] }) => {
  const navigate = useNavigate();

  return (
    <Container>
      <AppWrapper>
        <Header>
          <BackButton onClick={() => navigate('/select')}>뒤로 가기</BackButton>
        </Header>
        <Title>내가 만든 스토리</Title>
        <AddStoryButton onClick={() => navigate('/search')}>스토리 추가하기</AddStoryButton>
        <StoryList>
          {stories.length > 0 ? (
            stories.map((story, index) => (
              <StoryBox key={index}>
                <StoryInfo>
                  <StoryTitle>이름: {story.name}</StoryTitle>
                  <StoryLocation>위치: {story.location}</StoryLocation>
                  <StoryAuthor>작성자: {story.author}</StoryAuthor>
                </StoryInfo>
                <StoryImage src={story.image || "https://via.placeholder.com/100"} alt="대표사진" />
                <StoryButtons>
                  <StoryButton onClick={() => navigate('/list')}>수정하기</StoryButton>
                  <StoryButton>삭제하기</StoryButton>
                </StoryButtons>
              </StoryBox>
            ))
          ) : (
            <NoStoryMessage>아직 생성된 스토리가 없습니다.</NoStoryMessage>
          )}
        </StoryList>
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
  width: 100%;
  display: flex;
  justify-content: flex-start;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: black;
  cursor: pointer;
  font-size: 16px;
  margin-top: 5%;

  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-size: 20px;
  text-align: center;
  margin: 10px 0;
`;

const AddStoryButton = styled.button`
  display: block;
  padding: 10px 20px;
  background-color: #D9D9D9;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  height: 50px;
  margin-top: 10px;
  margin-bottom: 20px;

  &:hover {
    background-color: #0056b3;
  }
`;

const StoryList = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const StoryBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #FFFFFF;
`;

const StoryInfo = styled.div`
  flex-grow: 1;
`;

const StoryTitle = styled.h2`
  font-size: 18px;
`;

const StoryLocation = styled.p`
  margin: 5px 0;
`;

const StoryAuthor = styled.p`
  margin: 5px 0;
`;

const StoryImage = styled.img`
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 5px;
  margin-left: 20px;
`;

const StoryButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const StoryButton = styled.button`
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

const NoStoryMessage = styled.div`
  text-align: center;
  color: #aaa;
  font-size: 16px;
`;

export default CreatorMode;
