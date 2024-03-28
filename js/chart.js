function pokemonChart(){

  const ctx = document.getElementById('pokemon_chart');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['HP', 'ATK', 'DEF', 'SP-ATK', 'SP-DEF', 'SPEED'],
      datasets: [{
        label: 'Pokemon Stats',
        data: [currentPokemon.stats[0].base_stat, currentPokemon.stats[1].base_stat,
        currentPokemon.stats[2].base_stat, currentPokemon.stats[3].base_stat,
        currentPokemon.stats[4].base_stat, currentPokemon.stats[5].base_stat
        ],
        backgroundColor: [
          '#FF5959',
          '#F5AC78',
          '#FAE078',
          '#9DB7F5',
          '#A7DB8D',
          '#FA92B2'
        ],
        borderColor: [
          pokemonTypeColors[currentPokemon.types[0].type.name],
        ],
        borderWidth: 1, 
      }]
    },
    options: {
      scales: {
        y: {
          max: 255
        }
      },
      plugins: {
        legend: {
          display: false,
        }
      },
      indexAxis: 'x',
      responsive: true,
      maintainAspectRatio: false,
      events: ['mousemove', 'mouseout', 'touchstart', 'touchmove'], 
    }
  });
}