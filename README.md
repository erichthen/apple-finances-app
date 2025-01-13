# Link:
https://apple-income-chart.vercel.app
**NOTE:** Due to API call limits, my app will not be able to retrieve data until around 11:00 to 11:30pm EST on January 13th. Also, if a request takes a long time, that is because the server spun down due to incactivity and has to cold start.

# Instructions to Run Locally

## Prerequisites

If not installed already, install **Node.js**, **Python (version 3.8 or higher)**, and **Git**.

---

## Step 1: Clone the Repository

1. Run the following command to clone the repository:
   ```git clone https://github.com/erichthen/apple-revenue-chart```
2. Navigate to the project directory: ```cd apple-revenue-chart```

## Step 2: Set up the backend

1. Navigate to the backend directory: ```cd backend```
2. Set up and activate a python venv (python virtual environment)
   ```python3 -m venv <any-environment-name>```
   ```source <environment-name>/bin/activate```
3. Install required python packages (see requirements.txt)
   ```pip install -r requirements.txt```

## Step 3: Obtain an FMP API KEY and store it

1. Go to https://site.financialmodelingprep.com/developer/docs#income-statements-financial-statements
2. Click on the purple text that says "Income Statements API"
3. Sign in or make an account
4. Click on the blue "Explore Endpoint" button.
5. In the top right, click on the "API Url" button. 
6. Your API key will be at the end of the URL, after "apikey=".
7. In the backend folder, create a file called ".env" and add your API key
   ```FMP_API_KEY=<your-api-key>```

## Step 4: Run the backend

1. In your backend directory, run the command
   ```python app.py```
   By default, the backend runs at http://127.0.0.1:5000.


## Step 5: Set up the frontend

1. Navigate to the frontend directory
   ```cd ../frontend```

2. Install the required Node.js packages
   ```npm install```

3. Start the development server
   ```npm run dev```
   By default, the frontend runs at http://localhost:5173.

## Step 6: Access the application

1. Hold down command and click on the link to http://localhost:5173 that has been displayed in your terminal, 
   or go to your browser and type in that link. 

2. From this point, you should be able to begin using the application. 

## Troubleshooting Tips
- If you encounter issues:
  1. Make sure both the frontend and backend servers are running.
  2. Verify that the `.env` file in the `backend` folder contains the correct API key.
  3. Check the terminal logs for errors in either the backend or frontend.

- For CORS errors, ensure the frontend (`http://localhost:5173`) is allowed in the backend's CORS settings:
  ```python
  CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "https://apple-income-chart.vercel.app"]}})

- If the backend is running and properly retrieving data and you get an error fetching data from the frontend, it could be a CORS caching problem, so clear your browser cache or test in an incognito window. 


