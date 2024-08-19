import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

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

const Logo = styled.div`
    font-size: 50px;
    font-weight: bold;
    margin-top: 50%;
    margin-bottom: 20%;
`;

const Input = styled.input`
    width: 80%;
    padding: 15px;
    margin-bottom: 5%;
    border: 1px solid #00D065;
    border-radius: 5px;
    font-size: 20px;
`;

const FindIdButton = styled.button`
    background-color: #FFD8E1;
    color: black;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 35px;
    width: 90%;
    margin-bottom: 20px;
    &:hover {
        color: #FF86FF;
    }
`;

const ModalBackdrop = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: #FEFEFE;
    padding: 20px;
    border-radius: 5px;
    text-align: center;
    width: 80%;
    max-width: 300px; /* 모달의 최대 너비 설정 */
`;

const ModalText = styled.p`
    font-size: 20px;
    margin-bottom: 10px;
`;

const ModalButton = styled.button`
    background-color: #FFD8E1;
    color: black;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 25px;
    margin-top: 20px;
    &:hover {
        color: #FF86FF;
    }
`;

const FindId = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [foundId, setFoundId] = useState('');

    const handleFindIdClick = async () => {
        try {
            // api 호출 예시
            const response = await fetch(`https://api.example.com/find-id?name=${userName}&phone=${phoneNumber}`);
            const data = await response.json();
            if (data.success) {
                setFoundId(data.id); // API에서 가져온 아이디 설정
                setModalOpen(true); // 모달 열기
            } else {
                // 에러 처리
                console.error('아이디를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('API 호출 중 오류가 발생했습니다.', error);
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleLoginButtonClick = () => {
        // 로그인 페이지로 이동
        navigate('/login');
        closeModal();
    };

    return (
        <Container>
            <AppWrapper>
                <Logo>Logo</Logo>
                <Input
                    type="text"
                    placeholder="이름"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="전화번호"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                />
                <FindIdButton onClick={handleFindIdClick}>아이디 찾기</FindIdButton>

                {modalOpen && (
                    <ModalBackdrop>
                        <ModalContent>
                            <ModalText>{userName}님의 아이디는</ModalText>
                            <ModalText>{foundId}</ModalText>
                            <ModalButton onClick={handleLoginButtonClick}>로그인하기</ModalButton>
                        </ModalContent>
                    </ModalBackdrop>
                )}
            </AppWrapper>
        </Container>
    );
};

export default FindId;