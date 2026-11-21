# ✈️ Flight Price Prediction System

A Machine Learning-based web application that predicts flight ticket prices based on flight details such as airline, source city, destination, departure time, duration, number of stops, and days left before departure.

## 🌐 Live Demo

[Visit Flight Price Prediction System](https://flight-price-prediction-eight.vercel.app)

## 📌 Project Overview

Flight ticket prices change frequently depending on various factors. Finding the best price can be difficult for travelers.

Our Flight Price Prediction System uses Machine Learning to estimate flight ticket prices based on user-provided details, helping users make better travel decisions.

## 🎯 Objectives

- Predict flight ticket prices using Machine Learning.
- Provide quick price estimates.
- Build a simple and user-friendly interface.
- Store prediction history in a database.
- Help users make informed travel decisions.

## ✨ Features

- Flight price prediction using Machine Learning.
- User-friendly and responsive interface.
- Airline selection.
- Source and destination city selection.
- Departure and arrival time selection.
- Number of stops selection.
- Flight duration input.
- Days left before departure.
- Prediction history.
- Backend API integration.
- Database connectivity.

## 🛠️ Tech Stack

### Frontend
- React.js
- Tailwind CSS
- JavaScript
- Vite

### Backend
- Python
- Flask
- Flask-CORS

### Machine Learning
- Pandas
- NumPy
- Scikit-learn
- Random Forest Regressor
- One-Hot Encoding

### Database
- MySQL

### Deployment
- Vercel

## 🤖 Machine Learning Model

We use **Random Forest Regressor** to predict flight prices.

The model is trained on historical flight data and learns the relationship between flight details and ticket prices.

### Input Features

- Airline
- Source City
- Destination City
- Departure Time
- Arrival Time
- Number of Stops
- Travel Class
- Flight Duration
- Days Left Before Departure

### ML Workflow

1. Collect the flight dataset.
2. Clean and preprocess the data.
3. Convert categorical data into numerical form using One-Hot Encoding.
4. Split the dataset into training and testing sets.
5. Train the Random Forest Regressor.
6. Evaluate the model.
7. Save the trained model as `model.pkl`.
8. Use the model to predict flight prices.

## 📂 Project Structure

```text
Flight-Price-Prediction/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   └── data/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── dataset/
│   ├── ml/
│   │   ├── train_model.py
│   │   └── model.pkl
│   ├── app.py
│   ├── db.py
│   ├── .env.example
│   └── requirements.txt
│
├── api/
│   ├── index.py
│   ├── model_weights.npz
│   └── model_meta.json
│
├── .env.example
└── README.md
```

## 🗄️ MySQL Database Setup

1. Open **MySQL Workbench** or your MySQL command line.
2. Execute the following SQL query to create the database and table:

```sql
CREATE DATABASE IF NOT EXISTS flight_prediction;
USE flight_prediction;

CREATE TABLE IF NOT EXISTS prediction_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airline VARCHAR(100) NOT NULL,
    source_city VARCHAR(100) NOT NULL,
    destination_city VARCHAR(100) NOT NULL,
    departure_time VARCHAR(50) NOT NULL,
    arrival_time VARCHAR(50) NOT NULL,
    stops VARCHAR(50) NOT NULL,
    travel_class VARCHAR(50) NOT NULL,
    duration FLOAT NOT NULL,
    days_left INT NOT NULL,
    predicted_price FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

3. Configure your database credentials in `backend/.env`:

```env
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=flight_prediction
```

## 🚀 Running Locally

### 1. Backend (Flask)
```bash
cd backend
python -m venv venv
# Windows:
.\venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

pip install -r requirements.txt
python app.py
```
Backend runs on `http://localhost:5000`.

### 2. Frontend (React)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on `http://localhost:5173`.
