import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const PasswordReset = () => {
    const navigate = useNavigate();
    const [latestQuestId, setLatestQuestId] = useState(null);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        // sessionStorage에서 최근에 플레이한 questId를 가져오기
        const storedQuestId = sessionStorage.getItem('latestQuestId');
        if (storedQuestId) {
            setLatestQuestId(storedQuestId);
        }
    }, []);

    const handleSave = () => {
        setErrorMessage(''); // 에러 메시지 초기화

        if (password !== confirmPassword) {
            setErrorMessage('비밀번호가 일치하지 않습니다.');
            return;
        }

        // 비밀번호를 저장하는 API 호출
        api.post('/api/user/update-password', null, {
            params: {
                password,
                passwordCheck: confirmPassword,
            }
        })
        .then(response => {
            setModalMessage('비밀번호가 성공적으로 변경되었습니다.');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/mypage');
            }, 3000);
        })
        .catch(error => {
            console.error("비밀번호를 저장하는데 실패했습니다.", error);
            setErrorMessage('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
        });
    };

    const handlePlayClick = () => {
        if (latestQuestId) {
            navigate(`/play/${latestQuestId}`);
        } else {
            alert("진행 중인 퀘스트가 없습니다.");
        }
    };

    return (
        <Container>
            <BackgroundImageLeft />
            <BackgroundImageRight />
            <AppWrapper>
                <ScrollContent>
                    <Header>
                        <Title>비밀번호 재설정</Title>
                    </Header>

                    <Form>
                        <Label>비밀번호 입력</Label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Label>비밀번호 재입력</Label>
                        <Input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}  {/* 에러 메시지 출력 */}

                        <SaveButton onClick={handleSave}>저장하기</SaveButton>
                    </Form>
                </ScrollContent>

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

            {showModal && (
                <ModalOverlay>
                    <ModalContent>
                        <ModalMessage>{modalMessage}</ModalMessage>
                    </ModalContent>
                </ModalOverlay>
            )}
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
    display: flex;
    flex-direction: column;
    justify-content: space-between;
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
    margin-top: 20px;
    margin-bottom: 80px;
`;

const Header = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    font-size: 24px;
    color: #333;
    text-align: center;
`;

const Form = styled.div`
    width: 100%;
`;

const Label = styled.label`
    font-size: 16px;
    color: #333;
    margin-bottom: 5px;
    display: block;
`;

const Input = styled.input`
    width: 100%;
    padding: 10px;
    margin-bottom: 15px;
    border: 2px solid #A2CA71;
    border-radius: 10px;
    font-size: 16px;
    box-sizing: border-box;
`;

const SaveButton = styled.button`
    width: 100%;
    padding: 15px;
    background-color: #387F39;
    color: white;
    border: none;
    border-radius: 50px;
    cursor: pointer;
    font-size: 18px;
    text-align: center;
    margin-top: 5%;

    &:hover {
        background-color: #306e2b;
    }
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

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 100;
`;

const ModalContent = styled.div`
    background-color: #BEDC74;
    padding: 30px 40px;
    border-radius: 10px;
    text-align: center;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    font-weight: bold;
`;

const ModalMessage = styled.p`
    font-size: 18px;
    color: #333;
    margin: 0;
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin-top: -10px;
    margin-bottom: 15px;
`;

export default PasswordReset;
