let currentPokemon;

async function init(){
    await includeHTML();
    await loadPokemon();
}

async function loadPokemon(){
    let url = "https://pokeapi.co/api/v2/pokemon/charmander";
    let response = await fetch(url);
    currentPokemon = await response.json();

    console.log('Loaded Pokemon', currentPokemon);
    renderPokemonInfo();
}

function renderPokemonInfo(){
    document.getElementById('pokemon_name').innerHTML = currentPokemon.name;
    document.getElementById('pokemonImage').src = currentPokemon.sprites.front_shiny;
}