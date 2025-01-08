import React, { useState, useEffect } from "react";

const API_URL = "http://127.0.0.1:5000/api/data";

const FinancialTable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(API_URL)
            .then((response) => response.json()) //parse json into JS object
            .then((data) => setData(data)) //set the data
        .catch((error) => console.error("Error fetching data: ", error));
    }, []);

    return (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Revenue</th>
              <th>Gross Profit</th>
              <th>Net Income</th>
              <th>EPS</th>
              <th>Operating Income</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.date}</td>
                <td>{item["Revenue"]}</td>
                <td>{item["Gross Profit"]}</td>
                <td>{item["Net Income"]}</td>
                <td>{item["EPS"]}</td>
                <td>{item["Operating Income"]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
};
    
export default FinancialTable;