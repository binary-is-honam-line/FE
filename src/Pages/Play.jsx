/*global kakao*/
import React, { useEffect, useCallback } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from 'react-router-dom';
import api from './Api';

const Play = () => {
    const { questId } = useParams();
    const navigate = useNavigate();

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
        // Kakao 지도 API를 로드합니다.
        const script = document.createElement("script");
        script.async = true;
        script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false&libraries=services`;
        document.head.appendChild(script);

        script.onload = () => {
            kakao.maps.load(() => {
                const container = document.getElementById("Mymap");
                const options = {
                center: new kakao.maps.LatLng(35.1595454, 126.8526012), // 기본 위치 설정
                level: 3,
                };
                const mapInstance = new kakao.maps.Map(container, options);

                // 퀘스트 스테이지를 불러옵니다.
                if (questId) {
                loadStages(questId, mapInstance);
                }
            });
        };

        return () => {
            document.head.removeChild(script);
        };
    }, [questId, loadStages]);

    const displayStagesOnMap = (stages, mapInstance) => {
        const bounds = new kakao.maps.LatLngBounds();
        const linePath = [];

        stages.forEach((stage) => {
            if (isNaN(stage.lat) || isNaN(stage.lng)) {
                console.warn("유효하지 않은 좌표:", stage);
                return;
            }

            const position = new kakao.maps.LatLng(stage.lat, stage.lng);
            const imageSrc = `${process.env.PUBLIC_URL}/monkey${stage.sequenceNumber}.png`; // 이미지 경로 설정
            const imageSize = new kakao.maps.Size(50, 50);
            const imageOption = { offset: new kakao.maps.Point(25, 25) }; // 마커의 기준점을 이미지의 중심으로 설정
            const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

            new kakao.maps.Marker({
                position,
                map: mapInstance,
                image: markerImage,
            });

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

    return (
        <Container>
            <BackgroundImageLeft />
            <BackgroundImageRight />
            <MapContainer>
                <MapContents id="Mymap"></MapContents>
            </MapContainer>

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
