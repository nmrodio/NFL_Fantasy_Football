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
        # write all the code here for the chart
        return render_template('index.html')

    except Exception as e:
        print(e)
        return "An error occurred while retrieving fantasy data."

@app.route('/data')
def get_data():
    try:
    
        with engine.connect() as connection:
            result1 = connection.execute(text("SELECT * FROM predicting_data"))
            result2 = connection.execute(text("SELECT * FROM training_data"))
           
            predicting_data = result1.fetchall()
            training_data = result2.fetchall()
            

        all_fantasy_data = {
        "predicting_data": [dict(zip(result1.keys(), row)) for row in predicting_data],
        "training_data": [dict(zip(result2.keys(), row)) for row in training_data]
        
    }

        # Render the HTML template with survey data
        return jsonify(all_fantasy_data)

    except Exception as e:
        print(e)
        return "An error occurred while retrieving survey data."

if __name__ == '__main__':
    app.run(debug=True)