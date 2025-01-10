import React, { useState, useEffect, useRef } from "react";

const API_URL = "http://127.0.0.1:5000/api/data";

const FinancialTable = () => {
  const [data, setData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("Date: Descending");
  const dropdownRef = useRef(null);

  const sortMappings = {
    "Date: Descending": { sortBy: "Date", sortOrder: "desc" },
    "Date: Ascending": { sortBy: "Date", sortOrder: "asc" },
    "Revenue: Ascending": { sortBy: "Revenue", sortOrder: "asc" },
    "Revenue: Descending": { sortBy: "Revenue", sortOrder: "desc" },
    "Net Income: Ascending": { sortBy: "NetIncome", sortOrder: "asc" },
    "Net Income: Descending": { sortBy: "NetIncome", sortOrder: "desc" },
  };

  useEffect(() => {
    const { sortBy, sortOrder } = sortMappings[currentSort];
    const query = `?sortBy=${sortBy}&sortOrder=${sortOrder}`;

    fetch(`${API_URL}${query}`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, [currentSort]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-6xl px-4">
        <div className="flex justify-start mb-4">
          <div className="relative" ref={dropdownRef}>
            <div
              className="font-bold cursor-pointer hover:underline flex items-center"
              onClick={(e) => {
                e.stopPropagation(); // Prevent click event from propagating to document
                setDropdownOpen(!dropdownOpen);
              }}
            >
              <img
                src="/sort.png"
                alt="Sort Icon"
                className="w-4 h-4 mr-2"
              />
              <span>{currentSort}</span>
            </div>
            {dropdownOpen && (
              <ul className="absolute bg-white border border-gray-300 rounded shadow-md mt-1 w-48 text-left">
                {Object.keys(sortMappings).map((option) => (
                  <li
                    key={option}
                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setCurrentSort(option);
                      setDropdownOpen(false);
                    }}
                  >
                    <span>{option}</span>
                    {option === currentSort && <span className="text-blue-500">✓</span>}
                  </li>
                ))}
              </ul>
            )}
            </div>
          <div>
          <div className="ml-auto">
    <div
      className="font-bold cursor-pointer hover:underline flex items-center"
      onClick={() => setFilterOpen(true)} // Open the filter popup
    >
      <img src="/filter.png" alt="Filter Icon" className="w-4 h-4 ml-10 mr-1" />
      <span>Filter</span>
    </div>
  </div>
        </div>
        </div>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">Date</th>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">Revenue</th>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">Gross Profit</th>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">Net Income</th>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">EPS</th>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">Operating Income</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-200">
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item.Date}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item["Revenue"].toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item["GrossProfit"].toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item["NetIncome"].toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item["EPS"]}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item["OperatingIncome"].toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center px-4 py-2" colSpan="6">No data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FinancialTable;