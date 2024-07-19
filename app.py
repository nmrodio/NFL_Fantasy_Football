from flask import Flask, render_template, jsonify
from sqlalchemy import create_engine, text
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# =====================
# getting the data-----Create the database engine
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
# route
# =====================

@app.route('/')
def survey_default():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT DISTINCT name FROM dropdown_data"))
            names = [row['name'] for row in result.fetchall()]
        return render_template('index.html', names=names)
    except Exception as e:
        print(e)
        return "An error occurred while retrieving fantasy data."

@app.route('/data')
def get_data():
    try:
    
        with engine.connect() as connection:
            fantasy_prediction = connection.execute(text("SELECT * FROM fantasy_football_2024_predictions"))
            fantasy_career_scores = connection.execute(text("SELECT  * FROM fantasy_football_players_career_scores"))
           
            predictions = fantasy_prediction.fetchall()
            career_scores = fantasy_career_scores.fetchall()
            
        all_fantasy_data = {
        "predictions": [dict(zip(fantasy_prediction.keys(), row)) for row in predictions],
        "career_scores": [dict(zip(fantasy_career_scores.keys(), row)) for row in career_scores]
        
    }

        # Render the HTML template with fantasy data
        return jsonify(all_fantasy_data)

    except Exception as e:
        print(e)
        return "An error occurred while retrieving survey data."

@app.route('/get-predictions')
def get_predictions():
    try:
        with engine.connect() as connection:
            result = connection.execute(text("SELECT * FROM fantasy_football_2024_predictions"))
            predictions = [dict(row) for row in result.fetchall()]
            return jsonify(predictions)
    except Exception as e:
        print(f"An error occurred while retrieving predictions: {str(e)}")
        return jsonify({"error": "An error occurred while retrieving predictions"}), 500

if __name__ == '__main__':
    app.run(debug=True)