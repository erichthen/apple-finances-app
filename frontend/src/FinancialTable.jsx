import React, { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:5000/api/data";

const FinancialTable = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json()) // Parse JSON into JS object
      .then((data) => setData(data)) // Set the data
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
  <div className="w-full max-w-6xl text-center px-4">
    <h1 className="text-2xl font-bold mb-6">Financial Analytics of Apple</h1>
    <table className="table-auto w-full border-collapse border border-gray-300">
      <thead>
        <tr>
          <th className="border border-gray-300 px-4 py-2 text-center">Date</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Revenue</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Gross Profit</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Net Income</th>
          <th className="border border-gray-300 px-4 py-2 text-center">EPS</th>
          <th className="border border-gray-300 px-4 py-2 text-center">Operating Income</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index} className="hover:bg-gray-200">
            <td className="border border-gray-300 px-4 py-2">{item.date}</td>
            <td className="border border-gray-300 px-4 py-2">{item["Revenue"]}</td>
            <td className="border border-gray-300 px-4 py-2">{item["Gross Profit"]}</td>
            <td className="border border-gray-300 px-4 py-2">{item["Net Income"]}</td>
            <td className="border border-gray-300 px-4 py-2">{item["EPS"]}</td>
            <td className="border border-gray-300 px-4 py-2">{item["Operating Income"]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
  );
};

export default FinancialTable;