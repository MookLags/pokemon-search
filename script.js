const pokeApiUrl = "https://pokeapi-proxy.freecodecamp.rocks/api/pokemon/";

const pokedexContainer = document.getElementById("pokedex-container");
const search = document.getElementById("search-input");
const searchBtn = document.getElementById("search-button");
const previousBtn = document.getElementById("previous-btn");
const nextBtn = document.getElementById("next-btn");
const pokemonNameH3 = document.getElementById("pokemon-name");
const spriteContainer = document.getElementById("sprite-container");
const typesDiv = document.getElementById("types");
const pokemonIdPara = document.getElementById("pokemon-id");
const heightPara = document.getElementById("height");
const weightPara = document.getElementById("weight");
const pokeball = document.getElementById("pokeball");
const pcBootAudio = document.getElementById("pc-boot-audio");

let currentPokemonId = 0;

const playSound = () => {
  pcBootAudio.play();
}

searchBtn.addEventListener("click", () => {
  if (search.value !== "") {
    spinPokeball();
    getData();
    playSound();
  } else {
    alert("Please enter something");
  }
});

previousBtn.addEventListener("click", () => {
  if (currentPokemonId > 1) {
    currentPokemonId -= 1;
    search.value = currentPokemonId;
    playSound();
    spinPokeball();
    getData();
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPokemonId < 1025) {
    currentPokemonId += 1;
    search.value = currentPokemonId;
    spinPokeball();
    getData();
    playSound();
  }
});

search.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    spinPokeball();
    getData();
    playSound();
  }
});

const spinPokeball = () => {
  let currentRotation = parseInt(pokeball.dataset.rotation || "-20");
  currentRotation += 720;
  pokeball.style.transform = `rotate(${currentRotation}deg)`;

  pokeball.dataset.rotation = currentRotation;
};

const getData = async () => {
  try {
  const pokemonNameOrIdUrl = pokeApiUrl + search.value.toLowerCase() + "/";
  const res = await fetch(pokemonNameOrIdUrl);
  const data = await res.json();
  typesDiv.innerHTML = "";
  displayBaseStats(data);
  } catch (e) {
    alert("Pokemon not found");
    updateButtonState();
  }
};

const updateButtonState = () => {
  previousBtn.disabled = currentPokemonId <= 1;
  nextBtn.disabled = currentPokemonId >= 1025;
  };

const getStatColor = (num) => {
  let strong = "var(--strong-stat-color)";
  let average = "var(--average-stat-color)";
  let below = "var(--below-average-stat-color)";
  let weak = "var(--weak-stat-color)";
  
  let stat = parseInt(num);

  return stat > 100 ? strong : stat > 70 ? average : stat > 50 ? below : weak;
  
};

const displayBaseStats = (data) => {
  const { height, id, name: pokemonName, sprites, stats, types, weight } = data;
  const { front_default } = sprites;

  currentPokemonId = id;

  heightPara.innerHTML = `Height: ${height}`;  
  weightPara.innerHTML = `Weight: ${weight}`;
  pokemonIdPara.innerHTML = `#${id}`; 
  pokemonNameH3.innerHTML = `${pokemonName.toUpperCase()}`;
  spriteContainer.innerHTML = `<img id="sprite" src="${front_default}" />
  `;

  for (let i = 0; i < types.length; i++) {
    typesDiv.innerHTML += `<div id="type-div"><p class="${types[i].type.name}">${types[i].type.name.toUpperCase()}</p></div>`;
  };

  for (let i = 0; i < stats.length; i++) {
    let targetPara = document.getElementById(`${stats[i].stat.name}`);
    let targetDisplay = document.getElementById(`${stats[i].stat.name}-display`);
    targetPara.innerHTML = `${stats[i].base_stat}`;
    targetDisplay.style.backgroundColor = getStatColor(`${stats[i].base_stat}`)
    targetDisplay.style.width = `${stats[i].base_stat}px`;
  }

}
