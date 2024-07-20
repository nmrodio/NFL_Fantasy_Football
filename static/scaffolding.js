document.addEventListener("DOMContentLoaded", () => {
    populateDropdowns();
});
// dropdown menus for user to interact with
//one per position able to be played/filled in a week
//does not include kicker, defense, or bench players
let selectedPlayers = {
    QB: null,
    RB1: null,
    RB2: null,
    WR1: null,
    WR2: null,
    TE: null,
    Flex: null
};

//populate the drop down menus with the player info according to position from the app
//this will probably be taken from a list in a spreadsheet or smt and will not be from the model data
//
function populateDropdowns() {
    fetch('/data')
        .then(response => response.json())
        .then(data => {
            if (!data.predictions || !data.career_scores) {
                throw new Error('Fetched data is not in the expected format');
            }

            const predictions = data.predictions;
            const careerScores = data.career_scores;

            // Combine predictions and career scores based on player name and position
            const combinedData = predictions.map(pred => {
                const career = careerScores.find(cs => cs.name === pred.name && cs.position === pred.position);
                return { ...pred, ...career };
            });

            const playersByPosition = {
                QB: [],
                RB: [],
                WR: [],
                TE: [],
                Flex: []
            };

            combinedData.forEach(item => {
                if (playersByPosition[item.position]) {
                    playersByPosition[item.position].push(item);
                }
            });

            const positions = ['QB', 'RB', 'WR', 'TE', 'Flex'];
            positions.forEach(position => {
                let dropdowns = [];
                if (position === 'RB' || position === 'WR') {
                    dropdowns.push(document.getElementById(`dropdown${position}1`));
                    dropdowns.push(document.getElementById(`dropdown${position}2`));
                } else {
                    dropdowns.push(document.getElementById(`dropdown${position}`));
                }
                
                dropdowns.forEach(dropdown => {
                    if (dropdown) {
                        playersByPosition[position].forEach(player => {
                            let option = document.createElement('option');
                            option.value = JSON.stringify(player); // Stringify player object to store in value
                            option.textContent = player.name;
                            dropdown.appendChild(option);
                        });

                        dropdown.addEventListener('change', event => {
                            let player = JSON.parse(event.target.value); // Parse player object from value
                            let positionId = dropdown.id.replace('dropdown', '');
                            updatePlayerInfo(player, positionId);
                        });
                    } else {
                        console.error(`Dropdown element for ${position} not found`);
                    }
                });
            });

            let flexDropdown = document.getElementById('dropdownFlex');
            if (flexDropdown) {
                ['WR', 'RB', 'TE'].forEach(position => {
                    playersByPosition[position].forEach(player => {
                        let option = document.createElement('option');
                        option.value = JSON.stringify(player); // Stringify player object to store in value
                        option.textContent = player.name;
                        flexDropdown.appendChild(option);
                    });
                });

                flexDropdown.addEventListener('change', event => {
                    let player = JSON.parse(event.target.value); // Parse player object from value
                    updatePlayerInfo(player, 'Flex');
                });
            } else {
                console.error('Flex dropdown element not found');
            }

        })
        .catch(error => console.error('Error fetching dropdown data:', error));
}

//make sure the players don't get chosen twice when there are two menus for one position
//have the individual stats of the chose player populate immediately once they are chosen
// and remain until new player is chosen from the same menu

function updatePlayerInfo(player, position) {
    const scorePredictionElement = document.getElementById(`scorePrediction${position}`);
    const weeklyScorePredictionElement = document.getElementById(`weeklyScorePrediction${position}`);

    if (!scorePredictionElement || !weeklyScorePredictionElement) {
        console.error('Prediction elements not found in the DOM');
        return;
    }

    scorePredictionElement.textContent = player.fantasy_2024_score_prediction || 'N/A';
    weeklyScorePredictionElement.textContent = player.fantasy_2024_per_week_score_prediction || 'N/A';

    // Update stats info box if needed
    const statsElement = document.getElementById(`stats${position}`);
    if (statsElement) {
        statsElement.textContent = `Player: ${player.name}, Team: ${player.team}, Position: ${player.position}`;
    }

}

//start the prediction window and button part of the webpage

//once more than one player is chosen from the drop down menus, all predictions and windows will be under the 
//team designation
//instead of the individual player designation
//to prevent confusion, user should not be able to click bot individual and team buttons at the same time

function generateTeamPrediction() {
    let totalScorePrediction = 0;
    let totalWeeklyScorePrediction = 0;

    Object.keys(selectedPlayers).forEach(position => {
        const player = selectedPlayers[position];
        if (player) {
            const scorePrediction = parseFloat(player.fantasy_2024_score_prediction) || 0;
            const weeklyScorePrediction = parseFloat(player.fantasy_2024_per_week_score_prediction) || 0;
            totalScorePrediction += scorePrediction;
            totalWeeklyScorePrediction += weeklyScorePrediction;
        }
    });

    const teamPredictionBox = document.getElementById('teamPredictionBox');
    teamPredictionBox.innerHTML = `
        <p>Total Score Prediction: ${totalScorePrediction}</p>
        <p>Total Weekly Score Prediction: ${totalWeeklyScorePrediction}</p>
    `;
}

//will need to add a button to clear all drop down menus
//clearing selection button function

function clearSelections() {
    var selects = document.querySelectorAll('select');

    selects.forEach(select => {
        select.value = "";
        var positionId = select.id.replace('dropdown', '');
        selectedPlayers[positionId] = null; // Clear selected player data
        var infoBox = document.getElementById(`stats${positionId}`);
        var scorePredictionElement = document.getElementById(`scorePrediction${positionId}`);
        var weeklyScorePredictionElement = document.getElementById(`weeklyScorePrediction${positionId}`);
        if (infoBox) {
            infoBox.innerHTML = "Player stats will be shown here.";
        }
        if (scorePredictionElement) {
            scorePredictionElement.innerHTML = "N/A";
        }
        if (weeklyScorePredictionElement) {
            weeklyScorePredictionElement.innerHTML = "N/A";
        }
    });

    const teamPredictionBox = document.getElementById('teamPredictionBox');
    teamPredictionBox.innerHTML = "Team predictions will be shown here.";
}