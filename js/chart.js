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
        // 'rgb(255, 205, 86)',
        // 'rgb(75, 192, 192)',
        // 'rgb(54, 162, 235)',
        // 'rgb(153, 102, 255)',
        // 'rgb(201, 203, 207)'
      ],
      borderWidth: 1,
      
    }]
  },
  options: {
    plugins: {
      legend: {
        display: false,
      }
    },
    indexAxis: 'y',
    responsive: true,
    maintainAspectRatio: false,
    events: ['mousemove', 'mouseout', 'touchstart', 'touchmove'],
  }
});
}
