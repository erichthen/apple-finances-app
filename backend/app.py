from flask import Flask, jsonify, request
import os
from dotenv import load_dotenv
import requests
from flask_cors import CORS

app = Flask(__name__)
#allow cross origin requests from any origin ()
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

load_dotenv()

FMP_API_KEY = os.getenv("FMP_API_KEY")

@app.route("/api/data", methods=["GET"])
def get_data():
    url = f"https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey={FMP_API_KEY}"

    try:
        #send request to url, returns data and http status code
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()

        #build another list of dictionaries, extracting only the fields we will display
        data_table = [
            {
                "Date": item["date"],
                "Revenue": item["revenue"],
                "NetIncome": item["netIncome"],
                "GrossProfit": item["grossProfit"],
                "EPS": item["eps"],
                "OperatingIncome": item["operatingIncome"]
            }
            for item in data
        ]
        

        #get filter parameters from the request (url arg)
        start_year = request.args.get("startYear", type=int)
        end_year = request.args.get("endYear", type=int)
        min_revenue = request.args.get("minRevenue", type=float)
        max_revenue = request.args.get("maxRevenue", type=float)
        min_net_income = request.args.get("minNetIncome", type=float)
        max_net_income = request.args.get("maxNetIncome", type=float)

        #filter based on requests
        if start_year:
            data_table = [row for row in data_table if int(row["Date"][:4]) >= start_year]
        if end_year:
            data_table = [row for row in data_table if int(row["Date"][:4]) <= end_year]
        if min_revenue:
            data_table = [row for row in data_table if row["Revenue"] >= min_revenue]
        if max_revenue:
            data_table = [row for row in data_table if row["Revenue"] <= max_revenue]
        if min_net_income:
            data_table = [row for row in data_table if row["NetIncome"] >= min_net_income]
        if max_net_income:
            data_table = [row for row in data_table if row["NetIncome"] <= max_net_income]


        #get sorting parameters from the request
        sort_by = request.args.get("sortBy", default="Date")  
        sort_order = request.args.get("sortOrder", default="desc") 
        
        #sort based on request
        if sort_by and sort_order:
            reverse = True if sort_order == "desc" else False
            #for each item in table, get the value of the field we are sorting by, use it as the key for that item in the sorting
            data_table = sorted(data_table, key=lambda x: x.get(sort_by), reverse=reverse)


        #return json for the frontend to use
        return jsonify(data_table)
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/")
def home():
    return ""

if __name__ == "__main__":
    app.run(debug=True, port=5000)

