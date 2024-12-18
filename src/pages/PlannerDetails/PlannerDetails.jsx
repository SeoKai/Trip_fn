import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import HomeButton from "../../Components/HomeButton";

const PlannerDetails = () => {
  const { id } = useParams(); // URL에서 id 가져오기
  const [planner, setPlanner] = useState(null);

  useEffect(() => {
    // 서버에서 ID로 플랜 정보 가져오기
    const fetchPlannerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5050/api/planner/${id}`
        );
        setPlanner(response.data); // 데이터 저장
      } catch (error) {
        console.error("플랜 불러오기 실패:", error);
      }
    };

    fetchPlannerDetails();
  }, [id]);

  if (!planner) return <p>로딩 중...</p>;

  return (
    <div>
      <h1>{planner.plannerTitle}</h1>
      <p>시작 날짜: {planner.plannerStartDate}</p>
      <p>종료 날짜: {planner.plannerEndDate}</p>
      <p>지역: {planner.regionName}</p>
      <h2>일별 계획</h2>
      {planner.dailyPlans.map((day, index) => (
        <div key={index}>
          <h3>{day.planDate}</h3>
          <ul>
            {day.toDos.map((todo, idx) => (
              <li key={idx}>
                {todo.locationName} - {todo.formattedAddress}
              </li>
            ))}
          </ul>
        </div>
      ))}
      <HomeButton />
    </div>
  );
};

export default PlannerDetails;
