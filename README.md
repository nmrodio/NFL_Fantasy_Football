# NFL_Fantasy_Football

<img width="880" alt="image" src="https://github.com/user-attachments/assets/84026852-bc99-42ba-ae66-d2a5d1deebb7">



--------------------

**Presentation Link:**

https://docs.google.com/presentation/d/1tPnhr6G01euq9BH0zrdF7b6GFDnPZlc5Huv5wx1-s8U/edit?invite=CPma6MQI#slide=id.g2ecfa6bc6f4_1_21

--------------------

## **Project Overview:** ##

**Target Audience :**

Anyone who plays Fantasy Football can utilize our app to help guide them in their decision making process of team selection through data analysis.

**Motivation :**

To create a model that accurately predicts the performance of chosen NFL players based on past performance, weather conditions, stadium, years playing and player statistics.

**Tools Used :**

<img width="600" alt="image" src="https://github.com/user-attachments/assets/e9bf631c-3763-42a7-9530-d2fecb2abf0f">




--------------------
## **Data Processing :** ##

**Data Sources :**

* NFL Score and betting data (Kaggle) : https://www.kaggle.com/datasets/tobycrabtree/nfl-scores-and-betting-data
* NFL Stats 2012 - 2023 (Kaggle) : https://www.kaggle.com/datasets/philiphyde1/nfl-stats-1999-2022?resource=download&select=offense_weekly_data.csv

**Goal for Data Processing :**

1. Ensure data for prior seasons are complete, accurate, and consistent across players and seasons including changing team names, stadium names, games per season, and incomplete data due to injuries
2. Create a merged dataset from multiple CSV's and spreadsheets that includes all required dimensions 
3. Model enhancement through elimination of dimensions that did not contribute to accuracy on testing data, and through incorporation of additional dimensions based upon calculated combinations of existing statistics

**Process :**

1. Downloaded required data from kaggle and update fields for consistency
2. Merged stadium and player data
3. Output new CSV's for model building

--------------------
## **Model Selection :** ##

Three different regression models were tested in order to determine what would yield the best results. KNN regression (nearest neighbor), SVM regression (both linear and Gaussian--radial basis function), and linear regression. Both linear regression and linear fit SVM provided the best results by a significant margin. Since SVM and linear regression were essentially identical to three decimal places, the simpler, more efficient linear regression model was used. Jupyter notebooks containing the SVM training and KNN training can be found in the `archived_files` subdirectory.


## **Linear Regression :** ##

**Linear Regression Modeling :**

**Model Optimization :**

The model was optimized using two different approaches. First, any columns that could be considered a component of a player's scores (such as receiving yards, touchdowns, etc.) were eliminated as these tended to create a near perfect fit on the training data, but created poor results on test data. 

Second, linear regression often benefits from creation of additional calculated dimensions to allow fitting on interacting data. As a result, we created calculated fields for `target_per_game`, `carries_per_game`, `team_off_snaps_per_game`, and `attempts_per_game`. These could be derived from other player statistics in the dataset, but explicitly defining them resulted in a somewhat better fit.


**Results :**

When using all data prior to 2023 to predict player results in the 2023 season, and then comparing actual (known) fantasy points to predicted fantasy points, The R2 score was 97% suggesting a strong ability to predict the scores for individual players. The root mean square error was the 2023 season was just over 14 points.

For comparison purposes, scores were calculated by making the strong assumption that 2023 results for individual players would exactly mirror 2022 results for any players that played in both seasons. This strong assumption, which required no machine learning, resulted in RMSE of 71 points, nowhere near as good as the machine learning model. This suggests the machine learning model will work much better than simply using the "best players available" when making a team selection based purely on their 2022 fantasy scores. The machine learning model appears to work well.

--------------------
## **Application Architecture :** ##

**Repository Architecture :**

The repository contains several different subdirectories:
- `archived_files` contains Jupyter notebooks that were tested in development, but not incorporated into the final solution such as the different model comparisons, as well as an attempt to use weekly player data rather than seasonal data for making predictions.
- `data` directory contains the data set that resulted when running all prior seasons to make 2024 predictions. These are the CSV's output by the machine learning model that are incorporated into the UI for predictions.
- `resources` directory contains the CSV's generated through merging Kaggle datasets with appropriate cleanup. These files served as the dataset for training the model and generating predictions
- `NFL_data_manipulation` directory contains the resources files taken from Kaggle as well as the Jupyter notebook used to perform data cleanup and file merging. 
- `static` directory contains the CSS file used to create the look-and-feel for the tool as well as logos/graphics and the javascript scaffolding required to support drop downs and selections on the webpage.
- `templates` directory contains the HTML source code for the application, stored in `index.html`

The application works as follows:

The `db.py` file must first be run as a pre-requisite in order to create a Postgres SQL database with all players and their predictions for the 2024 season. This script utilizes the CSV's stored in the `data` directory to populate the database with the appropriate schema and tables.

The `app.py` file contains code to start a local flask server that contains the required routes for querying predictions based on user selections.

The `nfl_fantasy_football_model_optimized.ipynb` notebook contains the code used to build the linear regression machine learning model, test the model, and create the prediction CSV's to support the application

Within the `templates` directory, the `index.html` page contains the HTML for the application

**Instructions :**

The application assumes that Postgres SQL has already been installed locally, and that the following login credentials are valid:
- user = `postgres`
- password = `postgres`
- host = `localhost`
- port = `5432`
- database = `database`

If your Postgres installation differs from the above, you will need to update the `app.py` and `db.py` files to contain your credentials.

To run the following:
- Execute `db.py` to create the required tables in your local database
- Execute `app.py` to launch the flask server
- Navigate to `http://127.0.0.1:5000/` from within your browser to launch the tool!

