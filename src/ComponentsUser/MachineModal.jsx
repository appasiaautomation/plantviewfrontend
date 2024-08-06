import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import Historic from "./HistoricDataModal";

const MachineModal = ({
  machine,
  closeModal,
  shiftIntervals,
  shiftStart,
  shiftEnd,
  latestStatus,
  deviceId,
  shifts,
}) => {
  const [showHourlyProduction, setShowHourlyProduction] = useState(false);
  const [hourlyProductionData, setHourlyProductionData] = useState([]);
  const [statusSinceDifference, setStatusSinceDifference] = useState("");
  const [showHistoricModal, setShowHistoricModal] = useState(false);
  const [localShifts, setLocalShifts] = useState(shifts);

  useEffect(() => {
    const interval = setInterval(() => {
      const difference = calculateTimeDifference(latestStatus.rtc);
      setStatusSinceDifference(difference);
    }, 1000);
    return () => clearInterval(interval);
  }, [latestStatus.rtc]);

  useEffect(() => {
    setLocalShifts(shifts);
    //console.log(shifts[0].shiftName);
  }, [shifts]);

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

  const handleHourlyProduction = async (deviceId) => {
    if (showHourlyProduction) {
      // If the table is already displayed, hide it and reset the data
      setShowHourlyProduction(false);
      setHourlyProductionData([]);
      return;
    }
    const currentTimeFormatted = getCurrentDateTimeFormatted();
    const shiftEndToUse =
      currentTimeFormatted < shiftEnd ? currentTimeFormatted : shiftEnd;

    try {
      const data = await fetchFields(deviceId, shiftStart, shiftEndToUse);
      const hourlyData = data.hourlyJobs.map((jobs, index) => ({
        cycleHr: shiftIntervals[index],
        production: jobs,
        setUpMode: parseDuration(data.setUpModeDurations[index]),
        machineBreakDown: parseDuration(data.machineBreakDownDurations[index]),
        noOperator: parseDuration(data.noOperatorDurations[index]),
        fault:
          parseDuration(data.setUpModeDurations[index]) +
          parseDuration(data.machineBreakDownDurations[index]) +
          parseDuration(data.noOperatorDurations[index]),
      }));
      setHourlyProductionData(hourlyData);
      setShowHourlyProduction(true);
    } catch (error) {
      console.error(
        `Error fetching fields for device ${deviceId}:`,
        error.message
      );
    }
  };

  //console.log(machine);

  async function fetchFields(deviceId, shiftStart, shiftEnd) {
    const response = await fetch(
      `/user/device/${deviceId}?shiftStart=${shiftStart}&shiftEnd=${shiftEnd}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch fields");
    }
    const data = await response.json();
    return data;
  }

  const closeHistoricModal = () => {
    setShowHistoricModal(false);
  };
  const handleHistoricData = async () => {
    setShowHistoricModal(true);
  };
  const parseDuration = (duration) => {
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
    const match = duration.match(regex);
    const hours = parseInt(match[1] || 0);
    const minutes = parseInt(match[2] || 0);
    const seconds = parseInt(match[3] || 0);
    return hours * 60 + minutes + seconds / 60;
  };

  const formatDateDDMMYYHHMMSS = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = String(date.getFullYear()).slice(-2);
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format, making '0' show as '12'
    const formattedHours = String(hours).padStart(2, "0");

    return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  };

  const calculateTimeDifference = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffMs = now - start;
    const diffMinutes = Math.floor(diffMs / 60000);
    const diffSeconds = Math.floor((diffMs % 60000) / 1000);
    return `${diffMinutes} min ${diffSeconds} sec`;
  };

  return (
    <div
      className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div
        className="modal-container bg-white w-9/11 md:max-w-3xl mx-auto rounded-lg shadow-lg z-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content py-4 text-left px-6 relative">
          <button
            className="close absolute top-0 right-0 mt-2 mr-4 cursor-pointer text-black text-2xl hover:text-gray-700"
            onClick={closeModal}
          >
            &times;
          </button>
          <h2 className="text-lg font-semibold mb-4">Machine Details</h2>
          <p>Machine Name: {machine.machineName}</p>
          <p>Device ID: {machine.deviceId}</p>
          <p>Number of Jobs: {latestStatus.jobs}</p>
          <p>
            Current Status:{" "}
            <span className="font-bold uppercase">{latestStatus.status}</span>
          </p>
          <p>Status Since: {formatDateDDMMYYHHMMSS(latestStatus.rtc)}</p>
          <p>Status Duration: {statusSinceDifference}</p>

          <Button onClick={() => handleHourlyProduction(machine.deviceId)}>
            Hourly Production
          </Button>
          <Button onClick={handleHistoricData}> Historical Data</Button>
          {showHistoricModal && (
            <Historic
              closeModal={closeHistoricModal}
              shifts={localShifts}
              machineName={machine.machineName}
              deviceId={deviceId}
            />
          )}
          {showHourlyProduction && (
            <div className="Current Shift mt-4">
              <h2 className="text-lg font-semibold mb-4">
                Current Shift Hourly Production{" "}
              </h2>
              <div className="flex items-center mb-2">
                <p className="mr-4">Machine Name: {machine.machineName}</p>
                <p>Date: {new Date().toLocaleDateString("en-GB")}</p>
              </div>
              <div className="table-container overflow-y-auto max-h-60">
                <table>
                  <thead>
                    <tr className="border-b border-gray-400">
                      <th
                        className="border-r border-gray-400 px-1 py-1"
                        style={{ width: "160px" }}
                      >
                        Cycle hr
                      </th>

                      <th className="border-r border-gray-400 px-1 py-1">
                        Production
                      </th>
                      <th
                        className="border-r border-gray-400 px-1 py-1"
                        style={{ width: "110px" }}
                      >
                        Fault
                      </th>
                      <th
                        className="border-r border-gray-400 px-1 py-1"
                        style={{ width: "110px" }}
                      >
                        Set Up Mode
                      </th>
                      <th
                        className="border-r border-gray-400 px-1 py-1"
                        style={{ width: "110px" }}
                      >
                        Machine Break Down
                      </th>
                      <th
                        className="border-r border-gray-400 px-1 py-1"
                        style={{ width: "110px" }}
                      >
                        No Operator
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {hourlyProductionData.map((data, index) => (
                      <tr key={index}>
                        <td className="border-r border-gray-400 px-1 py-1">
                          {data.cycleHr}
                        </td>
                        <td className="border-r border-gray-400 px-1 py-1">
                          {data.production}
                        </td>
                        <td className="border-r border-gray-400 px-1 py-1">
                          {Math.floor(data.fault)} min{" "}
                          {Math.floor((data.fault % 1) * 60)} sec
                        </td>
                        <td className="border-r border-gray-400 px-1 py-1">
                          {Math.floor(data.setUpMode)} min{" "}
                          {Math.floor((data.setUpMode % 1) * 60)} sec
                        </td>
                        <td className="border-r border-gray-400 px-1 py-1">
                          {Math.floor(data.machineBreakDown)} min{" "}
                          {Math.floor((data.machineBreakDown % 1) * 60)} sec
                        </td>
                        <td className="border-r border-gray-400 px-1 py-1">
                          {Math.floor(data.noOperator)} min{" "}
                          {Math.floor((data.noOperator % 1) * 60)} sec
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
  );
};

export default MachineModal;
