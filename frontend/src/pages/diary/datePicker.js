import React, {useState} from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './css/diary.css'

const DateCalendar = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <DatePicker
      showIcon
      dateFormat='yyyy/MM/dd' // 날짜 형태
      shouldCloseOnSelect // 날짜를 선택하면 datepicker가 자동으로 닫힘
      selected={selectedDate}
      onChange={(date) => setSelectedDate(date)}
    />
  );
};

export default DateCalendar;
