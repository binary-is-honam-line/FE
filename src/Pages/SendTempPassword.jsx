import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from './Api';

const logoImage = `${process.env.PUBLIC_URL}/monkeys.png`;

const SendTempPassword = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [tempPassword, setTempPassword] = useState('');

    useEffect(() => {
        const user = sessionStorage.getItem('user');
        if (user) {
            navigate('/select');
        }
    }, [navigate]);

    const handleSendTempPasswordClick = async () => {
        try {
            const response = await api.post('/api/user/temp-password', null, {
                params: {
                    name: name,
                    email: email,
                    phone: phone,
                },
            });

            const { data } = response;
            if (response.status === 200 && data) {
                setTempPassword(data);
                setModalOpen(true);
            } else {
                alert('임시 비밀번호를 생성하는데 실패했습니다.');
            }
        } catch (error) {
            console.error('임시 비밀번호 생성 실패:', error);
            alert('임시 비밀번호 생성에 실패했습니다.');
        }
    };

    const closeModal = () => {
        setModalOpen(false);
        setTempPassword('');
        setName('');
        setEmail('');
        setPhone('');
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
                    <BackButton onClick={() => navigate(-1)}>뒤로가기</BackButton>
                </Header>
                <Logo src={logoImage} alt="Logo" />
                <Input
                    type="text"
                    placeholder="이름"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <Input
                    type="email"
                    placeholder="이메일"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    type="text"
                    placeholder="전화번호"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <SendTempPasswordButton onClick={handleSendTempPasswordClick}>임시 비밀번호 생성</SendTempPasswordButton>

                {modalOpen && (
                    <ModalBackdrop>
                        <ModalContent>
                            {tempPassword ? (
                                <>
                                    <ModalText>{`${tempPassword}`}</ModalText>
                                    <ModalButton onClick={handleLoginButtonClick}>로그인하기</ModalButton>
                                </>
                            ) : (
                                <ModalText>임시 비밀번호 생성에 실패했습니다.</ModalText>
                            )}
                        </ModalContent>
                    </ModalBackdrop>
                )}
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
    background-color: #A2CA71;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
`;

const Header = styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: absolute;
    top: 30px;
    left: 20px;
`;

const BackButton = styled.button`
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 15px;
    color: #333;
    font-weight: bold;

    &:hover {
        color: #000;
    }
`;

const Logo = styled.img`
    width: 200px;
    margin-top: 60%;
    margin-bottom: 20%;
`;

const Input = styled.input`
    width: 80%;
    padding: 15px;
    margin-bottom: 5%;
    border: 1px solid #DEDEDE;
    border-radius: 5px;
    font-size: 20px;
`;

const SendTempPasswordButton = styled.button`
    background-color: #387F39;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-size: 35px;
    width: 90%;
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

export default SendTempPassword;
