import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate를 import
import styles from "./CitySelect.module.scss"; // 스타일 import

function CitySelect() {
  const cities = [
    { regionId: 1, name: "도쿄" },
    { regionId: 2, name: "오사카" },
    { regionId: 3, name: "후쿠오카" },
  ];

  const [selectedCity, setSelectedCity] = useState(""); // selectedCity 상태 선언
  const navigate = useNavigate();

  const handleCitySelect = (city) => {
    setSelectedCity(city.name);
    navigate("/select-dates", {
      state: { regionId: city.regionId, cityName: city.name },
    });
  };

  return (
    <div className={styles.citySelect}>
      <h1>도시 선택</h1>
      <p>어느 일본 도시로 가고 싶으신가요?</p>
      <ul>
        {cities.map((city) => (
          <li
            key={city.regionId}
            onClick={() => handleCitySelect(city)}
            className={styles.cityItem}
          >
            {city.name}
          </li>
        ))}
      </ul>
      {selectedCity && (
        <p>
          선택된 도시: <strong>{selectedCity}</strong>
        </p>
      )}
    </div>
  );
}

export default CitySelect;
