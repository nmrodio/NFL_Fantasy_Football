OVERVIEW:
---------------------
seven drop down menus for choosing the fantasy league players
    - 1 QB
    - 2 RB
    - 2 WR
    - 1 TE
    - 1 Flex (WR/RB/TE)
    - figure out how to add a function that will remove a player already chosen from the previous list on the consecutive similar list

corresponding windows to immediately populate the individual stats for each player after they're chosen
    - this window won't change unless the user chooses a different player from the drop down menu that corresponds with each of these windows
    - this is the end of one "branch" of the code or w/e, so might need to be its own for loop type function, separate entirely from the prediction windows

2 buttons to create predictions for the whole team/chosen players for the year
    - there will be two buttons, one for individual players, one for teams. and teams will just include any amount of player over one (1), to simplify the user interface
    - this button will need to be reclicked after the user chooses a new player/set of players, for there to be predictions for the new lineup
    - if a user has multiple players chosen, but only wants the predictions/stats, whatever for one player, the drop down   menus will have to be cleared of all players except the desired one
        - this will require text somewhere in the webpage once more than one drop down menu is filled out, or a graying of the prediction buttons that cannot be used at the time (such as individual yearly predictions graying out once a second player is selected)

corresponding window that populates our model's predictions for the selected button
    - this will be the overall points prediction window
    - there might need to be two windows, one for predictions for all the selected players, and one for the predictions for an entire team

----------------------------------------------------------
OPTIONAL/SCRAPPED/DELAYED:
    -2 buttons to select and create the weekly projections for the chosen player or whole team/multiple players
      - user will need to click the button each time for each player changed or rechosen
    -corresponding window that populates the projections
      - this window will be split in two for each of the two buttons

----------------------------------------------------------
UPDATE NOTES

FOR ME-
will need to add windows for the user to add their possible points for this year for predictions if that is the way we want to go 
    -or do an increase button for like increasing one point at a time?


-------
MODEL TRAINING NOTES
-- side note:
    I think it would be best if we did predictions in real time maybe? I don't know how we're going to get every single possible combination and number of player lineups into a csv but maybe that's just me
        -the predictions will be put into a csv that the user will trigger an information pull from by clicking the predict button????
        -question is should we have the model predict in real time or have all the predictions done beforehand and put into a csv
--
ISSUES:
current issue is that the model is way overfitted and is not predicting properly(?)
nick says the features are not being treated as features properly(?)

RECOMMENDATION:
kevin says problem is with too many features and redundancy - if we already have the fantasy points we don't need the columns that fantasy points is adding up, etc.
we don't need to predict this year or last year's averages, we need to predict next years
we have too much information going in to training the model- too many features



POSSIBLE IDEAS FROM KEVIN:
take differential of one players performance and the predictionwe arer making is the change in fantasy points from that differential
    -would either come out positive or negative, then the end user can base decisions on that information


---------------------------------------------------------


7/16/24 UPDATE

basic layout of website is done, now it is time to make it work and look pretty.
button to clear all drop down menu selections has been added

next steps, next to dos:
    - wait for flask app to be able to fully test site
    - work on aesthetics, the css styles part to make the site pretty
    - make a function so that if more than one player is chosen, the user cannot click the 'individual player' prediction button

-----------------

7/17/24 UPDATE

paying around with the background and fonts
    - the background currently has a transparent logo for the nfl
    - i want to change the size of it if possible but it is kind of unobtrusive right now
    - do we want to go fun a kitschy or dark and bro-y?? i like kitschy

have adjusted everything to where i want it to be aligned for now and have set up the code so that further adjustments can easily be made to make the boxes and menus look better
    - boxes and menus are not where i want them to be aesthetically but they are where i want them to be positionally
    - have set it up so that the labels and titles are all separately editable when it comes to font and size
    - still want to work on the style of the drop down menus maybe make them larger