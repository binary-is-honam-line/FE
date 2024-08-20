import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import api from './Api';

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
    margin-top: 30%;
    margin-bottom: 10%;
`;

const Input = styled.input`
    width: 80%;
    padding: 15px;
    margin-bottom: 5%;
    border: 1px solid #00D065;
    border-radius: 5px;
    font-size: 20px;
`;

const SignupButton = styled.button`
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

const Footer = styled.div`
    position: absolute;
    bottom: 5%;
    left: 20px;
    display: flex;
    align-items: center;
    font-size: 14px;
`;

const FooterText = styled.span`
    margin-left: 5px;
`;

const QuestionMark = styled.div`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #00D065;
    color: #FEFEFE;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
`;

const LoginLink = styled.a`
    cursor: pointer;
    text-decoration: underline;
    color: #00D065;
    &:hover {
        text-decoration: underline;
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

const ErrorMessage = styled.p`
    color: red;
    font-size: 14px;
    margin-top: 10px;
`;

const Signup = () => {
    const navigate = useNavigate();
    const [modalOpen, setModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [passwordChk, setPasswordChk] = useState('');
    const [nickname, setNickname] = useState('');
    const [error, setError] = useState('');

    const handleSignupClick = async () => {
        if (!name || !email || !phone || !password || !passwordChk || !nickname) {
            setError('모든 필드를 입력해주세요.');
            return;
        }

        if (password !== passwordChk) {
            setError('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await api.post('/join', {
                email,
                password,
                passwordCheck: passwordChk,
                name,
                nickname,
                phone,
            });

            console.log('회원가입 성공:', response.data);
            setModalOpen(true); // 회원가입 성공 시 모달 열기
        } catch (error) {
            console.error('회원가입 에러:', error);
            setError('회원가입 중 오류가 발생했습니다.');
        }
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const handleLoginClick = () => {
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
                    type="tel" 
                    placeholder="전화번호" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                />
                <Input 
                    type="password" 
                    placeholder="비밀번호" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <Input 
                    type="password" 
                    placeholder="비밀번호 재입력" 
                    value={passwordChk} 
                    onChange={(e) => setPasswordChk(e.target.value)} 
                />
                <Input 
                    type="text" 
                    placeholder="닉네임" 
                    value={nickname} 
                    onChange={(e) => setNickname(e.target.value)} 
                />
                <SignupButton onClick={handleSignupClick}>가입하기</SignupButton>
                {error && <ErrorMessage>{error}</ErrorMessage>}
                <Footer>
                    <QuestionMark>?</QuestionMark>
                    <span>이미 계정이 있으신가요?</span>
                    <FooterText></FooterText>
                    <LoginLink onClick={() => navigate('/login')}>로그인</LoginLink>
                </Footer>
            </AppWrapper>

            {modalOpen && (
                <ModalBackdrop>
                    <ModalContent>
                        <ModalText>회원가입에 성공했습니다!</ModalText>
                        <ModalButton onClick={handleLoginClick}>로그인하기</ModalButton>
                    </ModalContent>
                </ModalBackdrop>
            )}
        </Container>
    );
};

export default Signup;
