const pokemonTypeColors = { normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F8D030", grass: "#78C850", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0", ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820", rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848", steel: "#B8B8D0", fairy: "#EE99AC" };
let pokemonNames = []; // Saves all pokemon names for searching
let currentPokemon;
let pokemonId = 1;
let pokemonContainer = 1; // Used to load pokemon into new containers / seems to make loading faster
let pokemonBig = 0; // Used to switch between pokemon in the big view
let isLoading = false; // Track loading state for load more button
let searchTimer; // Search timer for search delay on key up

async function init(){
    await includeHTML();
    await renderPokemon();
    await pokemonNamesPush();
}

// Load pokemon data from API
async function pokemonAPI(i){
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
}

// Renders pokemon and new containers
async function renderPokemon(){
    if(pokemonId <= 1025){
        document.getElementById('pokemon').innerHTML += renderPokemonHTML(pokemonContainer); // Seperates pokemon containers for every 36 pokemon
        await loadPokemon();
        pokemonId += 24;
        pokemonContainer++;
    }
}

// Loads up to 1025 pokemon, removes load more button after the last pokemon is loaded
async function loadPokemon(){
    for(let i = pokemonId; i <= pokemonId + 23; i++){
        if(i <= 1025){
            await pokemonAPI(i);
            document.getElementById(`pokemon_container_${pokemonContainer}`).innerHTML += renderPokedexHTML(i, pokemonTypeColors);
            renderPokemonInfo(i);
        } else {
            document.getElementById('load_more_pokemon').style.display = 'none';
        }
    }
}

// Load more pokemon, with a delay after button click
async function loadNextPokemonBatch() {
    if (isLoading) return; // If already loading, do nothing
    isLoading = true;
    document.getElementById('load_more_pokemon').disabled = true;
    renderPokemon();
    await new Promise(resolve => setTimeout(resolve, 2500)); // 2.5 seconds delay
    document.getElementById('load_more_pokemon').disabled = false;
    isLoading = false; 
}

// Opens the big pokedex for the clicked pokemon
async function openBigPokedex(i){
    document.getElementById('big_content').style.display = 'flex';
    document.getElementById('body').style.overflow = 'hidden';

    await pokemonAPI(i);
    pokemonBig = i;
    document.getElementById('pokedex_big').innerHTML = renderBigPokedex(i, pokemonTypeColors);
    evolvesFromPokemon(i);
    renderBigPokemonInfo(i);
    pokemonChart();   
}

// Closes the big pokedex and scrolls back to the last y-position
function closeBigPokedex(){
    document.getElementById('body').style.overflow = 'auto';
    document.getElementById('big_content').style.display = 'none';
    document.getElementById('pokedex_big').innerHTML = '';
}

// Closes the big pokedex when the background is clicked
document.addEventListener('DOMContentLoaded', function () {
    const popupBackground = document.getElementById('big_content_container');

    closeBigPokedex();

    popupBackground.addEventListener('click', function (event) {
        if (event.target === popupBackground) {
            closeBigPokedex();
        }
    });
});

// Loop through all images
function pokemonForward(pokemonBig){
    if(pokemonBig < 1025){
        pokemonBig++;
        openBigPokedex(pokemonBig);
    } else {
        pokemonBig = 1;
        openBigPokedex(pokemonBig);
    }
}

function pokemonBackward(pokemonBig){
    if(pokemonBig > 1){
        pokemonBig--;
        openBigPokedex(pokemonBig);
    } else {
        pokemonBig = 1025;
        openBigPokedex(pokemonBig);
    }
}

// Search for Pokemon
async function searchPokemon() {
    let search = document.getElementById('search').value;
    let list = document.getElementById('pokemon_search');
    list.innerHTML = '';
    search = search.toLowerCase();

    if(search.length >= 3) {
        await searchPokemonWithDelay(search);
    } else {
        list.style.marginBottom = '20px';
    }
}

// Put a delay after button presses, to give it time to load
async function searchPokemonWithDelay(search) {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(async () => {
        await searchPokemonName(search); 
    }, 500);
}

// Go through every pokemon name and list the first 10 that fit the search criteria
async function searchPokemonName(search) {
    let maximumDisplay = 0;
    for (let i = 1; i < pokemonNames.length; i++){
        if(pokemonNames[i - 1].toLocaleLowerCase().includes(search)){
            document.getElementById('pokemon_search').style.marginBottom = '200px';
            if(maximumDisplay < 10){
                maximumDisplay++;
                await pokemonAPI(i);
                document.getElementById('pokemon_search').innerHTML += renderPokedexHTML(i, pokemonTypeColors);
                renderPokemonInfo(i);
            }
        }
    }
}

// Checks if the pokemon has a second type and sets the color
function renderPokemonInfo(i){
    pokemonInfo(i);
    pokemonIdAddZero(i);
    if (currentPokemon.types[1] !== undefined) {
        document.getElementById(`pokemon_type_two_${i}`).innerHTML = currentPokemon.types[1].type.name;
        document.getElementById(`pokemon_type_two_${i}`).style.backgroundColor = pokemonTypeColors[currentPokemon.types[1].type.name];
    }
}

function renderBigPokemonInfo(i){
    pokemonBigInfo(i);
    pokemonIdBigAddZero(i);
    if (currentPokemon.types[1] !== undefined) {
        document.getElementById(`pokemon_type_two_big_${i}`).style.backgroundColor = pokemonTypeColors[currentPokemon.types[1].type.name];
        document.getElementById(`pokemon_type_two_big_${i}`).innerHTML = currentPokemon.types[1].type.name;
        document.getElementById(`pokemon_type_two_big_${i}`).style.display = 'flex';
    }
}

// Writes pokemon information
function pokemonInfo(i){
    document.getElementById(`pokemon_name_${i}`).innerHTML = currentPokemon.name;
    document.getElementById(`pokemon_image_${i}`).src = currentPokemon.sprites.other["official-artwork"].front_default;
    document.getElementById(`pokemon_weight_${i}`).innerHTML = currentPokemon.weight / 10 + ' kg';
    document.getElementById(`pokemon_height_${i}`).innerHTML = currentPokemon.height / 10 + ' m';
    document.getElementById(`pokemon_type_one_${i}`).innerHTML = currentPokemon.types[0].type.name;
}

function pokemonBigInfo(i){
    document.getElementById(`pokemon_name_big_${i}`).innerHTML = currentPokemon.name;
    document.getElementById(`pokemon_image_big_${i}`).src = currentPokemon.sprites.other["official-artwork"].front_default;
    document.getElementById(`pokemon_type_one_big_${i}`).innerHTML = currentPokemon.types[0].type.name;
    document.getElementById(`pokemon_type_two_big_${i}`).style.display = 'none';
}

// Adds two zeroes if the pokemon id is under 10 and one zero if it is under 100
function pokemonIdAddZero(i){
    let id = document.getElementById(`pokemon_id_${i}`);
    if(i < 10){
        id.innerHTML = '#00' + i;
    } else if(i < 100){
        id.innerHTML = '#0' + i;
    } else{
        id.innerHTML = '#' + i;
    }
}

function pokemonIdBigAddZero(i){
    let id = document.getElementById(`pokemon_id_big_${i}`);
    if(i < 10){
        id.innerHTML = '#00' + i;
    } else if(i < 100){
        id.innerHTML = '#0' + i;
    } else{
        id.innerHTML = '#' + i;
    }
}

// Checks if the pokemon evolves from another
async function evolvesFromPokemon(i){
    let url = `https://pokeapi.co/api/v2/pokemon-species/${i}`;
    let response = await fetch(url);
    evolvesFrom = await response.json();
    if(evolvesFrom.evolves_from_species !== null  && window.innerHeight > 667){
        document.getElementById('evolves_from_text').innerHTML = 'Evolves from: ';
        document.getElementById('evolves_from_pokemon').innerHTML = evolvesFrom.evolves_from_species.name;
    }
}

// Loads the normal 1025 pokemon data into allPokemonNames
async function loadPokemonDataFromAPI() {
    let url = "https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0";
    let response = await fetch(url);
    let allPokemon = await response.json();
    let allPokemonNames = allPokemon.results;
    return allPokemonNames;
}

// Pushes all pokemon names into pokemonNames
async function pokemonNamesPush() {
    let pokemonData = await loadPokemonDataFromAPI();
    for (let i = 0; i < pokemonData.length; i++) {
      let names = pokemonData[i].name;
      pokemonNames.push(names);
    }
}