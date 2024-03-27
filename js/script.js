const pokemonTypeColors = { normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F8D030", grass: "#78C850", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0", ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820", rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848", steel: "#B8B8D0", fairy: "#EE99AC" };
let pokemonNames = [];
let currentPokemon;
let pokemonId = 1;
let x = 1; // Used to create new pokemon containers
let pokemonBig = 0;

async function init(){
    await includeHTML();
    await loadPokemon();
    await pokemonNamesToArray();
}

// Loads more pokemon
async function loadPokemon(){
    if(pokemonId < 990){
        document.getElementById('pokemon').innerHTML += renderPokemonHTML(x); // Seperates pokemon containers for every 36 pokemon
        for(let i = pokemonId; i <= pokemonId + 35; i++){
            await pokemonAPI(i);
            document.getElementById(`pokemon_container_${x}`).innerHTML += renderPokedexHTML(i, pokemonTypeColors);
            pokemonInfoAndColor(i);
            // pokemonNames.push(currentPokemon.name);
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
        // pokemonNames.push(currentPokemon.name);
    }
    document.getElementById('load_more_pokemon').style.display = 'none';
}

// Load pokemon data from API
async function pokemonAPI(i){
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    currentPokemon = await response.json();
}

// Opens the big pokedex for the clicked pokemon
async function openBigPokedex(i){
    document.getElementById('big_content').style.display = 'flex';
    document.getElementById('body').style.overflow = 'hidden';
    // saveScrollPosition();
    // calculateBigPokedexPosition();

    await pokemonAPI(i);
    pokemonBig = i;
    document.getElementById('pokedex_big').innerHTML = renderBigPokedex(i, pokemonTypeColors);
    pokemonBigInfoAndColor(i);
    pokemonBigAbilityTwo(i);
    pokemonChart();
}

// Saves the current scroll position before opening the big pokedex
function saveScrollPosition(){
    const scrollY = document.documentElement.style.getPropertyValue('--scroll-y');
    const body = document.body;
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}`;
}

// Closes the big pokedex and scrolls back to the last y-position
function closeBigPokedex(){
    // const body = document.body;
    // const scrollY = body.style.top;
    // body.style.position = '';
    // body.style.top = '';
    // window.scrollTo(0, parseInt(scrollY || '0') * -1);
    document.getElementById('body').style.overflow = 'auto';
    document.getElementById('big_content').style.display = 'none';
    document.getElementById('pokedex_big').innerHTML = '';
}

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

// Search for Pokemon
async function searchPokemon() {
    let search = document.getElementById('search').value;
    let list = document.getElementById('pokemon_search');
    list.innerHTML = '';
    search = search.toLowerCase();

    if(search.length >= 1) {
        // list.style.display = 'flex';
        await searchPokemonName(search); 
    }
}

// Display the first 10 search results
async function searchPokemonName(search) {
    let maximumDisplay = 0;
    for (let i = 1; i < pokemonNames.length; i++){
        if(pokemonNames[i - 1].toLocaleLowerCase().includes(search)){
            if(maximumDisplay < 10){
                maximumDisplay++;
                await pokemonAPI(i);
                document.getElementById('pokemon_search').innerHTML += renderPokedexHTML(i, pokemonTypeColors);
                pokemonInfoAndColor(i);
            }
        }
    }
}





// Checks if the pokemon has a second type and sets the color
function pokemonInfoAndColor(i){
    renderPokemonInfo(i);
    if (currentPokemon.types[1] !== undefined) {
        document.getElementById(`pokemon_type_two_${i}`).style.backgroundColor = pokemonTypeColors[currentPokemon.types[1].type.name];
    }
}

function pokemonBigInfoAndColor(i){
    renderBigPokemonInfo(i);
    if (currentPokemon.types[1] !== undefined) {
        document.getElementById(`pokemon_type_two_big_${i}`).style.backgroundColor = pokemonTypeColors[currentPokemon.types[1].type.name];
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

function renderBigPokemonInfo(i){
    document.getElementById(`pokemon_name_big_${i}`).innerHTML = currentPokemon.name;
    
    document.getElementById(`pokemon_image_big_${i}`).src = currentPokemon.sprites.other["official-artwork"].front_default;
    document.getElementById(`pokemon_type_one_big_${i}`).innerHTML = currentPokemon.types[0].type.name;
    document.getElementById(`pokemon_type_two_big_${i}`).style.display = 'none';
    pokemonIdBigAddZero(i);
    pokemonBigTypeTwo(i);
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

// Adds zeroes on the big pokedex id
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

// Checks if the pokemon has a second type
function pokemonTypeTwo(i){
    if(currentPokemon.types[1] !== undefined){
        document.getElementById(`pokemon_type_two_${i}`).innerHTML = currentPokemon.types[1].type.name;
    }
}

function pokemonBigTypeTwo(i){
    if(currentPokemon.types[1] !== undefined){
        document.getElementById(`pokemon_type_two_big_${i}`).innerHTML = currentPokemon.types[1].type.name;
        document.getElementById(`pokemon_type_two_big_${i}`).style.display = 'block';
    }
}

function pokemonBigAbilityTwo(i){
    if(currentPokemon.abilities[1] !== undefined){
        document.getElementById(`ability_two_${i}`).innerHTML = currentPokemon.abilities[1].ability.name;
    }
}


// Checks the current y-scroll position
window.addEventListener('scroll', () => {
    document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`);
  });

//   async function loadPokemonNames() {
//     await pokemonNames();
//     let pokemonData = await loadAllPokemonInfos();
//     pokemonNamesToArray(pokemonData);
//   }

//   async function loadPokemonNames() {
//     let pokemonData = await loadPokemonDataFromAPI();
//     pokemonNamesToArray(pokemonData);
//   }

  async function loadPokemonDataFromAPI() {
    let url = "https://pokeapi.co/api/v2/pokemon?limit=1025&offset=0";
    let response = await fetch(url);
    let allPokemon = await response.json();
    let allPokemonNames = allPokemon.results;
    return allPokemonNames;
  }

  async function pokemonNamesToArray() {
    let pokemonData = await loadPokemonDataFromAPI();
    for (let i = 0; i < pokemonData.length; i++) {
      let names = pokemonData[i].name;
      pokemonNames.push(names);
    }
  }