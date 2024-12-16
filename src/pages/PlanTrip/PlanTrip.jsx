import React, { useEffect, useState } from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import axios from "axios";
import { useLocation } from "react-router-dom";
import styles from "./PlanTrip.module.scss";

function PlanTrip() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: "AIzaSyCShblMMYThZxLOVypghTgG7XRwFpCL7RI",
  });

  const [allPlaces, setAllPlaces] = useState([]); // 전체 장소 데이터
  const [selectedPlaces, setSelectedPlaces] = useState([]); // 선택된 장소 목록
  const [center, setCenter] = useState({ lat: 35.6895, lng: 139.6917 }); // 지도 중심

  const location = useLocation();
  const city = location.state?.city;

  // 백엔드에서 장소 불러오기
  useEffect(() => {
    if (city) {
      axios
        .get("http://localhost:5050/api/locations/by-region", {
          params: { region: city },
        })
        .then((response) => {
          setAllPlaces(response.data);
        })
        .catch((error) => {
          console.error("데이터 불러오기 오류:", error);
        });
    }
  }, [city]);

  // 장소 추가 핸들러
  const handleAddPlace = (place) => {
    if (!selectedPlaces.some((p) => p.locationId === place.locationId)) {
      setSelectedPlaces([...selectedPlaces, place]); // 장소 추가
      setCenter({ lat: place.latitude, lng: place.longitude }); // 지도 중심 이동
    }
  };

  // 장소 삭제 핸들러
  const handleRemovePlace = (locationId) => {
    setSelectedPlaces(
      selectedPlaces.filter((p) => p.locationId !== locationId)
    );
  };

  if (!isLoaded) return <p>Loading...</p>;

  return (
    <div className={styles.planTrip}>
      {/* 좌측: 장소 선택 목록 */}
      <div className={styles.placeList}>
        <h2>장소 목록</h2>
        <ul className={styles.placeItems}>
          {allPlaces.map((place) => (
            <li key={place.locationId} className={styles.placeItem}>
              <img
                src={place.placeImgUrl}
                alt={place.locationName}
                className={styles.placeImage}
              />
              <div className={styles.placeInfo}>
                <strong>{place.locationName}</strong>
                <p>{place.formattedAddress}</p>
                <p>⭐ 평점: {place.googleRating}</p>
              </div>
              <button
                onClick={() => handleAddPlace(place)}
                className={styles.addButton}
              >
                +
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 중앙: 선택된 장소 목록 */}
      <div className={styles.selectedList}>
        <h2>선택된 장소</h2>
        <ul>
          {selectedPlaces.map((place, index) => (
            <li key={place.locationId} className={styles.selectedItem}>
              <img
                src={place.placeImgUrl}
                alt={place.locationName}
                className={styles.selectedImage}
              />
              <div className={styles.selectedInfo}>
                <span>
                  {index + 1}. {place.locationName}
                </span>
                <p>{place.formattedAddress}</p>
              </div>
              <button
                onClick={() => handleRemovePlace(place.locationId)}
                className={styles.deleteButton}
              >
                🗑
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* 우측: 지도 */}
      <div className={styles.mapContainer}>
        <GoogleMap
          mapContainerClassName={styles.mapContainer}
          center={center}
          zoom={12}
        >
          {selectedPlaces.map((place) => (
            <Marker
              key={place.locationId}
              position={{ lat: place.latitude, lng: place.longitude }}
              title={place.locationName}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export default PlanTrip;
