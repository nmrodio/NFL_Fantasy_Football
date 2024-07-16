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
    const positions = ['QB', 'RB1', 'RB2', 'WR1', 'WR2', 'TE', 'Flex'];
    positions.forEach(position => {
        fetch('/get_dropdown_data')
            .then(response => response.json())
            .then(data => {
                let dropdown = document.getElementById(`dropdown${position}`);
                data.forEach(item => {
                    let option = document.createElement('option');
                    option.value = item.value;
                    option.textContent = item.name;
                    dropdown.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching dropdown data:', error));
    });
}

//make sure the players don't get chosen twice when there are two menus for one position
//have the individual stats of the chose player populate immediately once they are chosen
// and remain until new player is chosen from the same menu

//these stats are probably just going to be from a spread sheet, as they will not include week-to-week updates
//these will be summary stats for the past few years, plus maybe a detailed look at the past year
function updatePlayerInfo(position) {
    let selectedPlayer = document.getElementById(`dropdown${position}`).value;
    selectedPlayers[position] = selectedPlayer;

    // Remove chosen player from other dropdowns
    for (let pos in selectedPlayers) {
        if (pos !== position && selectedPlayers[pos] === selectedPlayer) {
            selectedPlayers[pos] = null;
            document.getElementById(`dropdown${pos}`).value = '';
        }
    }

    // Fetch and display individual stats
    fetch(`/get_player_stats?player=${selectedPlayer}`)
        .then(response => response.json())
        .then(data => {
            let playerStatsDiv = document.getElementById('playerStats');
            playerStatsDiv.innerHTML = `<p>${data}</p>`;
        })
        .catch(error => console.error('Error fetching player stats:', error));
}


//start the prediction window and button part of the webpage

//once more than one player is chosen from the drop down menus, all predictions and windows will be under the 
//team designation
//instead of the individual player designation
//to prevent confusion, user should not be able to click bot individual and team buttons at the same time

//will need to add a button to clear all drop down menus
function fetchPredictions(type) {
    fetch('/get_predictions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ players: selectedPlayers, type: type })
    })
        .then(response => response.json())
        .then(data => {
            let predictionResultsDiv = document.getElementById('predictionResults');
            predictionResultsDiv.innerHTML = `<p>${data}</p>`;
        })
        .catch(error => console.error('Error fetching predictions:', error));
}


