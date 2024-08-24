import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const Edit = () => {
    const navigate = useNavigate();
    const [latestQuestId, setLatestQuestId] = useState(null);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [phone, setPhone] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        // sessionStorage에서 최근에 플레이한 questId를 가져오기
        const storedQuestId = sessionStorage.getItem('latestQuestId');
        if (storedQuestId) {
            setLatestQuestId(storedQuestId);
        }

        // API 호출로 유저 데이터를 가져옴
        api.get('/api/user/info')
            .then(response => {
                const { name, email, nickname, phone } = response.data;
                setName(name);
                setEmail(email);
                setNickname(nickname);
                setPhone(phone);
            })
            .catch(error => {
                console.error("데이터를 가져오는데 실패했습니다.", error);
                setModalMessage('유저 정보를 불러오는데 실패했습니다. 다시 시도해주세요.');
                setShowModal(true);
            });
    }, []);

    const handleSave = () => {
        // 변경된 데이터를 저장하는 API 호출
        api.put('/api/user/info', null, {
            params: {
                name,
                nickname,
                phone,
            }
        })
        .then(response => {
            setModalMessage('정보가 성공적으로 저장되었습니다.');
            setShowModal(true);
            setTimeout(() => {
                setShowModal(false);
                navigate('/mypage');
            }, 3000);
        })
        .catch(error => {
            console.error("정보를 저장하는데 실패했습니다.", error);
            setModalMessage('정보 저장에 실패했습니다. 다시 시도해주세요.');
            setShowModal(true);
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
                <Header>
                    <ImageButton>
                        <ButtonImage src={`${process.env.PUBLIC_URL}/edit.png`} alt="회원 정보 수정" />
                        <ButtonLabel>회원 정보 수정</ButtonLabel>
                    </ImageButton>
                </Header>

                <Form>
                    <Label>이름</Label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <Label>이메일</Label>
                    <Input
                        type="email"
                        value={email}
                        readOnly
                    />
                    <Hint>*이메일은 수정이 불가합니다.</Hint>

                    <Label>닉네임</Label>
                    <Input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                    />

                    <Label>전화번호</Label>
                    <Input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />

                    <SaveButton onClick={handleSave}>저장하기</SaveButton>
                </Form>

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
    padding: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    position: relative;
    z-index: 1;
`;

const Header = styled.div`
    width: 40%;
    text-align: center;
    margin-top: 10%;
`;

const ImageButton = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #BEDC74;
    padding: 20px;
    border-radius: 15px;
    aspect-ratio: 1;
`;

const ButtonImage = styled.img`
    width: 50px;
    height: 50px;
`;

const ButtonLabel = styled.span`
    font-size: 16px;
    color: #333;
    margin-top: 10px;
`;

const Form = styled.div`
    width: 90%;
    margin-top: auto;
    margin-bottom: auto;
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

const Hint = styled.p`
    font-size: 12px;
    color: #666;
    margin-top: -10px;
    margin-bottom: 20px;
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

export default Edit;
