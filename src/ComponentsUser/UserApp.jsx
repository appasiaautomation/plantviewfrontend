import React, { useState, useEffect } from "react";
import "./tailwind.css";
import { useLocation, useNavigate } from "react-router-dom";
import MachineModal from "./MachineModal";
import EditShiftModal from "./EditShiftModal";
import MachineList from "./MachineList";
import Dashboard from "./Dashboard";

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
  const [devices, setDevices] = useState([]);
  const [shiftIntervals, setShiftIntervals] = useState([]);
  const [shiftStart, setShiftStart] = useState("");
  const [shiftEnd, setShiftEnd] = useState("");
  const [shifts, setShifts] = useState([]);
  const [deviceIds, setDeviceIds] = useState([]);
  const [latestStatus, setLatestStatus] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    const fetchDevicesAndShifts = async () => {
      try {
        // Fetch devices
        const devicesResponse = await fetch(
          `/user/getUserDevices?userName=${userName}`
        );
        if (!devicesResponse.ok)
          throw new Error("Failed to fetch user devices");
        const devicesData = await devicesResponse.json();
        setDeviceIds(devicesData.map((device) => device.deviceId));
        setDevices(devicesData);
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

        // Fetch shifts
        const shiftsResponse = await fetch(
          `/user/userShift?userName=${userName}`
        );
        if (!shiftsResponse.ok) throw new Error("Failed to fetch user shifts");
        const shiftsData = await shiftsResponse.json();
        setShifts(shiftsData);
        const currentHour = getCurrentTimeFormatted();

        const matchingShift = shiftsData.find((shift) => {
          let startHour = shift.shiftStart;
          let endHour = shift.shiftEnd;
          if (shift.shiftEnd <= shift.shiftStart) {
            endHour = 24 + endHour;
          }
          return currentHour >= startHour && currentHour <= endHour;
        });
        console.table(matchingShift);
        if (matchingShift) {
          //console.log(convertTimeToISO(matchingShift.shiftStart))
          setShiftStart(convertTimeToISO(matchingShift.shiftStart, false));
          setShiftEnd(convertTimeToISO(matchingShift.shiftEnd, true));
          const intervals = generateHourlyIntervals(
            matchingShift.shiftStart,
            matchingShift.shiftEnd
          );
          setShiftIntervals(intervals);
          setSelectedShift(
            `${convertTo12HourFormat(
              matchingShift.shiftStart
            )} - ${convertTo12HourFormat(matchingShift.shiftEnd)}`
          );
        } else {
          setSelectedShift("12:00 AM - 11:59 PM");
          setShiftStart(convertTimeToISO("00:00:00", false));
          setShiftEnd(convertTimeToISO("23:59:00", true));
          const intervals = generateHourlyIntervals("00:00:00", "23:59:00");
          setShiftIntervals(intervals);
        }
      } catch (error) {
        console.error("Error fetching devices or shifts:", error);
      }
    };

    fetchDevicesAndShifts();
  }, [userName, userLocation, plantName]);

  const getCurrentTimeFormatted = () => {
    const date = new Date();
    return date.toLocaleTimeString("en-GB", { hour12: false });
  };

  useEffect(() => {
    if (deviceIds.length > 0 && shiftStart && shiftEnd) {
      const fetchAllLatest = async () => {
        const latestData = [];
        let machinesRunning = 0;
        let machinesIdle = 0;
        let machinesFault = 0;
        let machinesWithError = 0;

        for (const deviceId of deviceIds) {
          const data = await fetchLatest(deviceId);
          latestData.push(data);
          switch (data.status) {
            case "Running":
              machinesRunning++;
              break;
            case "Idle":
              machinesIdle++;
              break;
            case "Alarm":
              machinesFault++;
              break;
            case "Communication Error":
              machinesWithError++;
              break;
            case "Setup Mode":
              machinesFault++;
              break;
            case "Machine Break Down":
              machinesFault++;
              break;
            case "No Operator/Material/Load":
              machinesFault++;
              break;
            default:
              break;
          }
        }
        setLatestStatus(latestData);
        setData((prevData) => ({
          ...prevData,
          machinesRunning,
          machinesIdle,
          machinesFault,
          machinesWithError,
        }));
        setLastUpdated(new Date().toLocaleTimeString());
      };

      const interval = setInterval(fetchAllLatest, 10000);
      fetchAllLatest(); // Initial fetch
      return () => clearInterval(interval);
    }
  }, [deviceIds, shiftStart, shiftEnd]);

  async function fetchLatest(deviceId) {
    try {
      const response = await fetch(
        `/user/getStatus/${deviceId}?shiftStart=${shiftStart}&shiftEnd=${shiftEnd}`
      );
      //console.log(`/user/getStatus/${deviceId}?shiftStart=${shiftStart}&shiftEnd=${shiftEnd}`);
      if (!response.ok) {
        throw new Error("Failed to fetch fields");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `Error fetching latest status for device ${deviceId}:`,
        error.message
      );
      return null;
    }
  }

  const fetchUserShifts = async () => {
    try {
      const response = await fetch(`/user/userShift?userName=${userName}`);
      if (response.ok) {
        const shiftsData = await response.json();
        setData((prevData) => ({
          ...prevData,
          shiftTimes: shiftsData,
        }));
        setShifts(shiftsData);
        return shiftsData;
      } else {
        console.error("Failed to fetch user shifts");
      }
    } catch (error) {
      console.error("Error fetching user shifts:", error);
    }
  };

  const deleteShift = async (shiftId) => {
    try {
      const response = await fetch(`/user/deleteShift?SrNo=${shiftId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        let message = await response.text();
        alert(message);
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
      setData((prevData) => ({
        ...prevData,
        shiftTimes: data1,
      }));
    }
    setShowEditShiftModal(true);
  };

  const closeEditShiftModal = () => {
    setShowEditShiftModal(false);
  };

  const saveShifts = async (shifts) => {
    try {
      for (let shift of shifts) {
        if (shift.srNo) {
          await fetch(`/user/updatePlantShift/${shift.srNo}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(shift),
          });
        } else {
          await fetch(`/user/User7/addPlantShifts`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(shift),
          });
        }
      }
      fetchUserShifts();
      alert("Shift Saved successfully!");
    } catch (error) {
      console.error("Error updating shifts:", error);
    }
  };

  const generateHourlyIntervals = (start, end) => {
    let intervals = [];
    const startHour = parseInt(start.split(":")[0]);
    const endHour = parseInt(end.split(":")[0]);
    const startHourMinutes = parseInt(start.split(":")[1]);
    const endHourMinutes = parseInt(end.split(":")[1]);
    const currentHour = new Date().getHours();

    if (start <= end) {
      // Shift within the same day
      for (
        let hour = startHour;
        hour < endHour && hour <= currentHour;
        hour++
      ) {
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

  function convertTimeToISO(time, isEndShift) {
    const today = new Date();
    const now = new Date(); // Get the current date and time
    const [hours, minutes, seconds] = time.split(":").map(Number);
    today.setHours(hours);
    today.setMinutes(minutes);
    today.setSeconds(seconds);
    today.setMilliseconds(0);
    if (isEndShift && today <= now) {
      today.setDate(today.getDate() + 1);
    }
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const isoString = `${year}-${month}-${day}T${String(hours).padStart(
      2,
      "0"
    )}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
    return isoString;
  }

  const convertTo12HourFormat = (time) => {
    const [hour, minute] = time.split(":").map(Number);
    const adjustedHour = hour % 12 || 12;
    const period = hour >= 12 ? "PM" : "AM";
    return `${adjustedHour}:${minute < 10 ? `0${minute}` : minute} ${period}`;
  };

  return (
    <div className="App bg-gray-200 min-h-screen p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl text-gray-800 flex-grow text-center">
          {data.plantName}
        </h1>
      </div>
      <div className="flex justify-start mb-4">
        <p className="text-black-600 font-bold">
          Last Updated : {new Date().toLocaleDateString("en-GB")} {lastUpdated}
        </p>
      </div>
      <div className="color-options mt-2 flex justify-center space-x-4 ">
        <div className="flex items-center space-x-2">
          <span className="font-semibold"> Running</span>
          <div className="bg-green-500 w-8 h-8 cursor-pointer border border-black"></div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold"> Idle</span>
          <div className="bg-yellow-500 w-8 h-8 cursor-pointer border border-black"></div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold"> Alarm</span>
          <div className="bg-red-950 w-8 h-8 cursor-pointer border border-black"></div>
        </div>
        <div className="flex items-center space-x-2">
          <span className="font-semibold"> Comm. error</span>
          <div className="bg-gray-500 w-8 h-8 cursor-pointer border border-black"></div>
        </div>
      </div>
      <div className="button-container flex justify-end space-x-2">
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
      <Dashboard
        data={data}
        selectedShift={selectedShift}
        onIdleAlarm={handleIdleAlarm}
        onEditShiftTime={handleEditShiftTime}
      />
      <MachineList
        machines={data.machineInfo}
        Status={latestStatus}
        onMachineClick={handleMachineClick}
      />

      {selectedMachine && (
        <MachineModal
          machine={selectedMachine}
          closeModal={() => setSelectedMachine(null)}
          shiftIntervals={shiftIntervals}
          shiftStart={shiftStart}
          shiftEnd={shiftEnd}
          latestStatus={latestStatus.find(
            (status) => status.deviceId === selectedMachine.deviceId
          )}
          deviceId={selectedMachine.deviceId}
          shifts={shifts}
        />
      )}
      {showEditShiftModal && (
        <EditShiftModal
          shifts={data.shiftTimes}
          saveShifts={saveShifts}
          closeModal={closeEditShiftModal}
          deleteShift={deleteShift}
        />
      )}
    </div>
  );
};

export default UserApp;
