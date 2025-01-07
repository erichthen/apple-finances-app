from flask import Flask
import os
from dotenv import load_dotenv
import requests
from flask import jsonify, Response

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
        
        return Response(response.content, content_type="application/json")
    
    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500
    

@app.route("/")
def home():
    return "Backend is running"

if __name__ == "__main__":
    app.run(debug=True, port=5000)

