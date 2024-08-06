import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
//import { PieChart } from '@mui/x-charts';

const COLORS = {
  running: "#008000",
  fault: "#FF0000",
  idle: "#FFBB28",
  error: "#808080",
};

const Dashboard = ({ data, selectedShift, onIdleAlarm, onEditShiftTime }) => {
  const pieData = [
    {
      name: "Machines Running",
      value: data.machinesRunning,
      color: COLORS.running,
    },
    { name: "Machines Fault", value: data.machinesFault, color: COLORS.fault },
    {
      name: "Machines with Error",
      value: data.machinesWithError,
      color: COLORS.error,
    },
    { name: "Machines Idle", value: data.machinesIdle, color: COLORS.idle },
  ];

  return (
    <div className="flex">
      <div className="dashboard flex justify-left  mt-0">
        {/* Pie Chart */}
        <PieChart width={400} height={300}>
          <Pie
            data={pieData}
            cx={180}
            cy={100}
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            //label={({ name, value }) => `${name}: ${value}`}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </div>
      <div className="flex justify-left w-full">
        {/* Table */}
        <div className="w-full md:w-1/2">
          <table className="w-full ml-4 mt-10">
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
                  Machines Comm. Error
                </td>
                <td className="text-center font-semibold">:</td>
                <td className="text-left">{data.machinesWithError}</td>
              </tr>
              <tr>
                <td className="text-right font-semibold">Shift Time</td>
                <td className="text-center font-semibold">:</td>
                <td className="text-left">{selectedShift}</td>
              </tr>
              {/* <tr>
              <td>
                <div className="button-container mt-4 flex justify-end space-x-2">
                  
                </div>
              </td>
            </tr> */}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
