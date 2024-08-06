import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";

const EditShiftModal = ({ shifts, saveShifts, closeModal, deleteShift }) => {
  const [localShifts, setLocalShifts] = useState(shifts);

  const handleAddShift = () => {
    if (localShifts.length >= 3) {
      alert("You can add upto only 3 shifts");
    } else {
      setLocalShifts([
        ...localShifts,
        { shiftName: "", shiftStart: "", shiftEnd: "" },
      ]);
    }
  };

  useEffect(() => {
    setLocalShifts(shifts);
    //console.log(shifts[0].shiftName);
  }, [shifts]);

  const handleShiftInputChange = (e, index, type) => {
    const updatedShifts = [...localShifts];
    updatedShifts[index][type] = e.target.value;
    setLocalShifts(updatedShifts);
  };

  const handleSaveChanges = async () => {
    const isOverlapping = (shift1, shift2) => {
      const shift1Start = new Date(`1970-01-01T${shift1.shiftStart}`).getTime();
      let shift1End = new Date(`1970-01-01T${shift1.shiftEnd}`).getTime();
      const shift2Start = new Date(`1970-01-01T${shift2.shiftStart}`).getTime();
      let shift2End = new Date(`1970-01-01T${shift2.shiftEnd}`).getTime();

      //if (shift1End < shift1Start) shift1End += 24 * 60 * 60 * 1000; // shift1 spans midnight
      //if (shift2End < shift2Start) shift2End += 24 * 60 * 60 * 1000; // shift2 spans midnight

      return (
        (shift1Start < shift2End && shift1Start >= shift2Start) ||
        (shift1End > shift2Start && shift1End <= shift2End) ||
        (shift2Start < shift1End && shift2Start >= shift1Start) ||
        (shift2End > shift1Start && shift2End <= shift1End)
      );
    };

    if (localShifts.length === 1) {
      await saveShifts(localShifts);
      closeModal();
    } else if (localShifts.length === 2) {
      if (isOverlapping(localShifts[0], localShifts[1])) {
        alert("Shifts are overlapping");
      } else {
        await saveShifts(localShifts);
        closeModal();
      }
    } else if (localShifts.length === 3) {
      if (
        isOverlapping(localShifts[0], localShifts[1]) ||
        isOverlapping(localShifts[0], localShifts[2]) ||
        isOverlapping(localShifts[1], localShifts[2]) ||
        isOverlapping(localShifts[2], localShifts[0])
      ) {
        alert("Shifts are overlapping");
      } else {
        await saveShifts(localShifts);
        closeModal();
      }
    }
  };

  const handleDeleteShift = async (index) => {
    if (window.confirm("Are you sure you want to delete this shift?")) {
      const shiftToDelete = localShifts[index];
      if (shiftToDelete && shiftToDelete.srNo !== undefined) {
        // If SrNo exists, delete the shift
        await deleteShift(shiftToDelete.srNo);
      }
      // Remove the shift from localShifts
      const updatedShifts = localShifts.filter((_, i) => i !== index);
      setLocalShifts(updatedShifts);
    }
  };

  return (
    <div
      className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center z-50"
      onClick={closeModal}
    >
      <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>
      <div
        className="modal-container bg-white w-full md:max-w-xl mx-auto rounded shadow-lg z-50 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content py-4 text-left px-6 relative">
          <button
            className="close absolute top-0 right-0 mt-2 mr-4 cursor-pointer text-black text-2xl hover:text-gray-700"
            onClick={closeModal}
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
              {localShifts.map((shift, index) => (
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

export default EditShiftModal;
