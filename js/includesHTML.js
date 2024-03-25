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
        <div id="pokedex_${i}" class="pokedex" style="background-color: ${pokemonTypeColors[currentPokemon.types[0].type.name]};">
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
                                <img class="info_icon" src="../img/pokemon-icon.png" alt="" />
                                <span id="pokemon_weight_${i}"></span>
                            </div>
                            <div class="height">
                                <img class="info_icon" src="../img/pokemon-icon.png" alt="" />
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
                        <!-- <div class="abilities">
                            <span class="abilities_text">Abilities</span>
                            <span id="ability"></span>
                        </div> -->
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderPokemonHTML(x) {
    return /*html*/ `
        <div id="pokemon_container_${x}" class="pokemon_container"></div>
    `;
}

function renderBigPokemon(){
    
}