// main.js — Homepage
//
// This file is yours to type. The section markers below are landmarks and
// nothing else: they name each requirement so that the brief, your GitHub
// issues, the agent and this file all use the same words for the same thing.
//
// Nothing depends on them. Move them, rename them, delete them, write your code
// in a different order — the harness looks at what your code *does*, never at
// where these comments are.
//
// Split them into functions however you like. There are no stubs here on
// purpose: how you break the work up is part of the work.


// ─── FR009 · Fetch popular movies ────────────────────────────────────────────
// Fetch the popular movies from TMDB and show them on this page.





// ─── FR010 · Search with dialog ──────────────────────────────────────────────
// A search bar. On submit, show the results — or a "nothing found" message — in
// a <dialog>.





// ─── FR011 · Movie cards ─────────────────────────────────────────────────────
// One card per movie: image, title, and enough info to be worth looking at.
const container = document.querySelector('#pokemon-list')


const dummyPokemon = [
    {
        id: 25,
        name: 'pikachu',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png',
        types: ['electric']
    },
    {
        id: 1,
        name: 'bulbasaur',
        image: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        types: ['grass', 'poison']
    }
];

function createCard(pokemon) {

    const pokeCard = document.createElement('article')
    pokeCard.className = 'pokemon-card';

    const pokeName = document.createElement('h2')
    pokeName.className = 'poke-name'
    pokeName.textContent = pokemon.name
    pokeCard.appendChild(pokeName)

    const pokeImage = document.createElement("img")
    pokeImage.className = "poke-image";
    pokeImage.alt = pokemon.name
    pokeImage.src = pokemon.image
    pokeCard.appendChild(pokeImage);

    const pokeID = document.createElement("p")
    pokeID.className = "poke-ID"
    pokeID.textContent = "#" + pokemon.id
    pokeCard.appendChild(pokeID)

    const pokeType = document.createElement("p")
    pokeType.className = "poke-type"
    pokeType.textContent = pokemon.types.join(', ')
    pokeCard.appendChild(pokeType)

    const checkFav = JSON.parse(localStorage.getItem('pokedexFavorites')) || [];
    const isFav = checkFav.some((fav) => fav.id === pokemon.id);
    let favStatus = isFav ? '⭐ bereits Favorit' : 'zu Favoriten';

    // ─── FR012 · Add to favourites ───────────────────────────────────────────────
    // An "add to favourites" button. The movie is stored as an object, in an array,
    // in localStorage — the Journal page reads it back out from there.

    const favButton = document.createElement("button")
    favButton.addEventListener('click', () => {
        const favPoke = { ...pokemon, note: '' }
        const saveFavList = JSON.parse(localStorage.getItem('pokedexFavorites')) || [];
        const alreadyFavTest = saveFavList.some((alreadyFav) => alreadyFav.id === pokemon.id);
        if (alreadyFavTest) {
            const notInFavList = saveFavList.filter((fav) => fav.id !== pokemon.id);
            localStorage.setItem("pokedexFavorites", JSON.stringify(notInFavList));
            favButton.textContent = 'zu Favoriten';

        } else {
            const newFavEntry = [favPoke, ...saveFavList];
            localStorage.setItem("pokedexFavorites", JSON.stringify(newFavEntry));
            favButton.textContent = '⭐ bereits Favorit';
        }

    });

    favButton.className = "favourite-button";
    favButton.textContent = favStatus
    pokeCard.appendChild(favButton);

    return pokeCard;
}

dummyPokemon.forEach((pokemon) => {

    container.appendChild(createCard(pokemon))

});







// ─── FR013 · Empty and error states ──────────────────────────────────────────
// When the films cannot be loaded — TMDB is down, the token is wrong, the wifi
// is gone — the page says so instead of sitting empty. Same when a search finds
// nothing.




// ─── FR014 · The favourite button knows ──────────────────────────────────────
// A card's favourite button shows whether that film is already in the journal,
// and flips when clicked, without the whole list being drawn again.
