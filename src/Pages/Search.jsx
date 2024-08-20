/*global kakao*/
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const [map, setMap] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useState([]);
  const [registeredPlaces, setRegisteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [routes, setRoutes] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.async = true;
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_API_KEY}&autoload=false&libraries=services`;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        if (!kakao.maps.services) {
          console.error("Kakao Maps services 객체를 사용할 수 없습니다.");
          return;
        }

        const container = document.getElementById("Mymap");
        const options = {
          center: new kakao.maps.LatLng(35.1595454, 126.8526012), // 광주광역시청으로 기본 위치 설정
          level: 3,
        };
        const mapInstance = new kakao.maps.Map(container, options);
        setMap(mapInstance);
      });
    };

    script.onerror = () => {
      console.error("Kakao Maps 스크립트를 로드하지 못했습니다.");
    };
  }, []);

  const searchPlaces = () => {
    if (!keyword.trim()) {
      alert("키워드를 입력해주세요!");
      return;
    }

    if (map && kakao.maps.services) {
      const ps = new kakao.maps.services.Places();
      ps.keywordSearch(keyword, placesSearchCB);
    } else {
      console.error("Kakao Maps services 객체가 사용 불가능합니다.");
    }
  };

  const placesSearchCB = (data, status) => {
    if (status === kakao.maps.services.Status.OK) {
      displayPlaces(data);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
      alert("검색 결과가 존재하지 않습니다.");
    } else if (status === kakao.maps.services.Status.ERROR) {
      alert("검색 결과 중 오류가 발생했습니다.");
    }
  };

  const displayPlaces = (places) => {
    removeTempMarkers();
    const bounds = new kakao.maps.LatLngBounds();
    const newMarkers = [];

    places.forEach((place) => {
      const position = new kakao.maps.LatLng(place.y, place.x);
      const registeredPlace = registeredPlaces.find(
        (registered) => registered.place_name === place.place_name
      );
      const marker = createMarker(position, place, registeredPlace);
      bounds.extend(position);
      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
    map.setBounds(bounds);
  };

  const createMarker = (position, place, registeredPlace) => {
    let imageSrc = `${process.env.PUBLIC_URL}/monkeys.png`; // 기본 마커 이미지의 주소

    if (registeredPlace) {
      const index = registeredPlaces.indexOf(registeredPlace) + 1;
      imageSrc = `${process.env.PUBLIC_URL}/monkey${index}.png`; // 등록된 마커 이미지의 주소
    }

    const imageSize = new kakao.maps.Size(50, 50); // 마커 이미지의 크기
    const imageOption = { offset: new kakao.maps.Point(15, 15) }; // 마커 이미지의 좌표에 일치시킬 좌표 (이미지의 중앙)
    
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption); // 마커 이미지를 생성
  
    const marker = new kakao.maps.Marker({
      position,
      map: map,
      image: markerImage, // 생성한 마커 이미지를 설정
    });
  
    kakao.maps.event.addListener(marker, "click", () => {
      console.log("Marker clicked:", place); // 마커 클릭 시 콘솔에 출력
      setSelectedPlace(place);
      setIsModalOpen(true);
    });
  
    return marker;
  };
  
  const removeTempMarkers = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleRegister = () => {
    if (!selectedPlace) return;

    // 새로운 마커를 지도에 추가 (이전 마커들은 유지)
    setRoutes((prevRoutes) => {
      const newRoutes = [...prevRoutes, selectedPlace];
      
      const linePath = newRoutes.map(
        (route) => new kakao.maps.LatLng(route.y, route.x)
      );
      
      const markerIndex = newRoutes.length;
      const imageSrc = `${process.env.PUBLIC_URL}/monkey${markerIndex}.png`; // 각 마커 인덱스에 해당하는 이미지 파일 경로
      const imageSize = new kakao.maps.Size(50, 50); // 마커 이미지의 크기
      const imageOption = { offset: new kakao.maps.Point(15, 15) }; // 마커 이미지의 좌표에 일치시킬 좌표 (이미지의 중앙)
      const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
      
      const marker = new kakao.maps.Marker({
        map: map,
        position: new kakao.maps.LatLng(selectedPlace.y, selectedPlace.x),
        image: markerImage,
      });

      // 새로 추가된 마커를 포함해 모든 마커들을 저장
      setMarkers(prevMarkers => [...prevMarkers, marker]);

      // 등록된 장소를 저장
      setRegisteredPlaces(prevPlaces => [...prevPlaces, selectedPlace]);

      // 경로를 직선으로 연결
      const polyline = new kakao.maps.Polyline({
        path: linePath,
        strokeWeight: 5,
        strokeColor: "#FF0000",
        strokeOpacity: 0.7,
        strokeStyle: "solid",
      });
      polyline.setMap(map);

      return newRoutes;
    });

    closeModal();
  };

  return (
    <Container>
      <MapContainer>
        <SearchBarWrapper>
          <SearchInput
            type="text"
            placeholder="장소 키워드 검색"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <SearchButton onClick={searchPlaces}>
            <SearchIcon
              src={`${process.env.PUBLIC_URL}/search.png`}
              alt="Search"
            />
          </SearchButton>
        </SearchBarWrapper>
        <MapContents id="Mymap"></MapContents>

        <BottomBar>
          <BottomButton onClick={() => navigate('/search')}>
            <ButtonImage
              src={`${process.env.PUBLIC_URL}/search.png`}
              alt="Search"
            />
            <ButtonLabel>장소 검색</ButtonLabel>
          </BottomButton>
          <BottomButton onClick={() => navigate('/list')}>
            <ButtonImage
              src={`${process.env.PUBLIC_URL}/list.png`}
              alt="List"
            />
            <ButtonLabel>장소 목록</ButtonLabel>
          </BottomButton>
          <BottomButton onClick={() => navigate('/ai')}>
            <ButtonImage src={`${process.env.PUBLIC_URL}/ai.png`} alt="AI Story" />
            <ButtonLabel>AI 스토리</ButtonLabel>
            <ButtonLabel>작가</ButtonLabel>
          </BottomButton>
        </BottomBar>

        {isModalOpen && selectedPlace && (
          <ModalBackdrop>
            <ModalContent>
              <ModalTitle>장소 등록</ModalTitle>
              <ModalText>이름: {selectedPlace?.place_name}</ModalText>
              <ModalText>주소: {selectedPlace?.address_name || selectedPlace?.road_address_name}</ModalText>
              <ModalLabel>설명:</ModalLabel>
              <ModalTextarea placeholder="장소에 대한 설명을 입력하세요." />
              <ModalButtons>
                <ModalButton onClick={closeModal}>닫기</ModalButton>
                <ModalButton $primary onClick={handleRegister}>등록</ModalButton>
              </ModalButtons>
            </ModalContent>
          </ModalBackdrop>
        )}
      </MapContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #F6E96B;
`;

const MapContainer = styled.div`
  width: 375px;
  height: 100vh;
  background-color: #fef69b;
  display: flex;
  flex-direction: column;
  position: relative;
`;

const SearchBarWrapper = styled.div`
  position: absolute;
  top: 20px;;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 50px;
  z-index: 10;
  display: flex;
  justify-content: space-between;
  border-radius: 15px;
  overflow: hidden;
  border: 2px solid #A2CA71;
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 10px;
  border: none;
  outline: none;
`;

const SearchButton = styled.button`
  padding: 0 20px;
  background-color: #A2CA71;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    background-color: #81B265;
  }
`;

const SearchIcon = styled.img`
  width: 24px;
  height: 24px;
  filter: brightness(0) invert(1);
`;


const MapContents = styled.div`
  width: 100%;
  height: calc(100vh - 80px);
  position: absolute;
  top: 0;
  left: 0;
`;

const BottomBar = styled.div`
  width: 100%;
  height: 80px;
  position: absolute;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: #A2CA71;
  box-shadow: 0 -2px 5px rgba(0, 0, 0, 0.1);
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
    color: #ff6f61;
  }
`;

const ButtonImage = styled.img`
  width: 24px;
  height: 24px;
  margin-bottom: 5px;
`;

const ButtonLabel = styled.div`
  font-size: 12px;
  text-align: center;
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
  background-color: #BEDC74;
  padding: 20px;
  border-radius: 10px;
  width: 80%;
  max-width: 300px;
  text-align: left;
`;

const ModalTitle = styled.h2`
  font-size: 24px;
  text-align: center;
  margin-bottom: 20px;
`;

const ModalText = styled.p`
  font-size: 18px;
  margin-bottom: 10px;
`;

const ModalLabel = styled.label`
  font-size: 18px;
  margin-bottom: 5px;
  display: block;
`;

const ModalTextarea = styled.textarea`
  width: 90%;
  height: 60px;
  padding: 10px;
  border-radius: 5px;
  border: none;
  resize: none;
  margin-bottom: 20px;
`;

const ModalButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const ModalButton = styled.button`
  padding: 10px 20px;
  border-radius: 5px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  &:hover {
    text-decoration: underline;
  }
`;

export default Search;
