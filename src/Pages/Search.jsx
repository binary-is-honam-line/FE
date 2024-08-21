/*global kakao*/
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from 'react-router-dom';
import api from './Api';

const Search = () => {
  const [map, setMap] = useState(null);
  const [keyword, setKeyword] = useState("");
  const [markers, setMarkers] = useState([]);
  const [registeredPlaces, setRegisteredPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { questId } = useParams();
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
          center: new kakao.maps.LatLng(35.1595454, 126.8526012), 
          level: 3,
        };
        const mapInstance = new kakao.maps.Map(container, options);
        setMap(mapInstance);

        if (questId) {
          loadStages(questId, mapInstance);
        }
      });
    };

    script.onerror = () => {
      console.error("Kakao Maps 스크립트를 로드하지 못했습니다.");
    };
  }, [questId]);

  const loadStages = (questId, mapInstance) => {
    api.get(`/api/stages/${questId}`)
      .then(response => {
        const stages = response.data;
        setRegisteredPlaces(stages);

        const fetchPoints = stages.map(stage =>
          api.get(`/api/stages/${questId}/points`)
            .then(response => response.data)
        );

        return Promise.all(fetchPoints);
      })
      .then(points => {
        displayStagesOnMap(points.flat(), mapInstance);
      })
      .catch(error => {
        console.error("스테이지를 불러오는데 실패했습니다.", error);
      });
  };

  const displayStagesOnMap = (points, mapInstance) => {
    const bounds = new kakao.maps.LatLngBounds();
    const newMarkers = [];
    const linePath = [];

    points.forEach((point) => {
        if (isNaN(point.lat) || isNaN(point.lng)) {
            console.warn("Invalid coordinates:", point);
            return;
        }

        const position = new kakao.maps.LatLng(point.lat, point.lng);
        const imageSrc = `${process.env.PUBLIC_URL}/monkey${point.sequenceNumber}.png`;
        const imageSize = new kakao.maps.Size(50, 50);
        const imageOption = { offset: new kakao.maps.Point(15, 15) };
        const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);

        const marker = new kakao.maps.Marker({
            position,
            map: mapInstance,
            image: markerImage,
        });

        linePath.push(position);
        bounds.extend(position);
        newMarkers.push(marker);
    });

    if (linePath.length > 0) {
        setMarkers(newMarkers);
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
        (registered) => registered.stageName === place.place_name
      );
      const marker = createMarker(position, place, registeredPlace);
      bounds.extend(position);
      newMarkers.push(marker);
    });

    setMarkers(newMarkers);
    map.setBounds(bounds);
  };

  const createMarker = (position, place, registeredPlace) => {
    let imageSrc = `${process.env.PUBLIC_URL}/monkeys.png`;

    if (registeredPlace) {
      const index = registeredPlaces.indexOf(registeredPlace) + 1;
      imageSrc = `${process.env.PUBLIC_URL}/monkey${index}.png`;
    }

    const imageSize = new kakao.maps.Size(50, 50);
    const imageOption = { offset: new kakao.maps.Point(15, 15) };
    
    const markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imageOption);
  
    const marker = new kakao.maps.Marker({
      position,
      map: map,
      image: markerImage,
    });
  
    kakao.maps.event.addListener(marker, "click", () => {
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

    const stageData = {
      stageName: selectedPlace.place_name,
      stageAddress: selectedPlace.address_name || selectedPlace.road_address_name,
      lat: selectedPlace.y,
      lng: selectedPlace.x,
      stageDes: "등록된 스테이지입니다."
    };

    // 스테이지 추가 API 호출
    api.post(`/api/stages/${questId}/create`, null, {
      params: stageData,
    })
      .then(() => {
        alert("스테이지가 성공적으로 등록되었습니다.");
        window.location.reload();
      })
      .catch(error => {
        console.error("스테이지 등록에 실패했습니다.", error);
        alert("스테이지 등록에 실패했습니다.");
      });
  };

  return (
    <Container>
      <BackgroundImageLeft />
      <BackgroundImageRight />
      <MapContainer>
        <SearchBarWrapper>
          <SearchInput
            type="text"
            placeholder="스테이지 키워드 검색"
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
          <BottomButton onClick={() => navigate(`/search/${questId}`)}>
            <ButtonImage
              src={`${process.env.PUBLIC_URL}/search.png`}
              alt="Search"
            />
            <ButtonLabel>스테이지 검색</ButtonLabel>
          </BottomButton>
          <BottomButton onClick={() => navigate(`/list/${questId}`)}>
            <ButtonImage
              src={`${process.env.PUBLIC_URL}/list.png`}
              alt="List"
            />
            <ButtonLabel>스테이지 목록</ButtonLabel>
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

const SearchBarWrapper = styled.div`
  position: absolute;
  top: 20px;
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
