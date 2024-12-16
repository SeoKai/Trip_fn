import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate를 import
import styles from "./CitySelect.module.scss"; // 스타일 import

function CitySelect() {
  const cities = ["도쿄", "오사카", "후쿠오카"];
  const [selectedCity, setSelectedCity] = useState("");
  const navigate = useNavigate(); // useNavigate 초기화

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    // 페이지 이동
    navigate("/select-dates", { state: { city } }); // state를 통해 데이터 전달
  };

  return (
    <div className={styles.citySelect}>
      <h1>도시 선택</h1>
      <p>어느 일본 도시로 가고 싶으신가요?</p>
      <ul>
        {cities.map((city) => (
          <li
            key={city}
            className={styles.cityItem}
            onClick={() => handleCitySelect(city)}
          >
            {city}
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
