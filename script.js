// Use the API_URL variable to make fetch requests to the API.
// Replace the placeholder with your cohort name (ex: 2109-UNF-HY-WEB-PT)
const cohortName = "2501-FTB-ET-WEB-PT";
const API_URL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

const state = {
  allPuppies: [],
  onePuppy: {},
  favPuppy: {},
};

const fromID = document.querySelector("#new-player-form");
const main = document.querySelector("#main");

/**
 * Fetches all players from the API.
 * @returns {Object[]} the array of player objects
 */
const fetchAllPlayers = async () => {
  try {
    // TODO
    const response = await fetch(`${API_URL}`);
    console.log("Response", response);
    const player_data = await response.json();
    console.log("Data", player_data);
    return player_data.data.players;
  } catch (err) {
    console.error("Uh oh, trouble fetching players!", err);
  }
};

/**
 * Fetches a single player from the API.
 * @param {number} playerId
 * @returns {Object} the player object
 */
const fetchSinglePlayer = async (playerId) => {
  try {
    //
    const response = await fetch(`${API_URL}/${playerId}`);

    console.log(response);
    let puppy_data = await response.json();
    puppy_data = puppy_data.data.player;
    console.log(puppy_data);

    state.onePuppy = document.createElement("div");
    state.onePuppy.classList.add("card", "single");
    state.onePuppy.innerHTML = `
    <h1> Name: ${puppy_data.name}</h1>
    <img src=${puppy_data.imageUrl} />
    `;

    go_back_button = document.createElement("button");
    go_back_button.textContent = "Go Back";

    go_back_button.addEventListener("click", () => {
      renderAllPlayers(state.allPuppies);
    });

    state.onePuppy.appendChild(go_back_button);

    renderSinglePlayer(state.onePuppy);
  } catch (err) {
    console.error(`Oh no, trouble fetching player #${playerId}!`, err);
  }
};

/**
 * Adds a new player to the roster via the API.
 * @param {Object} playerObj the player to add
 * @returns {Object} the player returned by the API
 */
const addNewPlayer = async (name, breed) => {
  try {
    // TODO

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, breed }),
    });

    const result = await response.json();
    console.log("Player added:", result);
    return result;
  } catch (err) {
    console.error("Oops, something went wrong with adding that player!", err);
  }
};

/**
 * Removes a player from the roster via the API.
 * @param {number} playerId the ID of the player to remove
 */
const removePlayer = async (playerId) => {
  try {
    // TODO
    await fetch(`${API_URL}/${playerId}`, {
      method: "DELETE",
    });
    window.location.reload();
  } catch (err) {
    console.error(
      `Whoops, trouble removing player #${playerId} from the roster!`,
      err
    );
  }
};

/**
 * Updates `<main>` to display a list of all players.
 *
 * If there are no players, a corresponding message is displayed instead.
 *
 * Each player is displayed in a card with the following information:
 * - name
 * - id
 * - image (with alt text of the player's name)
 *
 * Additionally, each card has two buttons:
 * - "See details" button that, when clicked, calls `renderSinglePlayer` to
 *    display more information about the player
 * - "Remove from roster" button that, when clicked, will call `removePlayer` to
 *    remove that specific player and then re-render all players
 *
 * Note: this function should replace the current contents of `<main>`, not append to it.
 * @param {Object[]} playerList - an array of player objects
 */
const renderAllPlayers = (playerList) => {
  state.allPuppies = playerList.map((player) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `<h1>${player.name}</h1>
    <button class="getDetails">Get Details</button>`;

    const detailsBtn = card.querySelector(".getDetails");
    detailsBtn.addEventListener("click", () => {
      fetchSinglePlayer(player.id);
    });
    return card;
  });

  main.replaceChildren(...state.allPuppies);
};

/**
 * Updates `<main>` to display a single player.
 * The player is displayed in a card with the following information:
 * - name
 * - id
 * - breed
 * - image (with alt text of the player's name)
 * - team name, if the player has one, or "Unassigned"
 *
 * The card also contains a "Back to all players" button that, when clicked,
 * will call `renderAllPlayers` to re-render the full list of players.
 * @param {Object} player an object representing a single player
 */
const renderSinglePlayer = (player) => {
  main.replaceChildren(player);
};

/**
 * Fills in `<form id="new-player-form">` with the appropriate inputs and a submit button.
 * When the form is submitted, it should call `addNewPlayer`, fetch all players,
 * and then render all players to the DOM.
 */
const renderNewPlayerForm = () => {
  try {
    // TODO
    const nameInput = document.createElement("input");
    nameInput.name = "name";
    const breedInput = document.createElement("input");
    breedInput.name = "breed";

    const label = document.createElement("label");
    label.textContent = "Please enter a name";
    const submitButton = document.createElement("button");
    submitButton.textContent = "submit";

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "delete";

    fromID.append(nameInput);
    fromID.append(breedInput);
    fromID.append(label);
    fromID.append(submitButton);
    fromID.append(deleteButton);

    // appened to form
  } catch (err) {
    console.error("Uh oh, trouble rendering the new player form!", err);
  }
};

fromID.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(fromID);
  let petName = formData.get("name");
  let breedName = formData.get("breed");

  addNewPlayer(petName, breedName);
  //refreshes
  window.location.reload();
});

fromID.addEventListener("delete", (event) => {
  event.preventDefault();

  removePlayer(playerID);
  //refreshes
  window.location.reload();
});

/**
 * Initializes the app by fetching all players and rendering them to the DOM.
 */
const init = async () => {
  const players = await fetchAllPlayers();
  renderAllPlayers(players);

  renderNewPlayerForm();
};

// This script will be run using Node when testing, so here we're doing a quick
// check to see if we're in Node or the browser, and exporting the functions
// we want to test if we're in Node.
if (typeof window === "undefined") {
  module.exports = {
    fetchAllPlayers,
    fetchSinglePlayer,
    addNewPlayer,
    removePlayer,
    renderAllPlayers,
    renderSinglePlayer,
    renderNewPlayerForm,
  };
} else {
  init();
}
