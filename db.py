import pandas as pd
from sqlalchemy import create_engine
import psycopg2
import os


# Database configuration
db_config = {
    'user': 'postgres',
    'password': 'postgres',
    'host': 'localhost',
    'port': '5432',
    'database': 'database'
}

# Create a connection to the PostgreSQL server to create the database if it doesn't exist
def create_database(config):
    conn = psycopg2.connect(
        dbname='postgres',
        user=config['user'],
        password=config['password'],
        host=config['host'],
        port=config['port']
    )
    conn.autocommit = True
    cursor = conn.cursor()
    cursor.execute(f"SELECT 1 FROM pg_catalog.pg_database WHERE datname = '{config['database']}'")
    exists = cursor.fetchone()
    if not exists:
        cursor.execute(f"CREATE DATABASE {config['database']}")
        print(f"Database '{config['database']}' created successfully!")
    else:
        print(f"Database '{config['database']}' already exists.")
    cursor.close()
    conn.close()

# Create the database if it doesn't exist
create_database(db_config)

# Create the database engine
engine = create_engine(f"postgresql+psycopg2://{db_config['user']}:{db_config['password']}@{db_config['host']}:{db_config['port']}/{db_config['database']}")

# Path to the folder containing CSV files
csv_folder_path = 'data/'

# List all CSV files in the specified folder
csv_files = [file for file in os.listdir(csv_folder_path) if file.endswith('.csv')]

# Iterate over each CSV file
for file in csv_files:
    # Extract table name from the filename
    table_name = os.path.splitext(file)[0]

    # Construct the full path to the CSV file
    file_path = os.path.join(csv_folder_path, file)

    # Load the CSV data into a DataFrame
    df = pd.read_csv(file_path)

    # Write the data to the PostgreSQL table
    df.to_sql(table_name, engine, if_exists='replace', index=False)

    print(f"Data from '{file}' loaded into '{table_name}' table successfully!")