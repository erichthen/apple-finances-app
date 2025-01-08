import React from "react";
import FinancialTable from "./FinancialTable";

const App = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Financial Data Table</h1>
      <FinancialTable />
    </div>
  );
};

export default App;