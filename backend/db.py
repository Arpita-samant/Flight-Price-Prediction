import os
from datetime import datetime, timedelta
import mysql.connector
from mysql.connector import Error
from dotenv import load_dotenv, find_dotenv

# Load environment variables from .env file
# Looks first in backend/.env, then in root directory
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_env = os.path.join(current_dir, ".env")
root_env = os.path.join(current_dir, "..", ".env")

if os.path.exists(backend_env):
    load_dotenv(backend_env)
elif os.path.exists(root_env):
    load_dotenv(root_env)
else:
    load_dotenv(find_dotenv())

def get_db_config():
    """
    Read database credentials safely from environment variables.
    """
    return {
        "host": os.getenv("MYSQL_HOST", "localhost"),
        "port": int(os.getenv("MYSQL_PORT", 3306)),
        "user": os.getenv("MYSQL_USER", "root"),
        "password": os.getenv("MYSQL_PASSWORD", ""),
        "database": os.getenv("MYSQL_DATABASE", "flight_prediction"),
        "connection_timeout": 5
    }

def get_db_connection():
    """
    Establish a connection to MySQL database using mysql-connector-python.
    Returns the connection object or None if connection fails.
    """
    config = get_db_config()
    try:
        connection = mysql.connector.connect(
            host=config["host"],
            port=config["port"],
            user=config["user"],
            password=config["password"],
            database=config["database"],
            connection_timeout=config["connection_timeout"]
        )
        if connection.is_connected():
            return connection
    except Error as e:
        print(f"[MySQL Warning] Could not connect to database '{config['database']}' at {config['host']}:{config['port']}: {e}")
        return None
    except Exception as e:
        print(f"[MySQL Unexpected Error] {e}")
        return None
    return None

def check_db_health():
    """
    Check if MySQL is reachable and table exists.
    Returns a dict with connection status and helpful message.
    """
    config = get_db_config()
    conn = get_db_connection()
    if not conn:
        return {
            "connected": False,
            "database": config["database"],
            "host": config["host"],
            "port": config["port"],
            "message": "MySQL server is currently unreachable or credentials in .env need verification."
        }

    try:
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES LIKE 'prediction_history'")
        table_exists = cursor.fetchone() is not None
        cursor.close()
        conn.close()

        if table_exists:
            return {
                "connected": True,
                "database": config["database"],
                "table": "prediction_history",
                "status": "ready",
                "message": "MySQL connection active and prediction_history table verified."
            }
        else:
            return {
                "connected": True,
                "database": config["database"],
                "table": "prediction_history",
                "status": "table_missing",
                "message": "Connected to MySQL, but 'prediction_history' table is not yet created. Execute the CREATE TABLE query in MySQL Workbench."
            }
    except Exception as e:
        if conn and conn.is_connected():
            conn.close()
        return {
            "connected": False,
            "error": str(e),
            "message": "Connected but failed to inspect table structure."
        }

def save_prediction(record):
    """
    Insert a successful flight price prediction into MySQL prediction_history table.
    Uses parameterized SQL queries to prevent SQL injection.
    
    Expected record dict keys:
      - airline (str)
      - source_city (str)
      - destination_city (str)
      - departure_time (str)
      - arrival_time (str)
      - stops (str)
      - travel_class (str)
      - duration (float)
      - days_left (int)
      - predicted_price (float)
    """
    conn = get_db_connection()
    if not conn:
        print("[MySQL Info] Skipping database save: MySQL connection unavailable.")
        return False

    cursor = None
    try:
        cursor = conn.cursor()
        insert_query = """
            INSERT INTO prediction_history (
                airline,
                source_city,
                destination_city,
                departure_time,
                arrival_time,
                stops,
                travel_class,
                duration,
                days_left,
                predicted_price
            ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        values = (
            str(record.get("airline", "")),
            str(record.get("source_city", "")),
            str(record.get("destination_city", "")),
            str(record.get("departure_time", "")),
            str(record.get("arrival_time", "")),
            str(record.get("stops", "zero")),
            str(record.get("travel_class", record.get("class", "Economy"))),
            float(record.get("duration", 2.0)),
            int(record.get("days_left", 15)),
            round(float(record.get("predicted_price", 0.0)), 2)
        )

        cursor.execute(insert_query, values)
        conn.commit()
        inserted_id = cursor.lastrowid
        print(f"[MySQL Success] Prediction record #{inserted_id} saved to prediction_history table.")
        return True

    except Error as e:
        print(f"[MySQL Error] Failed to insert prediction record: {e}")
        try:
            conn.rollback()
        except Exception:
            pass
        return False
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

def get_prediction_history(limit=50):
    """
    Fetch stored prediction records from MySQL, sorted newest first.
    Returns a list of dicts.
    """
    conn = get_db_connection()
    if not conn:
        return None

    cursor = None
    try:
        # Use dictionary=True so rows are returned as key-value dictionaries
        cursor = conn.cursor(dictionary=True)
        query = """
            SELECT 
                id,
                airline,
                source_city,
                destination_city,
                departure_time,
                arrival_time,
                stops,
                travel_class,
                duration,
                days_left,
                predicted_price,
                created_at
            FROM prediction_history
            ORDER BY created_at DESC, id DESC
            LIMIT %s
        """
        cursor.execute(query, (int(limit),))
        rows = cursor.fetchall()

        formatted_history = []
        for r in rows:
            created_at_dt = r.get("created_at")
            created_at_str = created_at_dt.strftime("%Y-%m-%d %H:%M:%S") if isinstance(created_at_dt, datetime) else str(created_at_dt or "")
            
            # Approximate travel date calculated from days_left for display convenience
            travel_date = ""
            if isinstance(created_at_dt, datetime) and r.get("days_left") is not None:
                travel_date = (created_at_dt + timedelta(days=int(r["days_left"]))).strftime("%Y-%m-%d")

            formatted_history.append({
                "id": r["id"],
                "airline": r["airline"],
                "source_city": r["source_city"],
                "destination_city": r["destination_city"],
                "departure_time": r["departure_time"],
                "arrival_time": r["arrival_time"],
                "stops": r["stops"],
                "travel_class": r["travel_class"],
                "duration": float(r["duration"]),
                "days_left": int(r["days_left"]),
                "predicted_price": float(r["predicted_price"]),
                "created_at": created_at_str,
                # Frontend convenience aliases
                "source": r["source_city"],
                "destination": r["destination_city"],
                "flightClass": r["travel_class"],
                "daysLeft": int(r["days_left"]),
                "price": float(r["predicted_price"]),
                "travelDate": travel_date
            })

        return formatted_history

    except Error as e:
        print(f"[MySQL Error] Failed to fetch prediction history: {e}")
        return None
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()

def clear_prediction_history():
    """
    Clear all records from prediction_history table.
    """
    conn = get_db_connection()
    if not conn:
        return False

    cursor = None
    try:
        cursor = conn.cursor()
        cursor.execute("TRUNCATE TABLE prediction_history")
        conn.commit()
        print("[MySQL Success] prediction_history table truncated.")
        return True
    except Error as e:
        print(f"[MySQL Error] Failed to clear prediction history: {e}")
        try:
            conn.rollback()
        except Exception:
            pass
        return False
    finally:
        if cursor:
            cursor.close()
        if conn and conn.is_connected():
            conn.close()
