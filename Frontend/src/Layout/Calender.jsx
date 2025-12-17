// import React from "react";
// import Calendar from "react-calendar";
// import "react-calendar/dist/Calendar.css";

// export default function Calender({ selectedDate, setSelectedDate, events }) {
//   const tileContent = ({ date }) => {
//     const formatted = date.toDateString();
//     const hasEvent = events.some((e) => e.date === formatted);

//     return hasEvent ? (
//       <div className="flex justify-center mt-1">
//         <span className="w-2 h-2 rounded-full bg-purple-500 inline-block"></span>
//       </div>
//     ) : null;
//   };

//   return (
//     <Calendar
//       onChange={setSelectedDate}
//       value={selectedDate}
//       tileContent={tileContent}
//       className="custom-calendar w-full rounded-2xl shadow-xl p-4 border border-gray-200"
//       tileClassName={({ date }) => {
//         const today = new Date();
//         return date.toDateString() === today.toDateString()
//           ? "bg-blue-50 font-semibold rounded-xl"
//           : "";
//       }}
//     />
//   );
// }
/* styles.css */
