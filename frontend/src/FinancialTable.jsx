import React, { useState, useEffect, useRef } from "react";

const API_URL = "http://127.0.0.1:5000/api/data";

const FinancialTable = () => {
  const [data, setData] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [currentSort, setCurrentSort] = useState("Date: Descending");
  const dropdownRef = useRef(null);

  //to keep track of the final filter request for the fetch
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [minRevenue, setMinRevenue] = useState("");
  const [maxRevenue, setMaxRevenue] = useState("");
  const [minNetIncome, setMinNetIncome] = useState("");
  const [maxNetIncome, setMaxNetIncome] = useState("");

  //to keep track of the temorary values stored in the filter input fields
  const [tempStartYear, setTempStartYear] = useState("");
  const [tempEndYear, setTempEndYear] = useState("");
  const [tempMinRevenue, setTempMinRevenue] = useState("");
  const [tempMaxRevenue, setTempMaxRevenue] = useState("");
  const [tempMinNetIncome, setTempMinNetIncome] = useState("");
  const [tempMaxNetIncome, setTempMaxNetIncome] = useState("");

  const [filterOpen, setFilterOpen] = useState(false);
  const [infoPopup, setInfoPopup] = useState(null);
  const [isResetClicked, setIsResetClicked] = useState(false);

  const [loading, setLoading] = useState(true); 

  //this map is used to map the sort types to the API URL args
  //the keys are also used to render the sorting dropdown 
  const sortMappings = {
    "Date: Descending": { sortBy: "Date", sortOrder: "desc" },
    "Date: Ascending": { sortBy: "Date", sortOrder: "asc" },
    "Revenue: Ascending": { sortBy: "Revenue", sortOrder: "asc" },
    "Revenue: Descending": { sortBy: "Revenue", sortOrder: "desc" },
    "Net Income: Ascending": { sortBy: "NetIncome", sortOrder: "asc" },
    "Net Income: Descending": { sortBy: "NetIncome", sortOrder: "desc" },
  };

  
  //values are used for the definitions, keys are used to set up the table
  //values have two items to make it easier to bold the first word in the definition
  const columnInfo = {
    "Date": [],
    "Revenue": ["Revenue", "is the amount of money a company makes before any expenses are deducted."],
    "Net Income": ["Net Income", "is a company's profit after deducting all forms of expenses from its revenue."],
    "Gross Profit": ["Gross Profit", "is a company's profit after deducting the direct costs of its goods and services from its revenue."],
    "EPS": ["Earnings Per Share", "(EPS) reflects how much profit is earned for each outstanding share of its stock."],
    "Operating Income": ["Operating Income", "is a company's profit after deducting operating expenses (salaries, rent, advertising, etc.) from its revenue."],
  };


  //data fetch and request with sorting and filter args everytime inputs change
  useEffect(() => {
    const { sortBy, sortOrder } = sortMappings[currentSort];
    let query = `?sortBy=${sortBy}&sortOrder=${sortOrder}`;
    if (startYear) query += `&startYear=${startYear}`;
    if (endYear) query += `&endYear=${endYear}`;
    if (minRevenue) query += `&minRevenue=${minRevenue}`;
    if (maxRevenue) query += `&maxRevenue=${maxRevenue}`;
    if (minNetIncome) query += `&minNetIncome=${minNetIncome}`;
    if (maxNetIncome) query += `&maxNetIncome=${maxNetIncome}`;
  
    setLoading(true); 
  
    fetch(`${API_URL}${query}`)
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData); 
        setLoading(false); 
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false); 
      });
  }, [currentSort, startYear, endYear, minRevenue, maxRevenue, minNetIncome, maxNetIncome]);

  //closes the sorting dropdown when user clicks outside of it
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
    <div
      className="flex flex-col items-center min-h-screen overflow-y-auto mt-16" style={{ backgroundColor: "#FFFCF6", }}>
      <h1 className="text-2xl font-bold mb-10 text-center"> Recent Income Statements <br /> of Apple Inc.<br /></h1>
      <div className="w-full max-w-6xl px-4 relative">
        {/*sort toggle, icon, dropdown div*/}
        <div className="flex justify-start items-center gap-4 mb-1">
          <div className="relative" ref={dropdownRef}>
            <div
              className="font-bold cursor-pointer hover:underline flex items-center mb-1"
              onClick={(e) => {
                //isolate the click event listener to the dropdown 
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
            >
              <img src="/sort.png" alt="Sort Icon" className="w-5 h-5 mr-0" />
              <span>{currentSort}</span>
            </div>
            {dropdownOpen && (
              <ul className="absolute bg-white border border-gray-300 rounded shadow-md mt-1 w-48 text-left z-50">
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
                    {option === currentSort && (
                      <span className="text-blue-500">✓</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <div className="mb-6 overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-black">
            <thead>
              <tr>
                //map the keys (metrics) to be table headers with an info button
                {Object.keys(columnInfo).map((key) => (
                  <th
                    key={key}
                    className="border border-black px-4 py-2 text-center whitespace-nowrap"
                  >
                    <div className="flex justify-center items-center space-x-2">
                      <span className="flex-shrink-0">{key}</span>
                      {key !== "Date" && (
                        <button
                          className="flex-shrink-0 ml-2"
                          onClick={() => setInfoPopup(key)}
                        >
                          <img src="/info.png" alt="Info" className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={Object.keys(columnInfo).length}
                    className="text-center px-4 py-8"
                  >
                    Loading data...
                  </td>
                </tr>
              ) : data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-200">
                    <td className="border border-black px-4 py-2 text-center whitespace-nowrap">
                      {item.Date}
                    </td>
                    <td className="border border-black px-4 py-2 text-center whitespace-nowrap">
                      {item.Revenue.toLocaleString()}
                    </td>
                    <td className="border border-black px-4 py-2 text-center whitespace-nowrap">
                      {item.NetIncome.toLocaleString()}
                    </td>
                    <td className="border border-black px-4 py-2 text-center whitespace-nowrap">
                      {item.GrossProfit.toLocaleString()}
                    </td>
                    <td className="border border-black px-4 py-2 text-center whitespace-nowrap">
                      {item.EPS}
                    </td>
                    <td className="border border-black px-4 py-2 text-center whitespace-nowrap">
                      {item.OperatingIncome.toLocaleString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={Object.keys(columnInfo).length}
                    className="text-center px-4 py-8"
                  >
                    No data matches your filtering.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="relative flex items-center gap-4 flex-wrap -mt-4">
          <div
            className="font-bold cursor-pointer hover:underline flex items-center ml-1"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <img
              src="/filter.png"
              alt="Filter Icon"
              className="w-3 h-3 mr-1 -mt-1"
            />
            <span className="-mt-1">Filter</span>
          </div>
          <div
            className={`flex items-center gap-2 flex-wrap transition-opacity duration-300 ${
              filterOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <input
              type="text"
              value={tempStartYear}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setTempStartYear(value);
              }}
              placeholder="Start Year"
              style={{ fontSize: "14px" }}
              className="w-24 border border-black rounded px-2 py-1"
            />
            <input
              type="text"
              value={tempEndYear}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setTempEndYear(value);
              }}
              placeholder="End Year"
              style={{ fontSize: "14px" }}
              className="w-24 border border-black rounded px-2 py-1"
            />
            <input
              type="text"
              value={tempMinRevenue}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setTempMinRevenue(value);
              }}
              placeholder="Min Revenue"
              style={{ fontSize: "14px" }}
              className="w-28 border border-black rounded px-2 py-1"
            />
            <input
              type="text"
              value={tempMaxRevenue}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setTempMaxRevenue(value);
              }}
              placeholder="Max Revenue"
              style={{ fontSize: "14px" }}
              className="w-28 border border-black rounded px-2 py-1"
            />
            <input
              type="text"
              value={tempMinNetIncome}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setTempMinNetIncome(value);
              }}
              placeholder="Min Net Income"
              style={{ fontSize: "14px" }}
              className="w-32 border border-black rounded px-2 py-1"
            />
            <input
              type="text"
              value={tempMaxNetIncome}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                setTempMaxNetIncome(value);
              }}
              placeholder="Max Net Income"
              style={{ fontSize: "14px" }}
              className="w-32 border border-black rounded px-2 py-1"
            />
            <button
              onClick={() => {
                setStartYear(tempStartYear);
                setEndYear(tempEndYear);
                setMinRevenue(tempMinRevenue);
                setMaxRevenue(tempMaxRevenue);
                setMinNetIncome(tempMinNetIncome);
                setMaxNetIncome(tempMaxNetIncome);
              }}
              className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 font-bold ml-2 mr-0"
            >
              Apply
            </button>
            <button
              onClick={() => {
                setStartYear("");
                setEndYear("");
                setMinRevenue("");
                setMaxRevenue("");
                setMinNetIncome("");
                setMaxNetIncome("");
                setTempStartYear("");
                setTempEndYear("");
                setTempMinRevenue("");
                setTempMaxRevenue("");
                setTempMinNetIncome("");
                setTempMaxNetIncome("");
              }}
              className={`font-bold ml-0 px-3 py-1 rounded text-white ${
                isResetClicked ? "bg-red-600" : "bg-gray-500 hover:bg-gray-400"
              }`}
              style={{
                transition: "background-color 200ms ease",
              }}
            >
              Reset
            </button>
          </div>
        </div>
        {infoPopup && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-12 w-full max-w-md text-center">
            <p>
              <strong>{columnInfo[infoPopup][0]}</strong>{" "}
              {columnInfo[infoPopup][1]}
            </p>
            <button
              onClick={() => setInfoPopup(null)}
              className="bg-black text-white px-3 py-1 rounded hover:bg-gray-800 mt-5 block mx-auto font-bold"
            >
              Got it
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
};

export default FinancialTable;