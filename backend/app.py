from flask import Flask
import os
from dotenv import load_dotenv
import requests
from flask import jsonify

app = Flask(__name__)
load_dotenv()

FMP_API_KEY = os.getenv("FMP_API_KEY")

@app.route("/api/data", methods=["GET"])
def get_data():
    url = f"https://financialmodelingprep.com/api/v3/income-statement/AAPL?period=annual&apikey={FMP_API_KEY}"

    try:
        #send request to url, returns data and http status code
        response = requests.get(url)
        #check the status code
        response.raise_for_status()
        #convert to a list of dictionaries so we can filter it
        data = response.json()

        #build another list of dictionaries, extracting only the fields we will display
        filtered_data = [
            {
                "date": item["date"],
                "Revenue": item["revenue"],
                "Net Income": item["netIncome"],
                "Gross Profit": item["grossProfit"],
                "EPS": item["eps"],
                "Operating Income": item["operatingIncome"]
            }
            for item in data
        ]

        #return back json for the frontend to use
        return jsonify(filtered_data)
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/")
def home():
    return "Backend is running"

if __name__ == "__main__":
    app.run(debug=True, port=5000)

