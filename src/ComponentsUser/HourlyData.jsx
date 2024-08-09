import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import "./generateHourly";

// Utility function to generate hourly intervals
const generateHourlyIntervals = (start, end) => {
  let intervals = [];
  const startHour = parseInt(start.split(":")[0]);
  const endHour = parseInt(end.split(":")[0]);
  const startHourMinutes = parseInt(start.split(":")[1]);
  const endHourMinutes = parseInt(end.split(":")[1]);
  const currentHour = new Date().getHours();

  if (start <= end) {
    // Shift within the same day

    for (let hour = startHour; hour < endHour && hour <= currentHour; hour++) {
      if (hour + 1 >= endHour) {
        if (startHourMinutes >= endHourMinutes) {
          intervals.push(
            `${hour}:${startHourMinutes} - ${hour + 1}:${endHourMinutes}`
          );
          break;
        } else {
          intervals.push(
            `${hour}:${startHourMinutes} - ${hour + 1}:${startHourMinutes}`
          );
          intervals.push(
            `${hour + 1}:${startHourMinutes} - ${hour + 1}:${endHourMinutes}`
          );
          break;
        }
      }
      intervals.push(
        `${hour}:${startHourMinutes} - ${hour + 1}:${startHourMinutes}`
      );
    }
  } else {
    // Shift spans overnight
    let zero = 0;
    for (let hour = startHour; hour < 24; hour++) {
      if (endHour == zero && hour == 23) {
        intervals.push(
          `${hour}:${startHourMinutes} - ${zero}:${endHourMinutes}`
        );
        continue;
      }

      intervals.push(
        `${hour}:${startHourMinutes} - ${hour + 1}:${startHourMinutes}`
      );
    }
    for (let hour = 0; hour < endHour; hour++) {
      if (hour + 1 >= endHour) {
        if (startHourMinutes >= endHourMinutes) {
          intervals.push(
            `${hour}:${startHourMinutes} - ${hour + 1}:${endHourMinutes}`
          );
          break;
        } else {
          intervals.push(
            `${hour}:${startHourMinutes} - ${hour + 1}:${startHourMinutes}`
          );
          intervals.push(
            `${hour + 1}:${startHourMinutes} - ${hour + 1}:${endHourMinutes}`
          );
          break;
        }
      }
      intervals.push(
        `${hour}:${startHourMinutes} - ${hour + 1}:${startHourMinutes}`
      );
    }
  }

  // Convert 24-hour intervals to 12-hour format
  return intervals.map((interval) => {
    const [start, end] = interval.split(" - ");
    //console.table(`${start}- ${end}`);
    return `${convertTo12HourFormat(start)}- ${convertTo12HourFormat(end)}`;
  });
};

// Utility function to format 24-hour time

// Utility function to convert 24-hour time to 12-hour format
const convertTo12HourFormat = (time) => {
  const [hour, minute] = time.split(":").map(Number);
  const adjustedHour = hour % 12 || 12;
  const period = hour >= 12 ? "PM" : "AM";
  return `${adjustedHour}:${minute < 10 ? `0${minute}` : minute} ${period}`;
};
const parseDuration = (duration) => {
  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const match = duration.match(regex);
  const hours = parseInt(match[1] || 0);
  const minutes = parseInt(match[2] || 0);
  const seconds = parseInt(match[3] || 0);
  return hours * 60 + minutes + seconds / 60;
};

const getCurrentDateFormatted = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const HourlyData = ({
  shift,
  closeHourlyModal,
  machineName,
  fromDate,
  toDate,
  jobs,
  setup,
  machineBreakDown,
  noOperator,
}) => {
  const [hourlyData, setHourlyData] = useState([]);
  const [shiftIntervals, setShiftIntervals] = useState([]);

  useEffect(() => {
    const intervals = generateHourlyIntervals(shift.shiftStart, shift.shiftEnd);
    setShiftIntervals(intervals);
    const hourlyData1 = intervals.map((hour, index) => ({
      cycleHr: hour,
      production: jobs[index],
      fault:
        parseDuration(setup[index]) +
        parseDuration(machineBreakDown[index]) +
        parseDuration(noOperator[index]),
      SetUpMode: parseDuration(setup[index]),
      MachineBreakDown: parseDuration(machineBreakDown[index]),
      NoOperator: parseDuration(noOperator[index]),
    }));
    setHourlyData(hourlyData1);
  }, [shift.shiftStart, shift.shiftEnd]);

  return (
    <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div className="modal-container bg-white w-full md:max-h:4xl md:max-w-4xl mx-auto rounded shadow-lg z-50 overflow-y-auto">
        <div className="modal-content py-4 text-left px-6 relative">
          <button
            className="close absolute top-0 right-0 mt-2 mr-4 cursor-pointer text-black text-2xl hover:text-gray-700"
            onClick={closeHourlyModal}
          >
            &times;
          </button>
          <h2 className="text-lg font-semibold mb-4 text-center">
            Hourly Data
          </h2>
          <div>
            <p>
              Machine Name : <b>{machineName}</b>
            </p>
            <p>
              Shift Name : <b>{shift.shiftName}</b>
            </p>
          </div>
          <p>Date: {new Date(shift.date).toLocaleDateString("en-GB")}</p>
          <div className="mt-4">
            <div className="table-container overflow-y-auto max-h-60">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr>
                    <th className="py-2 border">Cycle hr</th>
                    <th className="py-2 border">Production</th>
                    <th className="py-2 border">Fault</th>
                    <th className="py-2 border">Set Up Mode</th>
                    <th className="py-2 border">Machine Break Down</th>
                    <th className="py-2 border">No Operator</th>
                  </tr>
                </thead>
                <tbody>
                  {hourlyData.map((item, index) => (
                    <tr key={index}>
                      <td className="py-2 border">{item.cycleHr}</td>
                      <td className="py-2 border">{item.production}</td>
                      <td className="py-2 border">
                        {Math.floor(item.fault)} min{" "}
                        {Math.floor((item.fault % 1) * 60)} sec
                      </td>
                      <td className="py-2 border">
                        {Math.floor(item.SetUpMode)} min{" "}
                        {Math.floor((item.SetUpMode % 1) * 60)} sec
                      </td>
                      <td className="py-2 border">
                        {Math.floor(item.MachineBreakDown)} min{" "}
                        {Math.floor((item.MachineBreakDown % 1) * 60)} sec
                      </td>
                      <td className="py-2 border">
                        {Math.floor(item.NoOperator)} min{" "}
                        {Math.floor((item.NoOperator % 1) * 60)} sec
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyData;
