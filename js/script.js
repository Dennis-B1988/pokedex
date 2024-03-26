const pokemonTypeColors = { normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F8D030", grass: "#78C850", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0", ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820", rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848", steel: "#B8B8D0", fairy: "#EE99AC" };
let pokemonNames = [];
let currentPokemon;
let pokemonId = 1;
let x = 1; // Used to create new pokemon containers

async function init(){
    await includeHTML();
    await loadPokemon();
}

// Loads first 36 pokemon
async function loadPokemon(){
    document.getElementById(`pokemon_container_${x}`).innerHTML = '';
    for(let i = 1; i <= pokemonId + 35; i++){
        await pokemonAPI(i);
        document.getElementById(`pokemon_container_${x}`).innerHTML += renderPokedexHTML(i, pokemonTypeColors);
        pokemonInfoAndColor(i);
        pokemonNames.push(currentPokemon.name);
    }
    pokemonId = 37;
    x++;
}

// Loads more pokemon
async function loadMorePokemon(){
    if(pokemonId < 990){
        document.getElementById('pokemon').innerHTML += renderPokemonHTML(x); // Seperates pokemon containers for every 36 pokemon
        for(let i = pokemonId; i <= pokemonId + 35; i++){
            await pokemonAPI(i);
            document.getElementById(`pokemon_container_${x}`).innerHTML += renderPokedexHTML(i, pokemonTypeColors);
            pokemonInfoAndColor(i);
            pokemonNames.push(currentPokemon.name);
        }
        pokemonId += 36;
        x++;
    } else {
        loadLastPokemon();  
    }
}

// Loads last pokemon stopping at 1025
async function loadLastPokemon(){
    document.getElementById('pokemon').innerHTML += renderPokemonHTML(x); 
    for(let i = pokemonId; i <= 1025; i++){
        await pokemonAPI(i);
        document.getElementById(`pokemon_container_${x}`).innerHTML += renderPokedexHTML(i, pokemonTypeColors);
        pokemonInfoAndColor(i);
        pokemonNames.push(currentPokemon.name);
    }
    document.getElementById('load_more_pokemon').style.display = 'none';
}

// Needed?? WIP
async function clickToLoadPokemon(){
    await loadMorePokemon();
}

// Load pokemon data from API
async function pokemonAPI(i){
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
}

// Checks if the pokemon has a second type and sets the color
function pokemonInfoAndColor(i){
    renderPokemonInfo(i);
    if (currentPokemon.types[1] !== undefined) {
        document.getElementById(`pokemon_type_two_${i}`).style.backgroundColor = pokemonTypeColors[currentPokemon.types[1].type.name];
    }
}

// Renders pokemon information
function renderPokemonInfo(i){
    document.getElementById(`pokemon_name_${i}`).innerHTML = currentPokemon.name;
    pokemonIdAddZero(i);
    document.getElementById(`pokemon_image_${i}`).src = currentPokemon.sprites.other["official-artwork"].front_default;
    document.getElementById(`pokemon_weight_${i}`).innerHTML = currentPokemon.weight / 10 + ' kg';
    document.getElementById(`pokemon_height_${i}`).innerHTML = currentPokemon.height / 10 + ' m';
    document.getElementById(`pokemon_type_one_${i}`).innerHTML = currentPokemon.types[0].type.name;
    pokemonTypeTwo(i);
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

// Checks if the pokemon has a second type
function pokemonTypeTwo(i){
    if(currentPokemon.types[1] !== undefined){
        document.getElementById(`pokemon_type_two_${i}`).innerHTML = currentPokemon.types[1].type.name;
    }
}

// Opens the big pokedex for the clicked pokemon
async function openBigPokedex(i){
    document.getElementById('big_content').style.display = 'flex';
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}`;

    calculateBigPokedexPosition();
    await pokemonAPI(i);
    
    let imageBig = i;
    // forwardArrow(imageBig);
    // backwardArrow(imageBig);
    document.getElementById('pokedex_big').innerHTML = renderBigPokedex(i, pokemonTypeColors);
    renderBigPokemonInfo(i);
    pokemonChart();
}

// Calculates the position of the pokedex to be always in the middle of the screen
function calculateBigPokedexPosition(){
    let dialog = document.getElementById('pokedex_big');

    let dialogWidth = dialog.offsetWidth;
    let dialogHeight = dialog.offsetHeight;
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;
  
    dialog.style.top = Math.max(0, (screenHeight - dialogHeight) / 2) + 'px';
    dialog.style.left = Math.max(0, (screenWidth - dialogWidth) / 2) + 'px';
}

// Closes the big pokedex
function closeBigPokedex(){
    const body = document.body;
    const scrollY = body.style.top;
    body.style.position = '';
    body.style.top = '';
    window.scrollTo(0, parseInt(scrollY || '0') * -1);
    document.getElementById('big_content').style.display = 'none';
    document.getElementById('pokedex_big').innerHTML = '';
}

function renderBigPokemonInfo(i){
    document.getElementById(`pokemon_name_big_${i}`).innerHTML = currentPokemon.name;
    
    document.getElementById(`pokemon_image_big_${i}`).src = currentPokemon.sprites.other["official-artwork"].front_default;
    // document.getElementById(`pokemon_weight_big_${i}`).innerHTML = currentPokemon.weight / 10 + ' kg';
    // document.getElementById(`pokemon_height_big_${i}`).innerHTML = currentPokemon.height / 10 + ' m';
    // document.getElementById(`pokemon_type_one_big_${i}`).innerHTML = currentPokemon.types[0].type.name;
    pokemonIdBigAddZero(i);
    // pokemonBigTypeTwo(i);
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

function pokemonBigTypeTwo(i){
    if(currentPokemon.types[1] !== undefined){
        document.getElementById(`pokemon_type_two_big_${i}`).innerHTML = currentPokemon.types[1].type.name;
    }
}

// Search for Pokemon
async function searchPokemon() {
    let search = document.getElementById('search').value;
    let list = document.getElementById('pokemon_search');
    search = search.toLowerCase();  
    list.innerHTML = '';

    for (let i = 1; i < pokemonNames.length; i++){
        if(pokemonNames[i - 1].toLocaleLowerCase().includes(search) && search.length > 1){
            await pokemonAPI(i);
            list.innerHTML += renderPokedexHTML(i, pokemonTypeColors);
            pokemonInfoAndColor(i);
        }
    }
}

window.addEventListener('scroll', () => {
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
  });

