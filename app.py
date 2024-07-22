from flask import Flask, render_template, jsonify, request
from sqlalchemy import create_engine, text
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# =====================
# Database configuration
# =====================

db_config = {
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432',
    'database': 'database'
}

engine = create_engine(f"postgresql+psycopg2://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}")

# =====================
# Routes
# =====================

@app.route('/')
def home():
    try:
        return render_template('index.html')
    except Exception as e:
        print(e)
        return "An error occurred while retrieving survey data."

@app.route('/data')
def get_data():
    try:
        with engine.connect() as connection:
            fantasy_prediction = connection.execute(text("SELECT * FROM fantasy_football_2024_predictions"))
            fantasy_career_scores = connection.execute(text("SELECT * FROM fantasy_football_players_career_scores"))
           
            predictions = fantasy_prediction.fetchall()
            career_scores = fantasy_career_scores.fetchall()
            
        all_fantasy_data = {
            "predictions": [dict(zip(fantasy_prediction.keys(), row)) for row in predictions],
            "career_scores": [dict(zip(fantasy_career_scores.keys(), row)) for row in career_scores]
        }

        return jsonify(all_fantasy_data)

    except Exception as e:
        print(f"An error occurred while retrieving data: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving data"}), 500
 

@app.route('/predictions/<player_name>')
def get_player_predictions(player_name):
    try:
        with engine.connect() as connection:
            result = connection.execute(
                text("SELECT fantasy_2024_score_prediction, fantasy_2024_per_week_score_prediction FROM fantasy_football_2024_predictions WHERE name = :name"),
                {"name": player_name}
            )
            predictions = [dict(zip(result.keys(), row)) for row in result.fetchall()]
            if predictions:
                return jsonify(predictions[0])
            else:
                return jsonify({"error": "No predictions found for the player"}), 404
    except Exception as e:
        print(f"An error occurred while retrieving predictions: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving predictions"}), 500

@app.route('/dropdown_data')
def get_dropdown_data():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT name FROM fantasy_football_2024_predictions"))
            dropdown_data = [dict(zip(result.keys(), row)) for row in result.fetchall()]
            return jsonify(dropdown_data)
    except Exception as e:
        print(f"An error occurred while retrieving dropdown data: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving dropdown data"}), 500

if __name__ == '__main__':
    app.run(debug=True)
