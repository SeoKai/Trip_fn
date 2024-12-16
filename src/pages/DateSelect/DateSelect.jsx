import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom"; // 데이터 전달 및 페이지 이동
import styles from "./DateSelect.module.scss";

function DateSelect() {
  const location = useLocation(); // 이전 페이지에서 전달된 state 받기
  const navigate = useNavigate(); // 다음 페이지로 이동을 위한 navigate
  const selectedCity = location.state?.city; // 전달받은 도시 정보

  const [startDate, setStartDate] = useState(""); // 출발일 상태
  const [endDate, setEndDate] = useState(""); // 도착일 상태

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleSubmit = () => {
    if (!startDate || !endDate) {
      alert("출발일과 도착일을 모두 선택해주세요.");
      return;
    }

    // 다음 페이지로 이동하면서 출발일, 도착일, 선택된 도시 정보를 전달
    navigate("/plan-trip", {
      state: { city: selectedCity, startDate, endDate },
    });
  };

  return (
    <div className={styles.dateSelect}>
      <h1>출발일/도착일 선택</h1>
      <p>
        선택된 도시: <strong>{selectedCity}</strong>
      </p>
      <div className={styles.datePicker}>
        <div>
          <label>출발일</label>
          <input
            type="date"
            value={startDate}
            onChange={handleStartDateChange}
          />
        </div>
        <div>
          <label>도착일</label>
          <input type="date" value={endDate} onChange={handleEndDateChange} />
        </div>
      </div>
      <button onClick={handleSubmit} className={styles.submitButton}>
        다음으로
      </button>
    </div>
  );
}

export default DateSelect;
