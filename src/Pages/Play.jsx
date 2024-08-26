/*global kakao*/
import React, { useEffect, useCallback, useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from 'react-router-dom';
import api from './Api';

const Play = () => {
    const { questId } = useParams();
    const navigate = useNavigate();
    const [mapInstance, setMapInstance] = useState(null);
    const [marker, setMarker] = useState(null);
    const [circle, setCircle] = useState(null);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [currentStage, setCurrentStage] = useState(null);
    const [quizAnswer, setQuizAnswer] = useState('');
    const [questClearedCount, setQuestClearedCount] = useState(0);
    const [showClearModal, setShowClearModal] = useState(false);
    const [showStarModal, setShowStarModal] = useState(false);

    const loadStages = useCallback((questId, mapInstance) => {
        api.get(`/api/play/${questId}/points`)
            .then(response => {
                const stages = response.data;
                displayStagesOnMap(stages, mapInstance);
            })
            .catch(error => {
                console.error("스테이지를 불러오는데 실패했습니다.", error);
            });
    }, []);

    useEffect(() => {
        const loadMap = () => {
            kakao.maps.load(() => {
                const container = document.getElementById("Mymap");
                const options = {
                    center: new kakao.maps.LatLng(35.1595454, 126.8526012),
                    level: 3,
                };
                const mapInstance = new kakao.maps.Map(container, options);
                setMapInstance(mapInstance);

                // 맵이 로드된 후에 위치 정보를 업데이트
                updateCurrentLocation(mapInstance);

                if (questId) {
                    loadStages(questId, mapInstance);
                }
            });
        };

        const script = document.createElement("script");
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false&libraries=services`;
        document.head.appendChild(script);

        script.onload = loadMap;

        return () => {
            document.head.removeChild(script);
        };
    }, [questId, loadStages]);


    // 현재 위치가 업데이트된 후에만 마커 클릭 이벤트를 허용
    useEffect(() => {
        if (currentPosition) {
            console.log("currentPosition이 설정되었습니다.", currentPosition);
            // 필요한 추가 작업을 여기서 수행할 수 있습니다.
        }
    }, [currentPosition]);

        

    const updateCurrentLocation = useCallback((mapInstance, retryCount = 5) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    
                    const locPosition = new kakao.maps.LatLng(lat, lng);
                    setCurrentPosition(locPosition); // 여기서 currentPosition을 업데이트
    
                    if (marker) {
                        marker.setPosition(locPosition);
                    } else {
                        const newMarker = new kakao.maps.Marker({
                            map: mapInstance,
                            position: locPosition,
                            zIndex: 100,
                        });
                        setMarker(newMarker);
                    }
    
                    if (circle) {
                        circle.setMap(null);
                    }
    
                    const newCircle = new kakao.maps.Circle({
                        center: locPosition,
                        radius: 50,
                        strokeWeight: 5,
                        strokeColor: '#004c80',
                        strokeOpacity: 0.7,
                        strokeStyle: 'solid',
                        fillColor: '#0066ff',
                        fillOpacity: 0.4,
                    });
    
                    newCircle.setMap(mapInstance);
                    setCircle(newCircle);
    
                    mapInstance.setCenter(locPosition);
                },
                (error) => {
                    console.error("Geolocation error:", error);
                    if (retryCount > 0) {
                        setTimeout(() => updateCurrentLocation(mapInstance, retryCount - 1), 3000);
                    } else {
                        alert('현재 위치를 가져올 수 없습니다. 기본 위치로 설정합니다.');
                        setFallbackLocation(mapInstance);
                    }
                },
                { timeout: 20000 }
            );
        } else {
            alert("지오로케이션이 지원되지 않는 브라우저입니다.");
            setFallbackLocation(mapInstance);
        }
    }, [marker, circle]);
    
    const setFallbackLocation = (mapInstance) => {
        const defaultPosition = new kakao.maps.LatLng(35.1595454, 126.8526012);
        setCurrentPosition(defaultPosition);

        const newMarker = new kakao.maps.Marker({
            map: mapInstance,
            position: defaultPosition,
            zIndex: 100,
        });
        setMarker(newMarker);

        const newCircle = new kakao.maps.Circle({
            center: defaultPosition,
            radius: 500,
            strokeWeight: 5,
            strokeColor: '#004c80',
            strokeOpacity: 0.7,
            strokeStyle: 'solid',
            fillColor: '#0066ff',
            fillOpacity: 0.4,
        });

        newCircle.setMap(mapInstance);
        setCircle(newCircle);

        mapInstance.setCenter(defaultPosition);
    };

    const displayStagesOnMap = (stages, mapInstance) => {
        const bounds = new kakao.maps.LatLngBounds();
        const linePath = [];

        stages.forEach((stage) => {
            if (isNaN(stage.lat) || isNaN(stage.lng)) {
                console.warn("유효하지 않은 좌표:", stage);
                return;
            }

            const position = new kakao.maps.LatLng(stage.lat, stage.lng);
            
            // 클리어된 스테이지는 treasure.png를, 그렇지 않은 스테이지는 monkey.png를 사용
            const imageSrc = stage.cleared
                ? `${process.env.PUBLIC_URL}/treasure.png`
                : `${process.env.PUBLIC_URL}/monkey${stage.sequenceNumber}.png`;
            
            const imageSize = new kakao.maps.Size(50, 50);
            const imageOption = { offset: new kakao.maps.Point(25, 25) };
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            // 마커 생성 및 맵에 추가
            const stageMarker = new kakao.maps.Marker({
                position,
                map: mapInstance,
                image: markerImage,
            });

            // 마커 클릭 이벤트 등록
            kakao.maps.event.addListener(stageMarker, 'click', () => handleMarkerClick(stage));

            linePath.push(position);
            bounds.extend(position);
        });

        if (linePath.length > 0) {
            mapInstance.setBounds(bounds);

            const polyline = new kakao.maps.Polyline({
                path: linePath,
                strokeWeight: 5,
                strokeColor: "#FF0000",
                strokeOpacity: 0.7,
                strokeStyle: "solid",
            });
            polyline.setMap(mapInstance);
        }
    };

    const handleMarkerClick = (stage) => {
        console.log("Marker clicked for stage:", stage);
    
        if (!currentPosition) {
            console.error("currentPosition is null when trying to handle marker click.");
            alert("현재 위치를 확인할 수 없습니다. 잠시 후 다시 시도해주세요.");
            return;
        }
    
        console.log("Current position at marker click:", currentPosition);
    
        const distance = calculateDistance(currentPosition, new kakao.maps.LatLng(stage.lat, stage.lng));
        if (distance > 50) {
            alert("아직 스테이지 근처에 위치하지 않았습니다.");
            return;
        }
    
        // 현재 위치와 함께 API 요청
        api.get(`/api/play/${questId}/${stage.userStageId}`, {
            params: {
                lat: currentPosition.getLat(),
                lng: currentPosition.getLng()
            }
        })
        .then(response => {
            console.log("API response:", response.data);
            setCurrentStage(response.data);
            setModalIsOpen(true);
        })
        .catch(error => {
            console.error("API call failed:", error);
            if (error.response && error.response.status === 403) {
                alert("아직 스테이지 근처에 위치하지 않았습니다.");
            } else {
                console.error("퀴즈를 불러오는데 실패했습니다.", error);
            }
        });
    };    
    
    const calculateDistance = (position1, position2) => {
        if (!position1 || !position2) {
            return Infinity;
        }

        const lat1 = position1.getLat();
        const lng1 = position1.getLng();
        const lat2 = position2.getLat();
        const lng2 = position2.getLng();

        const R = 6371e3; // 지구 반지름 (미터)
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lng2 - lng1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // in meters
        return distance;
    };

    const handleQuizSubmit = () => {
        api.post(`/api/play/${questId}/${currentStage.userStageId}`, { answer: quizAnswer })
            .then(response => {
                console.log(response.data); // 서버 응답을 확인하기 위해 콘솔에 출력
                if (response.data === "스테이지를 클리어했습니다!") {
                    alert("정답입니다! 스테이지를 클리어했습니다.");
                    setModalIsOpen(false); // 모달을 닫음
                    checkQuestCompletion(); // 퀘스트 클리어 여부 확인
                } else {
                    alert("틀렸습니다. 다시 풀어보세요.");
                    // 모달을 유지 (setModalIsOpen(false) 호출하지 않음)
                }
            })
            .catch(error => {
                console.error("퀴즈 제출에 실패했습니다.", error);
                alert("퀴즈 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
                // 서버 오류로 틀렸을 때에도 모달을 유지
            });
    };
    
    const checkQuestCompletion = () => {
        // 퀘스트의 모든 스테이지를 확인
        api.get(`/api/play/${questId}/points`)
            .then(response => {
                const stages = response.data;
    
                // 모든 스테이지의 cleared가 true인지 확인
                const allCleared = stages.every(stage => stage.cleared);
    
                if (allCleared) {
                    setShowClearModal(true); // 모든 스테이지가 클리어된 경우 클리어 모달을 표시
                } else {
                    // 다른 클리어된 스테이지 확인
                    api.get('/api/clear/quest-album/count')
                        .then(response => {
                            const clearedCount = response.data;
                            setQuestClearedCount(clearedCount);
                            if (clearedCount >= 1 && [1, 5, 10, 20, 30].includes(clearedCount)) { 
                                setShowStarModal(true);
                            }
                        })
                        .catch(error => {
                            console.error("클리어한 퀘스트 갯수를 가져오는데 실패했습니다.", error);
                        });
                }
            })
            .catch(error => {
                console.error("퀘스트 상태를 확인하는 중 오류가 발생했습니다.", error);
            });
    };    

    const handleEndPlay = () => {
        api.post(`/api/play/${questId}/end`)
            .then(() => {
                alert("플레이가 종료되었습니다.");
                setTimeout(() => {
                    navigate('/player'); // 3초 후 /player 페이지로 이동
                }, 3000); // 3000ms = 3초
            })
            .catch(error => {
                console.error("플레이 종료에 실패했습니다.", error);
            });
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
        } else {
            return `${process.env.PUBLIC_URL}/star1.png`;
        }
    };

    return (
        <Container>
            <BackgroundImageLeft />
            <BackgroundImageRight />
            <MapContainer>
                <MapContents id="Mymap"></MapContents>
                <RefreshButton onClick={() => updateCurrentLocation(mapInstance)}>
                    <RefreshIcon src={`${process.env.PUBLIC_URL}/refresh.png`} alt="Refresh" />
                </RefreshButton>
            </MapContainer>

            {modalIsOpen && (
                <CustomModal>
                    <ModalContent>
                        <ModalTitle>{currentStage?.stageName}</ModalTitle>
                        <ModalSection>
                            <ModalLabel>주소:</ModalLabel>
                            <ModalText>{currentStage?.stageAddress}</ModalText>
                        </ModalSection>
                        <ModalSection>
                            <ModalLabel>스토리:</ModalLabel>
                            <ModalText>{currentStage?.stageStory}</ModalText>
                        </ModalSection>
                        <ModalSection>
                            <ModalLabel>퀴즈:</ModalLabel>
                            <ModalText>Q. {currentStage?.quizContent}</ModalText>
                        </ModalSection>
                        <QuizOptions>
                            <QuizButton 
                                $active={quizAnswer === 'O'} 
                                onClick={() => setQuizAnswer('O')}
                            >
                                O
                            </QuizButton>
                            <QuizButton 
                                $active={quizAnswer === 'X'} 
                                onClick={() => setQuizAnswer('X')}
                            >
                                X
                            </QuizButton>
                        </QuizOptions>
                        <ModalButtons>
                            <ModalButton onClick={handleQuizSubmit}>완료</ModalButton>
                            <ModalButton onClick={() => setModalIsOpen(false)}>닫기</ModalButton>
                        </ModalButtons>
                    </ModalContent>
                </CustomModal>
            )}

            {showClearModal && (
                <CustomModal>
                    <ModalContent>
                        <ModalTitle>퀘스트 클리어!</ModalTitle>
                        <ModalSection>
                            <ModalText>
                                원숭이가 모험가에 한 단계 더 나아갔습니다!<br />
                                현재 클리어한 퀘스트의 수는 {questClearedCount}개입니다.
                            </ModalText>
                        </ModalSection>
                        <ModalButtons>
                            <ModalButton onClick={handleEndPlay}>완료</ModalButton>
                        </ModalButtons>
                    </ModalContent>
                </CustomModal>
            )}

            {showStarModal && (
                <CustomModal>
                    <ModalContent>
                        <ModalTitle>축하합니다!</ModalTitle>
                        <ModalSection>
                            <ModalText>
                                특정 갯수의 퀘스트를 클리어하여 특별한 별을 획득했습니다!
                            </ModalText>
                        </ModalSection>
                        <ModalSection>
                            <ModalImage src={getStarImage()} alt="Star" />
                        </ModalSection>
                        <ModalButtons>
                            <ModalButton onClick={handleEndPlay}>완료</ModalButton>
                        </ModalButtons>
                    </ModalContent>
                </CustomModal>
            )}

            <BottomBar>
                <BottomButton onClick={() => navigate('/player')}>
                    <ButtonImageBottom src={`${process.env.PUBLIC_URL}/search.png`} />
                    <ButtonLabelBottom>퀘스트 검색</ButtonLabelBottom>
                </BottomButton>
                <BottomButton onClick={() => navigate(`/play/${questId}`)}>
                    <ButtonImageBottom src={`${process.env.PUBLIC_URL}/play.png`} />
                    <ButtonLabelBottom>플레이</ButtonLabelBottom>
                </BottomButton>
                <BottomButton onClick={() => navigate('/mypage')}>
                    <ButtonImageBottom src={`${process.env.PUBLIC_URL}/mypage.png`} />
                    <ButtonLabelBottom>마이페이지</ButtonLabelBottom>
                </BottomButton>
                <BottomButton onClick={() => navigate('/select')}>
                    <ButtonImageBottom src={`${process.env.PUBLIC_URL}/mode.png`} />
                    <ButtonLabelBottom>모드선택</ButtonLabelBottom>
                </BottomButton>
            </BottomBar>
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

const MapContainer = styled.div`
    width: 375px;
    height: 100vh;
    background-color: #fef69b;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 1;
`;

const MapContents = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
`;

const RefreshButton = styled.button`
    position: absolute;
    bottom: 100px;
    left: 20px;
    background-color: #A2CA71;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.2);
    z-index: 1001;
`;

const RefreshIcon = styled.img`
    width: 24px;
    height: 24px;
`;

const CustomModal = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

const ModalContent = styled.div`
    background-color: #fff;
    padding: 20px;
    border-radius: 10px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.3);
`;

const ModalTitle = styled.h2`
    text-align: center;
    margin-bottom: 20px;
`;

const ModalSection = styled.div`
    margin-bottom: 15px;
    text-align: center;
`;

const ModalLabel = styled.p`
    font-weight: bold;
    margin-bottom: 5px;
`;

const ModalText = styled.p`
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    text-align: center;
`;

const QuizOptions = styled.div`
    display: flex;
    justify-content: space-around;
    margin: 20px 0;
`;

const QuizButton = styled.button`
    background-color: ${props => props.$active ? '#99cc66' : '#f0f0f0'};
    color: ${props => props.$active ? '#fff' : '#333'};
    padding: 10px 20px;
    font-size: 18px;
    border: 1px solid #A2CA71;
    border-radius: 5px;
    cursor: pointer;
    width: 100px;

    &:hover {
        background-color: #88bb55;
        color: white;
    }
`;

const ModalButtons = styled.div`
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
`;

const ModalButton = styled.button`
    background-color: #99cc66;
    border: none;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    width: 100px;

    &:hover {
        background-color: #88bb55;
    }
`;

const ModalImage = styled.img`
    width: 100px;
    height: 100px;
    margin: 0 auto;
    display: flex;
    justify-content: center;
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
    z-index: 1000;
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

export default Play;
