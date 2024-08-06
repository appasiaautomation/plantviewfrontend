import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

import HourlyData from "./HourlyData";

const Historic = ({ closeModal, shifts, machineName, deviceId }) => {
  const [formData, setFormData] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [showData, setShowData] = useState(false);
  const [showHourly, setShowHourly] = useState(false);
  const [selectedShift, setSelectedShift] = useState(null);
  const [localShifts, setLocalShifts] = useState(shifts);
  const [displayData, setDisplayData] = useState([]);
  const [selectedNoOperator, setSelectedNoOperator] = useState([]);
  const [selectedMachineBreakDown, setSelectedMachineBreakDown] = useState([]);
  const [selectedSetupMode, setSelectedSetupMode] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);

  useEffect(() => {
    setLocalShifts(shifts);
  }, [shifts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleHide = () => {
    setShowData(false);
  };

  const formatShiftTime = (date, time) => {
    return `${date}T${time}`;
  };

  const getCurrentDateTimeFormatted = () => {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const seconds = String(now.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  const parseDuration = (duration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const match = duration.match(regex);
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 60 + minutes + seconds / 60;
  };

  const getCurrentTimeFormatted = () => {
    const date = new Date();
    return date.toLocaleTimeString("en-GB", { hour12: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const curreDate = new Date(); // This creates a Date object representing the current date and time
    if (startDate > endDate || endDate > curreDate) {
      alert("Invalid Date Selection");
      return;
    }
    const result = [];

    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      for (let shift of localShifts) {
        if (d.getDate() == new Date(curreDate).getDate()) {
          const date = new Date();
          if (
            date.toLocaleTimeString("en-GB", { hour12: false }) <
            shift.shiftStart
          ) {
            break;
          }
        }
        const shiftStart = formatShiftTime(dateStr, shift.shiftStart);
        const shiftEnd = formatShiftTime(dateStr, shift.shiftEnd);
        let shiftEndToUse = shiftEnd;
        const currentTimeFormatted = getCurrentDateTimeFormatted();
        if (
          d.getDate() == new Date(curreDate).getDate() &&
          currentTimeFormatted < shiftEnd
        ) {
          shiftEndToUse = currentTimeFormatted;
          shift = {
            ...shift,
            shiftEnd: getCurrentTimeFormatted(),
          };
        }
        try {
          const response = await fetch(
            `/user/device/${deviceId}?shiftStart=${shiftStart}&shiftEnd=${shiftEndToUse}`
          );
          const data = await response.json();
          result.push({
            date: dateStr,
            shiftName: shift.shiftName,
            Production: data.hourlyJobs.reduce(
              (partialSum, a) => partialSum + a,
              0
            ),
            Fault:
              data.setUpModeDurations.reduce((sum, duration) => {
                return sum + parseDuration(duration);
              }, 0) +
              data.machineBreakDownDurations.reduce((sum, duration) => {
                return sum + parseDuration(duration);
              }, 0) +
              data.noOperatorDurations.reduce((sum, duration) => {
                return sum + parseDuration(duration);
              }, 0),
            SetUpMode: data.setUpModeDurations.reduce((sum, duration) => {
              return sum + parseDuration(duration);
            }, 0),
            MachineBreakDown: data.machineBreakDownDurations.reduce(
              (sum, duration) => {
                return sum + parseDuration(duration);
              },
              0
            ),
            NoOperator: data.noOperatorDurations.reduce((sum, duration) => {
              return sum + parseDuration(duration);
            }, 0),
            shiftData: shift,
            hourlySetUp: data.setUpModeDurations,
            hourlyMachineBreakDown: data.machineBreakDownDurations,
            hourlyJobs: data.hourlyJobs,
            hourlyNoOperator: data.noOperatorDurations,
          });
        } catch (error) {
          console.error("Error fetching shift data:", error);
        }
      }
    }
    setDisplayData(result);
    setShowData(true);
  };

  const handleHourlyClick = (
    shift,
    date,
    jobs,
    setup,
    machineBreakDown,
    noOperator
  ) => {
    const updatedShift = { ...shift, date: date };
    setSelectedShift(updatedShift);
    setSelectedJobs(jobs);
    setSelectedMachineBreakDown(machineBreakDown);
    setSelectedSetupMode(setup);
    setSelectedNoOperator(noOperator);
    setShowHourly(true);
  };

  const handleHideHourly = () => {
    setShowHourly(false);
    setSelectedShift(null);
  };

  return (
    <>
      <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50">
        <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        <div
          className="modal-container bg-white w-full md:max-h:4xl md:max-w-4xl mx-auto rounded shadow-lg z-50 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content py-4 text-left px-6 relative">
            <button
              className="close absolute top-0 right-0 mt-2 mr-4 cursor-pointer text-black text-2xl hover:text-gray-700"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4 text-center">
              Historical Data
            </h2>
            <p>
              Machine Name: <b>{machineName}</b>
            </p>

            <form onSubmit={handleSubmit}>
              <div className="flex items-center justify-center">
                <TextField
                  id="startDate"
                  label="From Date"
                  type="date"
                  variant="outlined"
                  sx={{ m: 1, width: "25ch" }}
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="endDate"
                  label="To Date"
                  type="date"
                  variant="outlined"
                  sx={{ m: 1, width: "25ch" }}
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ m: 1 }}
                >
                  Show
                </Button>
                {showData && (
                  <Button onClick={handleHide} sx={{ m: 1 }}>
                    Hide
                  </Button>
                )}
              </div>
            </form>

            {showData && (
              <div className="mt-4">
                <div className="table-container overflow-y-auto max-h-60">
                  <table className="min-w-full bg-white border">
                    <thead>
                      <tr>
                        <th className="py-2">Date</th>
                        <th className="py-2">Shift Name</th>
                        <th className="p-2">Production</th>
                        <th className="p-2">Fault</th>
                        <th className="p-2">Set Up Mode</th>
                        <th className="p-2">Machine Break Down</th>
                        <th className="p-2">No Operator</th>
                        <th className="p-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {displayData.map((item, index) => (
                        <tr key={index}>
                          <td className="py-2 border">
                            {new Date(item.date).toLocaleDateString("en-GB")}
                          </td>
                          <td className="py-2 border">{item.shiftName}</td>
                          <td className="p-2 border">{item.Production}</td>
                          <td className="p-2 border">
                            {Math.floor(item.Fault)} min{" "}
                            {Math.floor((item.Fault % 1) * 60)} sec
                          </td>
                          <td className="p-2 border">
                            {Math.floor(item.SetUpMode)} min{" "}
                            {Math.floor((item.SetUpMode % 1) * 60)} sec
                          </td>
                          <td className="p-2 border">
                            {Math.floor(item.MachineBreakDown)} min{" "}
                            {Math.floor((item.MachineBreakDown % 1) * 60)} sec
                          </td>
                          <td className="p-2 border">
                            {Math.floor(item.NoOperator)} min{" "}
                            {Math.floor((item.NoOperator % 1) * 60)} sec
                          </td>
                          <td className="p-2 border">
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() =>
                                handleHourlyClick(
                                  item.shiftData,
                                  item.date,
                                  item.hourlyJobs,
                                  item.hourlySetUp,
                                  item.hourlyMachineBreakDown,
                                  item.hourlyNoOperator
                                )
                              }
                            >
                              Hourly
                            </Button>
                            {showHourly && selectedShift && (
                              <HourlyData
                                shift={selectedShift}
                                closeHourlyModal={handleHideHourly}
                                machineName={machineName}
                                fromDate={formData.startDate}
                                toDate={formData.endDate}
                                jobs={selectedJobs}
                                setup={selectedSetupMode}
                                machineBreakDown={selectedMachineBreakDown}
                                noOperator={selectedNoOperator}
                              />
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Historic;
