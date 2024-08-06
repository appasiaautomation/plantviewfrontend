import React from "react";

const MachineList = ({ machines, Status, onMachineClick }) => {
  const getBackgroundColor = (status) => {
    switch (status) {
      case "Communication Error":
        return "bg-gray-500";
      case "Running":
        return "bg-green-500";
      case "Alarm":
        return "bg-red-950";
      case "Idle":
        return "bg-yellow-500";
      case "Setup Mode":
        return "bg-red-950";
      case "Machine Break Down":
        return "bg-red-950";
      case "No Operator/Material/Load":
        return "bg-red-950";
      default:
        return "bg-white";
      
    }
  };

  return (
    <div className="machine-list mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
      {machines.map((machine, index) => {
        const statusData = Status.find(status => status.deviceId === machine.deviceId);
        const status = statusData ? statusData.status : "Unknown";
        const prod = statusData ? statusData.jobs : "N/A";

        return (
          <div
            key={index}
            className={`machine ${getBackgroundColor(status)} rounded-md p-4 cursor-pointer hover:shadow-lg`}
            onClick={() => onMachineClick(machine)}
          >
            <h2 className="text-lg font-semibold">Machine Name: {machine.machineName}</h2>
            <p className="text-gray-600">Prod: {prod}</p>
            <p className="text-gray-600">Status: {status}</p>
          </div>
        );
      })}
    </div>
  );
};

export default MachineList;
