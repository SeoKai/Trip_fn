import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import CitySelect from './pages/CitySelect/CitySelect.jsx';
import DateSelect from './pages/DateSelect/DateSelect.jsx';
import PlanTrip from './pages/PlanTrip/PlanTrip'; // 새 페이지 import

function App() {
  return (
    <Router>
      <Routes>
        {/* 첫 화면 */}
        <Route path="/" element={<Home />} />
        {/* 도시 선택 화면 */}
        <Route path="/select-city" element={<CitySelect />} />
        {/* 날짜 선택 화면 */}
        <Route path="/select-dates" element={<DateSelect />} />
        {/* 여행 계획 작성 */}
        <Route path="/plan-trip" element={<PlanTrip />} />
      </Routes>
    </Router>
  );
}

export default App;
