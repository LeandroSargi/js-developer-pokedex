const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const pokemonModal = document.getElementById('pokemonModal');
const pokemonDetails = document.getElementById('pokemonDetails');
const closeModalButton = document.getElementById('closeModal');


const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})


// Função para abrir o modal com os detalhes do Pokémon
function showPokemonDetails(pokemon) {
    const { name, sprites, types } = pokemon;
    const typesList = types.map(typeInfo => typeInfo.type.name).join(', ');

    pokemonDetails.innerHTML = `
        <h2>${name.toUpperCase()}</h2>
        <img src="${sprites.front_default}" alt="${name}">
        <p><strong>Types:</strong> ${typesList}</p>
    `;

    pokemonModal.classList.remove('hidden');
}

// Função para fechar o modal
function closeModal() {
    pokemonModal.classList.add('hidden');
}

// Adicionar eventos aos Pokémons na lista
function addPokemonClickEvent() {
    const pokemonItems = document.querySelectorAll('.pokemon-item');

    pokemonItems.forEach(item => {
        item.addEventListener('click', async () => {
            const pokemonId = item.dataset.id;
            const pokemon = await getPokemonById(pokemonId); // Função para buscar detalhes do Pokémon
            showPokemonDetails(pokemon);
        });
    });
}

// Adicionar evento para fechar o modal
closeModalButton.addEventListener('click', closeModal);

// Carregar mais pokémons e adicionar eventos
loadMoreButton.addEventListener('click', () => {
    loadPokemons().then(addPokemonClickEvent);
});

// Inicializar com eventos
addPokemonClickEvent();

