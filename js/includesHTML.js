async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}

function renderPokedexHTML(i, pokemonTypeColors) {
    return /*html*/ `
        <div onclick="openBigPokedex(${i})" id="${currentPokemon.name}" class="pokedex" style="background-color: ${pokemonTypeColors[currentPokemon.types[0].type.name]};">
            <div class="pokedex_top">
                <div class="title_card">
                    <span id="pokemon_name_${i}"></span>
                    <span id="pokemon_id_${i}"></span>
                </div>
                <img id="pokemon_image_${i}" class="pokemon_image" src="#" alt="" />
            </div>
            <div class="info_container">
                <div class="left_info">
                    <div class="info">
                        <div class="about">About</div>
                        <div class="about_info">
                            <div class="weight">
                                <img class="info_icon" src="../img/gewicht.png" alt="" />
                                <span id="pokemon_weight_${i}"></span>
                            </div>
                            <div class="height">
                                <img class="info_icon" src="../img/lineal.png" alt="" />
                                <span id="pokemon_height_${i}"></span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="middle_line"></div>
                <div class="right_info">
                    <div class="info">
                        <div class="types">
                            <span class="types_text">Types</span>
                            <span id="pokemon_type_one_${i}" class="type" style="background-color: ${pokemonTypeColors[currentPokemon.types[0].type.name]};"></span>
                            <span id="pokemon_type_two_${i}" class="type"></span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderBigPokedex(i, pokemonTypeColors){
    return /*html*/ `
        <div  id="${currentPokemon.name}_big" class="pokedex_big" style="background-color: ${pokemonTypeColors[currentPokemon.types[0].type.name]};">
            <div class="pokedex_top_big">
                <div class="title_card_big">
                    <span id="pokemon_name_big_${i}"></span>
                    <span id="pokemon_id_big_${i}"></span>
                </div>
                
            </div>
            <img id="pokemon_image_big_${i}" class="pokemon_image_big" src="#" alt="" /> 
            <div class="info_container_big">
                <div class="types_big">
                    <span id="pokemon_type_one_big_${i}" class="type_big" style="background-color: ${pokemonTypeColors[currentPokemon.types[0].type.name]};"></span>
                    <span id="pokemon_type_two_big_${i}" class="type_big"></span>
                </div>
                <div class="evolves_from">
                    <span id="evolves_from_text" class="evolves_from_text"></span>
                    <span id="evolves_from_pokemon" class="evolves_from_pokemon"></span>
                </div>
                <div id="chart" class="chart">
                    <canvas id="pokemon_chart" class="pokemon_chart" ></canvas>
                </div>
            </div>
        </div>
    `;
}

function renderPokemonHTML(pokemonContainer) {
    return /*html*/ `
        <div id="pokemon_container_${pokemonContainer}" class="pokemon_container"></div>
    `;
}