import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.scss"; // 상대 경로를 사용하여 SCSS 모듈 import

function Home() {
  const navigate = useNavigate();

  const goToCitySelect = () => {
    navigate("/select-city");
  };

  return (
    <div className={styles.home}>
      <h1>여행 플래너</h1>
      <button className={styles.startButton} onClick={goToCitySelect}>
        여행 계획 시작하기
      </button>
    </div>
  );
}

export default Home;
