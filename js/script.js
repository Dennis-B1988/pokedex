const pokemonTypeColors = { normal: "#A8A878", fire: "#F08030", water: "#6890F0", electric: "#F8D030", grass: "#78C850", ice: "#98D8D8", fighting: "#C03028", poison: "#A040A0", ground: "#E0C068", flying: "#A890F0", psychic: "#F85888", bug: "#A8B820", rock: "#B8A038", ghost: "#705898", dragon: "#7038F8", dark: "#705848", steel: "#B8B8D0", fairy: "#EE99AC" };
let currentPokemon;
let pokemonId = 1;
let x = 1; // Used to create new pokemon containers

async function init(){
    await includeHTML();
    await loadPokemon();
}

// Loads first 40 pokemon
async function loadPokemon(){
    document.getElementById(`pokemon_container_${x}`).innerHTML = '';
    for(let i = 1; i <= pokemonId + 39; i++){
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();

        document.getElementById(`pokemon_container_${x}`).innerHTML += renderPokedexHTML(i, pokemonTypeColors);
        pokemonInfoAndColor(i);
    }
    pokemonId = 41;
    x++;
    document.getElementById('pokemon').innerHTML += renderPokemonHTML(x); // Seperates pokemon containers for every 40 pokemon
}

// Loads more pokemon
async function loadMorePokemon(){
    if(pokemonId < 986){
        for(let i = pokemonId; i <= pokemonId + 39; i++){
            let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
            let response = await fetch(url);
            currentPokemon = await response.json();
            document.getElementById(`pokemon_container_${x}`).innerHTML += renderPokedexHTML(i, pokemonTypeColors);
            pokemonInfoAndColor(i);
        }
        pokemonId += 40;
        x++;
        document.getElementById('pokemon').innerHTML += renderPokemonHTML(x);
    } else {
        loadLastPokemon();
        document.getElementById('load_more_pokemon').style.display = 'none';
    }
}

// Loads last pokemon stopping at 1024
async function loadLastPokemon(){
    for(let i = pokemonId; i <= 1025; i++){
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        document.getElementById(`pokemon_container_${x}`).innerHTML += renderPokedexHTML(i, pokemonTypeColors);
        pokemonInfoAndColor(i);
    }
}

// Needed?? WIP
async function clickToLoadPokemon(){
    await loadMorePokemon();
}

function pokemonInfoAndColor(i){
    renderPokemonInfo(i);
    // typeColorOne(i);
    // typeColorTwo(i);
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

function closeBigPokedex(){
    document.getElementById('big_content').style.display = 'none';
}

// Changes the color depending on the type
// function typeColorOne(i){
//     typeBug(i);
//     typeDark(i);
//     typeDragon(i);
//     typeElectric(i);
//     typeFairy(i);
//     typeFighting(i);
//     typeFire(i);
//     typeFlying(i);
//     typeGhost(i);  
// }

// function typeColorTwo(i){
//     typeGrass(i);
//     typeGround(i);
//     typeIce(i);
//     typeNormal(i);
//     typePoison(i);
//     typePsychic(i);
//     typeRock(i);
//     typeSteel(i);
//     typeWater(i);
// }