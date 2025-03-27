import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch } from 'react-icons/fi'; // ไอคอนค้นหา
import { WiDaySunny, WiCloudy, WiRain, WiSnow, WiThunderstorm, WiShowers, WiWindy } from 'react-icons/wi'; // ไอคอนแสดงสภาพอากาศ

// ฟังก์ชันหลักของแอปพลิเคชัน
function App() {
  // สถานะของข้อมูลสภาพอากาศ
  const [weatherData, setWeatherData] = useState(null);
  // สถานะของข้อมูลพยากรณ์อากาศ
  const [forecastData, setForecastData] = useState(null);
  // สถานะของเมืองที่เลือก
  const [city, setCity] = useState('Bangkok');
  // สถานะของค่าที่ผู้ใช้ป้อนในช่องค้นหา
  const [inputCity, setInputCity] = useState('');

  const API_KEY = '860c5844299d8e1047d3c5c2ae09cbda'; // API Key สำหรับการดึงข้อมูลจาก OpenWeather API

  // ฟังก์ชันสำหรับค้นหาเมืองใหม่
  const handleSearch = () => {
    if (inputCity) {
      setCity(inputCity);  // อัพเดทชื่อเมืองที่ต้องการค้นหา
      setInputCity('');  // รีเซ็ตค่าที่ผู้ใช้ป้อน
    }
  };

  // ฟังก์ชันสำหรับตรวจจับการกดปุ่ม Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();  // เรียกฟังก์ชันค้นหาหากกด Enter
    }
  };

  // ใช้ useEffect เพื่อดึงข้อมูลเมื่อเมือง (city) เปลี่ยนแปลง
  useEffect(() => {
    if (!city) return;  // หากไม่มีการเลือกเมือง ให้ไม่ทำอะไร

    // ดึงข้อมูลสภาพอากาศปัจจุบัน
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)  // เพิ่ม units=metric เพื่อให้ได้หน่วย Celsius
      .then((response) => {
        setWeatherData(response.data);  // บันทึกข้อมูลที่ได้มาใน state
      })
      .catch((error) => console.error('Error fetching data: ', error));  // กรณีเกิดข้อผิดพลาด

    // ดึงข้อมูลพยากรณ์อากาศ 7 วัน
    axios
      .get(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`)  // เพิ่ม units=metric เพื่อให้ได้หน่วย Celsius
      .then((response) => {
        // กรองข้อมูลเพื่อแสดงแค่วันที่ที่เกี่ยวข้อง (เอาข้อมูลที่แสดง 3 ครั้งต่อวัน)
        const filteredData = response.data.list.filter((item, index) => {
          return index % 8 === 0;  // กรองข้อมูลให้แสดงเฉพาะวันที่
        });
        setForecastData(filteredData);  // บันทึกข้อมูลพยากรณ์ที่ได้
      })
      .catch((error) => console.error('Error fetching forecast data: ', error));  // กรณีเกิดข้อผิดพลาด
  }, [city]);  // ใช้ city เป็น dependency เพื่อให้ effect ทำงานเมื่อ city เปลี่ยนแปลง

  // ฟังก์ชันสำหรับเลือกไอคอนตามสภาพอากาศ (ใช้ค่า icon ที่ดึงมาจาก API)
  const getWeatherIcon = (icon) => {
    switch (icon) {
      case '01d': // Clear sky day
        return <WiDaySunny size={50} color="yellow" />;  // ไอคอนสำหรับท้องฟ้าสดใสในตอนกลางวัน
      case '01n': // Clear sky night
        return <WiDaySunny size={50} color="yellow" />;  // ไอคอนสำหรับท้องฟ้าสดใสในตอนกลางคืน
      case '02d': // Few clouds day
        return <WiCloudy size={50} color="gray" />;  // ไอคอนสำหรับมีเมฆบางส่วนในตอนกลางวัน
      case '02n': // Few clouds night
        return <WiCloudy size={50} color="gray" />;  // ไอคอนสำหรับมีเมฆบางส่วนในตอนกลางคืน
      case '03d': // Scattered clouds day
        return <WiCloudy size={50} color="gray" />;  // ไอคอนสำหรับเมฆกระจายในตอนกลางวัน
      case '03n': // Scattered clouds night
        return <WiCloudy size={50} color="gray" />;  // ไอคอนสำหรับเมฆกระจายในตอนกลางคืน
      case '04d': // Broken clouds day
        return <WiCloudy size={50} color="gray" />;  // ไอคอนสำหรับเมฆมากในตอนกลางวัน
      case '04n': // Broken clouds night
        return <WiCloudy size={50} color="gray" />;  // ไอคอนสำหรับเมฆมากในตอนกลางคืน
      case '09d': // Shower rain day
        return <WiShowers size={50} color="blue" />;  // ไอคอนสำหรับฝนตกเบา ๆ ในตอนกลางวัน
      case '09n': // Shower rain night
        return <WiShowers size={50} color="blue" />;  // ไอคอนสำหรับฝนตกเบา ๆ ในตอนกลางคืน
      case '10d': // Rain day
        return <WiRain size={50} color="blue" />;  // ไอคอนสำหรับฝนตกในตอนกลางวัน
      case '10n': // Rain night
        return <WiRain size={50} color="blue" />;  // ไอคอนสำหรับฝนตกในตอนกลางคืน
      case '11d': // Thunderstorm day
        return <WiThunderstorm size={50} color="gray" />;  // ไอคอนสำหรับพายุฝนฟ้าคะนองในตอนกลางวัน
      case '11n': // Thunderstorm night
        return <WiThunderstorm size={50} color="gray" />;  // ไอคอนสำหรับพายุฝนฟ้าคะนองในตอนกลางคืน
      case '13d': // Snow day
        return <WiSnow size={50} color="lightblue" />;  // ไอคอนสำหรับหิมะในตอนกลางวัน
      case '13n': // Snow night
        return <WiSnow size={50} color="lightblue" />;  // ไอคอนสำหรับหิมะในตอนกลางคืน
      case '50d': // Mist day
        return <WiWindy size={50} color="gray" />;  // ไอคอนสำหรับหมอกในตอนกลางวัน
      case '50n': // Mist night
        return <WiWindy size={50} color="gray" />;  // ไอคอนสำหรับหมอกในตอนกลางคืน
      default:
        return <WiCloudy size={50} color="gray" />;  // ไอคอนสำหรับสภาพอากาศทั่วไป
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10" style={{ background: 'linear-gradient(-35deg,rgb(16, 81, 147) 0%,rgb(162, 204, 225))' }}>
      <div className="bg-white max-w-md w-full rounded-x1 shadow-2xl p-8 rounded-xl">
{/* Search Bar */}
        <div className="flex justify-between items-center mb-4">
          <input
            type="text"
            placeholder="Enter city"
            value={inputCity}
            onChange={(e) => setInputCity(e.target.value)} // อัพเดทค่าของ inputCity เมื่อผู้ใช้ป้อนข้อมูล
            onKeyDown={handleKeyPress} // ฟังก์ชันเมื่อผู้ใช้กดปุ่ม Enter
            className="p-2 rounded-lg border-2 border-gray-300 w-80 focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button onClick={handleSearch} className="bg-blue-500 text-white p-3 rounded-lg ml-4 shadow-lg hover:bg-blue-600 transition duration-300">
            <FiSearch className="text-xl" /> {/* ไอคอนค้นหา */}
          </button>
        </div>

        {/* แสดงข้อมูลสภาพอากาศปัจจุบัน */}
        {weatherData && (
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">{weatherData.name}</h2>
            <div className="flex justify-center items-center">
              {getWeatherIcon(weatherData.weather[0].icon)} {/* แสดงไอคอนตามสภาพอากาศ */}
            </div>
            <p className="text-xl text-gray-600">{weatherData.weather[0].description}</p>
            <p className="text-6xl font-semibold text-blue-600 mt-4">{weatherData.main.temp}°C</p>
          </div>
        )}

        {/* แสดงข้อมูลพยากรณ์อากาศ */}
        {forecastData && (
          <div className="space-y-4">
            {forecastData.map((forecast, index) => (
              <div key={index} className="flex justify-between items-center p-4 bg-blue-200 rounded-lg shadow-lg">
                <p className="text-xl font-semibold text-gray-800">{new Date(forecast.dt_txt).toLocaleDateString('en-US', { weekday: 'short' })}</p>
                <div className="flex items-center space-x-2">
                  {getWeatherIcon(forecast.weather[0].icon)} {/* แสดงไอคอนตามสภาพอากาศ */}
                  <p className="text-lg text-blue-600">{forecast.main.temp}°C</p>
                </div>
                <p className="text-sm text-gray-500">{forecast.weather[0].description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
