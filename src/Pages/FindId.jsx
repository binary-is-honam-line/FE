import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const logoImage = `${process.env.PUBLIC_URL}/monkeys.png`;

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    position: relative;
    background-color: #F6E96B;
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
    min-height: 100vh;
    background-color: #A2CA71;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 1;
    overflow-y: auto;
`;

const Header = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    top: 20px;
    left: 20px;
`;

const BackButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 18px;
    color: #387F39;
    font-weight: bold;
    padding: 10px;
    border-radius: 10px;

    &:hover {
        background-color: #81B265;
        color: #FFFFFF;
    }
`;

const Logo = styled.img`
    width: 150px;
    margin-bottom: 20px;
`;

const Input = styled.input`
    width: 80%;
    padding: 15px;
    margin-bottom: 15px;
    border: 1px solid #DEDEDE;
    border-radius: 5px;
    font-size: 20px;
`;

const FindIdButton = styled.button`
    background-color: #387F39;
    color: white;
    border: none;
    padding: 15px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 20px;
    width: 80%;
    margin-bottom: 20px;

    &:hover {
        color: black;
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
    max-width: 300px;
`;

const ModalText = styled.p`
    font-size: 20px;
    margin-bottom: 10px;
`;

const ModalButton = styled.button`
    background-color: #387F39;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 25px;
    margin-top: 20px;

    &:hover {
        color: black;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin-top: 10px;
`;

const FindId = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [userName, setUserName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [foundId, setFoundId] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            navigate('/select');
        }
    }, [navigate]);

    const handleFindIdClick = async () => {
        try {
            const response = await api.get('/api/user/find-email', {
                params: {
                    name: userName,
                    phone: phoneNumber,
                },
            });
            const data = response.data;
            if (response.status === 200 && data.email) {
                setFoundId(data.email);
                setModalOpen(true);
            } else {
                setErrorMessage('아이디를 찾을 수 없습니다.');
            }
        } catch (error) {
            console.error('API 호출 중 오류가 발생했습니다.', error);
            setErrorMessage('API 호출 중 오류가 발생했습니다.');
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleLoginButtonClick = () => {
        navigate('/login');
        closeModal();
    };

    return (
        <Container>
            <BackgroundImageLeft />
            <BackgroundImageRight />
            <AppWrapper>
                <Header>
                    <BackButton onClick={() => navigate(-1)}>←</BackButton>
                </Header>
                <Logo src={logoImage} alt="Logo" />
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
                {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}

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
