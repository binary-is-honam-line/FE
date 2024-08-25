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
    min-height: 100vh;
    background-color: #A2CA71;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    z-index: 1;
    overflow-y: auto; /* 스크롤 가능하도록 설정 */
`;

const Logo = styled.img`
    width: 200px;
    margin-top: 10%;
    margin-bottom: 5%;
`;

const Input = styled.input`
    width: 80%;
    padding: 15px;
    margin-bottom: 5%;
    border: 1px solid #DEDEDE;
    border-radius: 5px;
    font-size: 20px;
`;

const SignupButton = styled.button`
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

const Footer = styled.div`
    position: absolute;
    bottom: 3%;
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
    background-color: #387F39;
    color: #FEFEFE;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
`;

const LoginLink = styled.a`
    cursor: pointer;
    text-decoration: underline;
    color: white;

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
    max-width: 300px;
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

    useEffect(() => {        
        // 페이지 로드 시 세션을 확인하여 이미 로그인된 상태라면 선택모드로 리다이렉트
        const user = sessionStorage.getItem('user');
        if (user) {
            navigate('/select');
        }
    }, [navigate]);

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
            setModalOpen(true);
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
            <BackgroundImageLeft />
            <BackgroundImageRight />
            <AppWrapper>
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
