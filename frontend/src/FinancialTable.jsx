import React, { useState, useEffect, useRef } from "react";

const API_URL = "http://127.0.0.1:5000/api/data";

const FinancialTable = () => {
  const [data, setData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("Date: Descending");
  const dropdownRef = useRef(null);
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [minRevenue, setMinRevenue] = useState("");
  const [maxRevenue, setMaxRevenue] = useState("");
  const [minNetIncome, setMinNetIncome] = useState("");
  const [maxNetIncome, setMaxNetIncome] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const sortMappings = {
    "Date: Descending": { sortBy: "Date", sortOrder: "desc" },
    "Date: Ascending": { sortBy: "Date", sortOrder: "asc" },
    "Revenue: Ascending": { sortBy: "Revenue", sortOrder: "asc" },
    "Revenue: Descending": { sortBy: "Revenue", sortOrder: "desc" },
    "Net Income: Ascending": { sortBy: "NetIncome", sortOrder: "asc" },
    "Net Income: Descending": { sortBy: "NetIncome", sortOrder: "desc" },
  };

  useEffect(() => {
    //dynamically build the query string based on the sorting and filtering parameters
    const { sortBy, sortOrder } = sortMappings[currentSort];
    let query = `?sortBy=${sortBy}&sortOrder=${sortOrder}`;

    if (startYear) query += `&startYear=${startYear}`;
    if (endYear) query += `&endYear=${endYear}`;
    if (minRevenue) query += `&minRevenue=${minRevenue}`;
    if (maxRevenue) query += `&maxRevenue=${maxRevenue}`;
    if (minNetIncome) query += `&minNetIncome=${minNetIncome}`;
    if (maxNetIncome) query += `&maxNetIncome=${maxNetIncome}`;

    fetch(`${API_URL}${query}`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error("Error fetching data: ", error));
  }, [currentSort, startYear, endYear, minRevenue, maxRevenue, minNetIncome, maxNetIncome]);

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
        <div className="flex justify-start items-center gap-4 mb-2">
          <div className="relative" ref={dropdownRef}>
            <div
              className="font-bold cursor-pointer hover:underline flex items-center"
              onClick={(e) => {
                e.stopPropagation(); // Prevent click event from propagating to document
                setDropdownOpen(!dropdownOpen);
              }}
            >
              <img src="/sort.png" alt="Sort Icon" className="w-5 h-5 mr-0" />
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
        </div>
        <div className="overflow-x-auto mb-4">
          <table className="table-auto w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">
                  <div className="flex justify-center items-center">
                    <span>Date</span>
                  </div>
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">
                  <div className="flex justify-center items-center">
                    <span>Revenue</span>
                    <button className="ml-2">
                      <img src="/info.png" alt="Info" className="w-4 h-4" />
                    </button>
                  </div>
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">
                  <div className="flex justify-center items-center">
                    <span>Gross Profit</span>
                    <button className="ml-2">
                      <img src="/info.png" alt="Info" className="w-4 h-4" />
                    </button>
                  </div>
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">
                  <div className="flex justify-center items-center">
                    <span>Net Income</span>
                    <button className="ml-2">
                      <img src="/info.png" alt="Info" className="w-4 h-4" />
                    </button>
                  </div>
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">
                  <div className="flex justify-center items-center">
                    <span>EPS</span>
                    <button className="ml-2">
                      <img src="/info.png" alt="Info" className="w-4 h-4" />
                    </button>
                  </div>
                </th>
                <th className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">
                  <div className="flex justify-center items-center">
                    <span>Operating Income</span>
                    <button className="ml-2">
                      <img src="/info.png" alt="Info" className="w-4 h-4" />
                    </button>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-200">
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item.Date}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item["Revenue"].toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item["NetIncome"].toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item["GrossProfit"].toLocaleString()}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item["EPS"]}</td>
                    <td className="border border-gray-300 px-4 py-2 text-center whitespace-nowrap">{item["OperatingIncome"].toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="text-center px-4 py-2" colSpan="6">No data falls within your filter.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Filter Section */}
        <div className="flex items-center gap-4">
          <div
            className="font-bold cursor-pointer hover:underline flex items-center -mt-2 ml-1"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <img src="/filter.png" alt="Filter Icon" className="w-3 h-3 mr-1" />
            <span>Filter</span>
          </div>
          {filterOpen && (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={startYear}
                onChange={(e) => {
                  //I don't want spinner controls (default with type="number", but I do need digit validation)
                  const value = e.target.value.replace(/[^0-9]/g, ""); 
                  setStartYear(value);
                }}
                placeholder="Start Year"
                style={{fontSize: "14px"}}
                className="w-24 border rounded px-2 py-1"
              />
              <input
                type="text"
                value={endYear}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); 
                  setEndYear(value);
                }}
                placeholder="End Year"
                style={{fontSize: "14px"}}
                className="w-24 border rounded px-2 py-1"
              />
              <input
                type="text"
                value={minRevenue}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); 
                  setMinRevenue(value);
                }}
                placeholder="Min Revenue"
                style={{fontSize: "14px"}}
                className="w-28 border rounded px-2 py-1"
              />
              <input
                type="text"
                value={maxRevenue}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); 
                  setMaxRevenue(value);
                }}
                placeholder="Max Revenue"
                style={{fontSize: "14px"}}
                className="w-28 border rounded px-2 py-1"
              />
              <input
                type="text"
                value={minNetIncome}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); 
                  setMinNetIncome(value);
                }}
                placeholder="Min Net Income"
                style={{fontSize: "14px"}}
                className="w-32 border rounded px-2 py-1"
              />
              <input
                type="text"
                value={maxNetIncome}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, ""); 
                  setMaxNetIncome(value);
                }}
                placeholder="Max Net Income"
                style={{fontSize: "14px"}}
                className="w-32 border rounded px-2 py-1"
              />
              <button onClick={() => setFilterOpen(false)} 
                style={{ fontSize: "14px" }} 
                className="bg-black text-white px-3 py-1 rounded ml-2">Apply</button>
              <button
                onClick={() => {
                  setFilterOpen(false);
                  setStartYear("");
                  setEndYear("");
                  setMinRevenue("");
                  setMaxRevenue("");
                  setMinNetIncome("");
                  setMaxNetIncome("");
                }}
                style={{ fontSize: "14px" }}
                className="bg-gray-500 text-white px-3 py-1 rounded">Reset</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

};

export default FinancialTable;