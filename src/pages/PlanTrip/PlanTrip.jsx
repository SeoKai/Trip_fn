import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import { useLocation } from "react-router-dom";
import styles from "./PlanTrip.module.scss";

function PlanTrip() {
  // Google Maps API 로드
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCShblMMYThZxLOVypghTgG7XRwFpCL7RI", // 여기에 Google Maps API 키 입력
  });

  // 상태 변수
  const [allPlaces, setAllPlaces] = useState([]); // 전체 장소 목록
  const [center, setCenter] = useState({ lat: 35.6895, lng: 139.6917 }); // 지도 중심
  const [selectedPlace, setSelectedPlace] = useState(null); // 모달에 표시할 선택된 장소
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태
  const [dailyPlans, setDailyPlans] = useState({}); // 날짜별 장소 상태
  const location = useLocation();
  const { regionId, cityName, startDate, endDate } = location.state;

  // 출발일과 도착일 기준으로 날짜 생성
  useEffect(() => {
    if (startDate && endDate) {
      const dates = generateDatesBetween(startDate, endDate);
      const initialDailyPlans = {};
      dates.forEach((date) => (initialDailyPlans[date] = []));
      setDailyPlans(initialDailyPlans);
    }
  }, [startDate, endDate]);

  const generateDatesBetween = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      dates.push(new Date(currentDate).toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  };

  // 백엔드에서 장소 불러오기
  useEffect(() => {
    if (regionId) {
      axios
        .get("http://localhost:5050/api/locations/by-region", {
          params: { regionId: regionId },
        })
        .then((response) => setAllPlaces(response.data))
        .catch((error) => console.error("장소 데이터 오류:", error));
    }
  }, [regionId]);

  // 날짜별 장소 추가 핸들러
  const handleAddPlace = (date, place) => {
    setDailyPlans((prev) => ({
      ...prev,
      [date]: [...(prev[date] || []), place],
    }));
    setCenter({ lat: place.latitude, lng: place.longitude });
  };

  // 날짜별 장소 삭제 핸들러
  const handleRemovePlace = (date, locationId) => {
    setDailyPlans((prev) => ({
      ...prev,
      [date]: prev[date].filter((p) => p.locationId !== locationId),
    }));
  };

  // 마커 클릭 (모달 열기)
  const handleMarkerClick = (place) => {
    setSelectedPlace(place);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlace(null);
  };

  // 플랜 저장 핸들러
  const handleSavePlan = async () => {
    const plannerData = {
      plannerTitle: `${cityName} 여행 계획`,
      plannerStartDate: startDate,
      plannerEndDate: endDate,
      regionName: cityName,
      dailyPlans: Object.entries(dailyPlans).map(([date, places]) => ({
        planDate: date,
        toDos: places.map((place) => ({
          locationId: place.locationId,
          locationName: place.locationName,
          formattedAddress: place.formattedAddress,
          latitude: place.latitude,
          longitude: place.longitude,
        })),
      })),
    };

    try {
      const response = await axios.post(
        "http://localhost:5050/api/planner/save",
        plannerData
      );
      alert("플랜이 성공적으로 저장되었습니다!");
      console.log(response.data);
    } catch (error) {
      console.error("플랜 저장 실패:", error);
      alert("플랜 저장 중 오류가 발생했습니다.");
    }
  };

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className={styles.planTripContainer}>
      {/* 메인 콘텐츠 */}
      <div className={styles.mainContent}>
        {/* 좌측: 장소 목록 */}
        <div className={styles.placeList}>
          <div className={styles.header}>
            <h2>{cityName}</h2>
            <p>
              {startDate} ~ {endDate}
            </p>
          </div>

          <h2>장소 목록</h2>
          <ul>
            {allPlaces.map((place) => (
              <li key={place.locationId} className={styles.placeItem}>
                <img
                  src={place.placeImgUrl || "/images/placeholder.jpg"}
                  alt={place.locationName}
                  className={styles.placeImage}
                />
                <span>{place.locationName}</span>
                {/* 날짜 선택 드롭다운 */}
                <select
                  onChange={(e) => handleAddPlace(e.target.value, place)}
                  defaultValue=""
                  className={styles.dateSelect}
                >
                  <option value="" disabled>
                    날짜 선택
                  </option>
                  {Object.keys(dailyPlans).map((date) => (
                    <option key={date} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </li>
            ))}
          </ul>
        </div>

        {/* 중앙: 날짜별 선택된 장소 */}
        <div className={styles.selectedList}>
          <h2>날짜별 선택된 장소</h2>
          {Object.entries(dailyPlans).map(([date, places], index) => (
            <div key={date} className={styles.dailyPlanContainer}>
              <h3>
                Day {index + 1} ({date})
              </h3>
              <div className={styles.selectedPlaces}>
                {places.length > 0 ? (
                  places.map((place) => (
                    <div
                      key={place.locationId}
                      className={styles.selectedPlaceCard}
                    >
                      <img
                        src={place.placeImgUrl}
                        alt={place.locationName}
                        className={styles.smallImage}
                      />
                      <span>{place.locationName}</span>
                      <button
                        onClick={() =>
                          handleRemovePlace(date, place.locationId)
                        }
                        className={styles.deleteButton}
                      >
                        🗑
                      </button>
                    </div>
                  ))
                ) : (
                  <p>아직 장소가 추가되지 않았습니다.</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* 우측: 지도 */}
        <div className={styles.mapContainer}>
          <GoogleMap
            mapContainerClassName={styles.mapContainer}
            center={center}
            zoom={12}
          >
            {Object.values(dailyPlans)
              .flat()
              .map((place) => (
                <Marker
                  key={place.locationId}
                  position={{ lat: place.latitude, lng: place.longitude }}
                  onClick={() => handleMarkerClick(place)}
                />
              ))}
          </GoogleMap>
        </div>
        <button onClick={handleSavePlan} className={styles.saveButton}>
          플랜 저장
        </button>
      </div>

      {/* 모달 */}
      {isModalOpen && selectedPlace && (
        <div className={styles.modalOverlay} onClick={handleCloseModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeButton} onClick={handleCloseModal}>
              &times;
            </button>
            <h2>{selectedPlace.locationName}</h2>
            <img
              src={selectedPlace.placeImgUrl}
              alt={selectedPlace.locationName}
              className={styles.modalImage}
            />
            <p>
              <strong>주소:</strong> {selectedPlace.formattedAddress}
            </p>
            <p>
              <strong>평점:</strong> ⭐ {selectedPlace.googleRating}
            </p>
            <p>
              <strong>전화번호:</strong> {selectedPlace.phoneNumber}
            </p>
            <p>
              <strong>영업시간:</strong> {selectedPlace.openingHours}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlanTrip;
