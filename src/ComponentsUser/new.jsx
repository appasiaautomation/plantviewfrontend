import React, { useState, useEffect } from "react";
import "./tailwind.css";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

const sampleData = {
  plantName: "Sample",
  location: "",
  totalMachines: 0,
  machinesRunning: 0,
  machinesFault: 0,
  machinesIdle: 0,
  machinesWithError: 0,
  lastUpdated: new Date().toLocaleString(),
  shiftTimes: [],
  machineInfo: [],
};

const UserApp = () => {
  const [data, setData] = useState(sampleData);
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [selectedShift, setSelectedShift] = useState("");
  const [showEditShiftModal, setShowEditShiftModal] = useState(false);
  const location = useLocation();
  const { userName, userLocation, plantName } = location.state || {};
  const navigate = useNavigate();
  const [shiftIntervals, setShiftIntervals] = useState([]);
  const [fieldsData, setFieldsData] = useState({});
  const [deviceIds, setDeviceIds] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/user/getUserDevices?userName=${userName}`);
        if (response.ok) {
          const devicesData = await response.json();
          setDeviceIds(devicesData.map(device => device.deviceId));
          setData((prevData) => ({
            ...prevData,
            totalMachines: devicesData.length,
            location: userLocation,
            plantName: plantName,
            machineInfo: devicesData.map((device) => ({
              deviceId: device.deviceId,
              machineName: device.machineName,
              alarmTime: device.alarmTime,
              idleTime: device.idleTime,
              startDate: device.startDate,
              status: device.status,
              u: device.u,
              machineLocation: device.machineLocation,
            })),
            prod: Math.floor(Math.random() * 100),
          }));
        } else {
          console.error("Failed to fetch user devices");
        }
      } catch (error) {
        console.error("Error fetching user devices:", error);
      }
    };

    fetchData();
  }, [userName, userLocation, plantName]);
  console.log(fieldsData);

  async function fetchFields(deviceId, shiftStart, shiftEnd) {
    const startDate = new Date(shiftStart);
    const endDate = new Date(shiftEnd);
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    const response = await fetch(`/user/device/${deviceId}?shiftStart=${formattedStartDate}&shiftEnd=${formattedEndDate}`);
    if (!response.ok) {
      throw new Error("Failed to fetch fields");
    }
    const data = await response.json();
    return data;
  }
  
  const formatDate = (date) => {
    const pad = (num) => (num < 10 ? `0${num}` : num);
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  };

  useEffect(() => {
    const determineShift = async () => {
      try {
        const response = await fetch(`/user/userShift?userName=${userName}`);
        if (response.ok) {
          const shiftsData = await response.json();
          const currentHour = new Date().getHours();
          const matchingShift = shiftsData.find((shift) => {
            const startHour = parseInt(shift.shiftStart.split(":")[0]);
            const endHour = parseInt(shift.shiftEnd.split(":")[0]);
            return currentHour >= startHour && currentHour < endHour;
          });
          if (matchingShift) {
            const shiftStart = matchingShift.shiftStart;
            const shiftEnd = matchingShift.shiftEnd;
            const shiftIntervals = generateHourlyIntervals(
              shiftStart,
              shiftEnd
            );
            setSelectedShift(
              `${convertTo12HourFormat(shiftStart)} - ${convertTo12HourFormat(
                shiftEnd
              )}`
            );

            setShiftIntervals(shiftIntervals);
          } else {
            setSelectedShift("Default Shift Time");
          }
        } else {
          console.error("Failed to fetch user shifts");
        }
      } catch (error) {
        console.error("Error fetching user shifts:", error);
      }
    };

    const generateHourlyIntervals = (start, end) => {
      const startHour = parseInt(start.split(":")[0]);
      const endHour = parseInt(end.split(":")[0]);
      let intervals = [];

      for (let hour = startHour; hour < endHour; hour++) {
        intervals.push(
          `${convertTo12HourFormat(`${hour}:00`)} - ${convertTo12HourFormat(
            `${hour + 1}:00`
          )}`
        );
      }
      return intervals;
    };

    const convertTo12HourFormat = (time) => {
      const [hour, minute] = time.split(":").map(Number);
      const period = hour >= 12 ? "PM" : "AM";
      const adjustedHour = hour % 12 || 12;
      return `${adjustedHour}:${minute < 10 ? `0${minute}` : minute} ${period}`;
    };

    determineShift();
  }, [userName]);


  useEffect(() => {
    const fetchDataForDevices = async () => {
      if (deviceIds.length === 0) return;
      const shiftStart = new Date("2023-05-01T08:00:00");
      const shiftEnd = new Date("2023-05-01T16:00:00");
      const newFieldsData = {};
      for (const deviceId of deviceIds) {
        try {
          const data = await fetchFields(deviceId, shiftStart, shiftEnd);
          
          newFieldsData[deviceId] = data;
        } catch (error) {
          console.error(`Error fetching fields for device ${deviceId}:`, error.message);
        }
      }
      setFieldsData(newFieldsData);
    };
    fetchDataForDevices();
    const interval = setInterval(fetchDataForDevices, 10000);
    return () => clearInterval(interval);
  }, [deviceIds]);

  const deleteShift = async (shiftId) => {
    try {
      const response = await fetch(`/user/deleteShift?SrNo=${shiftId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        fetchUserShifts();
      } else {
        console.error("Failed to delete shift");
      }
    } catch (error) {
      console.error("Error deleting shift:", error);
    }
  };

  const handleIdleAlarm = () => { 
    navigate("/User/Menu", { state: { devices: data.machineInfo } });
  };

  const handleMachineClick = (machine) => {
    setSelectedMachine(machine);
  };

  const handleEditShiftTime = async () => {
    const response = await fetch(`/user/userShift?userName=${userName}`);
    if (response.ok) {
      const data1 = await response.json();
      data.shiftTimes = data1;
    }
    setShowEditShiftModal(true);
  };

  const closeEditShiftModal = () => {
    setShowEditShiftModal(false);
  };

  const MachineModal = ({ machine }) => {
    const closeModal = () => {
      setSelectedMachine(null);
    };

    const [showHourlyProduction, setShowHourlyProduction] = useState(false);
    const [hourlyProductionData, setHourlyProductionData] = useState([]);

    // Function to parse ISO duration strings like 'PT15M' to minutes
    const parseDuration = (duration) => {
      const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
      const match = duration.match(regex);
      const hours = parseInt(match[1] || 0);
      const minutes = parseInt(match[2] || 0);
      const seconds = parseInt(match[3] || 0);
      return hours * 60 + minutes + seconds / 60;
    };

    const fetchHourlyProduction = async () => {
      // Fetching the production data specific to the selected machine
      if (!machine.deviceId) return;

      try {
        const shiftStart = new Date("2023-05-01T08:00:00");
        const shiftEnd = new Date("2023-05-01T16:00:00");
        const data = await fetchFields(machine.deviceId, shiftStart, shiftEnd);

        const hourlyData = data.hourlyJobs.map((jobs, index) => ({
          cycleHr: shiftIntervals[index],
          production: jobs,
          setUpMode: parseDuration(data.setUpModeDurations[index]),
          machineBreakDown: parseDuration(data.machineBreakDownDurations[index]),
          noOperator: parseDuration(data.noOperatorDurations[index]),
          fault: parseDuration(data.setUpModeDurations[index]) +
            parseDuration(data.machineBreakDownDurations[index]) +
            parseDuration(data.noOperatorDurations[index])
        }));

        setHourlyProductionData(hourlyData);
        setShowHourlyProduction(true);
      } catch (error) {
        console.error(`Error fetching fields for device ${machine.deviceId}:`, error.message);
      }
    };

    const handleHourlyProduction = () => {
      if (!showHourlyProduction) {
        fetchHourlyProduction();
      } else {
        setShowHourlyProduction(false);
      }
    };

    return (
      <div
        className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50"
        onClick={closeModal}
      >
        <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-60"></div>
        <div
          className="modal-container bg-white w-9/11 md:max-w-3xl mx-auto rounded-lg shadow-lg z-50 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content py-2 px-1 relative">
            <button
              className="close absolute top-0 right-0 mt-2 mr-4 cursor-pointer text-black text-2xl hover:text-gray-700"
              onClick={closeModal}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Machine Details</h2>
            <p>Machine Name: {machine.machineName}</p>
            <p>Device ID: {machine.deviceId}</p>
            <p>Number of Jobs: {machine.prod}</p>
            <p>Status Since: {machine.sta}</p>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleHourlyProduction}
            >
              {showHourlyProduction ? " Hourly Production" : " Hourly Production"}
            </button>
            {showHourlyProduction && (
              <div className="Current Shift mt-4">
                <h2 className="text-lg font-semibold mb-4">Current Shift</h2>
                <div className="flex items-center mb-2">
                  <p className="mr-4">Machine Name: {machine.machineName}</p>
                  <p>Date: {new Date().toLocaleDateString()}</p>
                </div>
                <div className="table-container overflow-y-auto max-h-60">
                  <table className="w-full text-center">
                    <thead>
                      <tr className="border-b border-gray-400">
                        <th className="border-r border-gray-400 px-4 py-2 w-24">
                          Cycle hr
                        </th>
                        <th className="border-r border-gray-400 px-1 py-1">
                          Production
                        </th>
                        <th className="border-r border-gray-400 px-1 py-1">
                          Fault
                        </th>
                        <th className="border-r border-gray-400 px-1 py-1">
                          Set Up Mode
                        </th>
                        <th className="border-r border-gray-400 px-1 py-1">
                          Machine Break Down
                        </th>
                        <th className="border-r border-gray-400 px-1 py-1">
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
                            {data.fault} min
                          </td>
                          <td className="border-r border-gray-400 px-1 py-1">
                            {data.setUpMode} min
                          </td>
                          <td className="border-r border-gray-400 px-1 py-1">
                            {data.machineBreakDown} min
                          </td>
                          <td className="border-r border-gray-400 px-1 py-1">
                            {data.noOperator} min
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

  // Function to fetch user shifts
  const fetchUserShifts = async () => {
    try {
      const response = await fetch(`/user/userShift?userName=${userName}`);
      if (response.ok) {
        const shiftsData = await response.json();
        setData((prevData) => ({
          ...prevData,
          shiftTimes: shiftsData,
        }));
      } else {
        console.error("Failed to fetch user shifts");
      }
    } catch (error) {
      console.error("Error fetching user shifts:", error);
    }
  };

  const EditShiftModal = () => {
    const [shifts, setShifts] = useState(
      data.shiftTimes.map((shift) => ({
        shiftName: shift.shiftName,
        shiftStart: shift.shiftStart,
        shiftEnd: shift.shiftEnd,
        srNo: shift.srNo,
      }))
    );

    const handleAddShift = () => {
      if (shifts.length < 4) {
        const newShifts = [
          ...shifts,
          { shiftName: "", shiftStart: "", shiftEnd: "" },
        ];
        setShifts(newShifts);
      } else {
        alert("You can only add up to 4.");
      }
    };

    const handleDeleteShift = async (index) => {
      if (window.confirm("Are you sure you want to delete this shift?")) {
        await deleteShift(shifts[index].srNo);
        alert("Shift deleted successfully!");
      }
    };

    const handleShiftInputChange = (e, index, type) => {
      const updatedShifts = [...shifts];
      updatedShifts[index][type] = e.target.value;
      setShifts(updatedShifts);
    };

    const handleSaveChanges = async () => {
      try {
        // Loop through shifts and update or save individually
        for (let shift of shifts) {
          if (shift.srNo) {
            // If SrNo exists, update the shift
            await fetch(`/user/updatePlantShift/${shift.srNo}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(shift),
            });
          } else {
            // If SrNo doesn't exist, save the new shift
            await fetch(`/user/User7/addPlantShifts`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(shift),
            });
          }
        }

        // Refresh shifts after updating
        fetchUserShifts();
        alert("Shift Saved successfully!");
        // Close modal
        closeEditShiftModal();
      } catch (error) {
        console.error("Error updating shifts:", error);
      }
    };

    return (
      <div
        className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center
        z-50"
        onClick={closeEditShiftModal}
      >
        <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
        <div
          className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content py-4 text-left px-6 relative">
            <button
              className="close absolute top-0 right-0 mt-6 mr-4 cursor-pointer text-black text-2xl hover:text-gray-700"
              onClick={closeEditShiftModal}
            >
              &times;
            </button>
            <h2 className="text-lg font-semibold mb-4">Edit Shift Time</h2>
            <Button onClick={handleAddShift}>Add Shift</Button>
            <table className="w-full ">
              <thead>
                <tr>
                  <th className="px-1 py-1 border">Shift Name</th>
                  <th className="px-1 py-1 border">Start Time</th>
                  <th className="px-1 py-1 border">End Time</th>
                  <th className="px-1 py-1 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shifts.map((shift, index) => (
                  <tr key={index}>
                    <td className="px-2 py-1 border">
                      <input
                        type="text"
                        value={shift.shiftName}
                        onChange={(e) =>
                          handleShiftInputChange(e, index, "shiftName")
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="time"
                        value={shift.shiftStart}
                        onChange={(e) =>
                          handleShiftInputChange(e, index, "shiftStart")
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <input
                        type="time"
                        value={shift.shiftEnd}
                        onChange={(e) =>
                          handleShiftInputChange(e, index, "shiftEnd")
                        }
                        className="w-full border rounded px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-2 border">
                      <button
                        onClick={() => handleDeleteShift(index)}
                        className="text-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex justify-center mt-4">
              <Button onClick={handleSaveChanges}>Save</Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white shadow-md rounded">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-semibold flex-grow mx-auto text-center">
          {data.plantName}
        </h1>
        <h4 className="text-xl font-semibold">{`Last Updated: ${new Date().toLocaleString()}`}</h4>
      </div>

      <div className="flex mt-4">
        <div className="center-panel w-3/4 pr-4 mb-4 md:mb-0">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="text-right font-semibold">Location</td>
                <td className="text-center font-semibold">:</td>
                <td className="text-left">{data.location}</td>
              </tr>
              <tr>
                <td className="text-right font-semibold">Total Machines</td>
                <td className="text-center font-semibold">:</td>
                <td className="text-left">{data.totalMachines}</td>
              </tr>
              <tr>
                <td className="text-right font-semibold">Machines Running</td>
                <td className="text-center font-semibold">:</td>
                <td className="text-left">{data.machinesRunning}</td>
              </tr>
              <tr>
                <td className="text-right font-semibold">Machines Fault</td>
                <td className="text-center font-semibold">:</td>
                <td className="text-left">{data.machinesFault}</td>
              </tr>
              <tr>
                <td className="text-right font-semibold">Machines Idle</td>
                <td className="text-center font-semibold">:</td>
                <td className="text-left">{data.machinesIdle}</td>
              </tr>
              <tr>
                <td className="text-right font-semibold">
                  Machines with Error
                </td>
                <td className="text-center font-semibold">:</td>
                <td className="text-left">{data.machinesWithError}</td>
              </tr>
              <tr>
                <td className="text-right font-semibold">Shift Time</td>
                <td className="text-center font-semibold">:</td>
                <td className="text-left">{selectedShift}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="color-options ml-auto flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-green-500 w-8 h-8 cursor-pointer border border-black"></div>
            <span className="font-semibold">Running</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-yellow-500 w-8 h-8 cursor-pointer border border-black"></div>
            <span className="font-semibold">Idle</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-red-500 w-8 h-8 cursor-pointer border border-black"></div>
            <span className="font-semibold">Alarm</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-500 w-8 h-8 cursor-pointer border border-black"></div>
            <span className="font-semibold">Comm. error</span>
          </div>
        </div>
      </div>

      <div className="button-container mt-4 flex justify-end space-x-2">
        <button
          className="bg-red-500 text-center text-sm hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleIdleAlarm}
        >
          Alarm/Idle Time
        </button>
        <button
          className="bg-blue-500 text-center text-sm hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleEditShiftTime}
        >
          Edit Shift Time
        </button>
      </div>

      <div className="machine-list mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ">
        {data.machineInfo.map((machine, index) => (
          <div
            key={index}
            className="machine bg-white rounded-md p-4 cursor-pointer hover:shadow-lg w-full md:w-80 lg:w-96" // Adjust the width here
            onClick={() => handleMachineClick(machine)}
          >
            <h2 className="text-lg font-semibold">
              Machine Name: {machine.machineName}
            </h2>
            <p className="text-gray-600">Prod: {machine.prod}</p>
          </div>
        ))}
      </div>


      {/* Render modals conditionally */}
      {selectedMachine && <MachineModal machine={selectedMachine} />}
      {showEditShiftModal && <EditShiftModal />}
    </div>
  );
};

export default UserApp;
