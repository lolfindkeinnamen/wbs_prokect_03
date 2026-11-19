
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
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchDialog = document.querySelector("#search-dialog");
const searchResults = document.querySelector("#search-results");
searchForm.addEventListener("submit", function(event) {
  event.preventDefault();
  const query = searchInput.value .trim();
  if (query === ""){searchResults.textContent ="Bitte gib einen Pokémon-Namen ein."}else {searchResults.textContent = query;}
  console.log(query);
  searchDialog.showModal();
});


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

    // ─── FR012 · Add to favourites ───────────────────────────────────────────────
    // An "add to favourites" button. The movie is stored as an object, in an array,
    // in localStorage — the Journal page reads it back out from there.

    const favButton = document.createElement("button")
    favButton.addEventListener('click', () => {
        const favPoke = { ...pokemon, note: '' }
        const saveFavList = JSON.parse(localStorage.getItem('pokedexFavorites')) || [];
        const newFavEntry = [favPoke, ...saveFavList];
        localStorage.setItem("pokedexFavorites", JSON.stringify(newFavEntry));
        renderFavorites();
    });

    favButton.className = "favourite-button";
    favButton.textContent = "Zu Favoriten"
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
const FAVORITES_KEY = 'pokedexFavorites';

// ---------- localStorage Helpers ----------
function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY)) || [];
  } catch {
    return [];
  }
}

function saveFavorites(favorites) {
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

// Dummy-Daten einmalig einspielen 
//if (!localStorage.getItem(FAVORITES_KEY)) {
//  saveFavorites(dummyPokemon);
//}

// ---------- FR016: Notiz speichern ----------
function saveNote(id, noteText) {
  const favorites = getFavorites();
  const pokemon = favorites.find((p) => p.id === id);
  if (!pokemon) return;
  pokemon.note = noteText.trim();
  saveFavorites(favorites);
}

// ---------- FR017: Favorit entfernen  ----------
function removeFavorite(id, cardElement) {
  const favorites = getFavorites().filter((p) => p.id !== id);
  saveFavorites(favorites);
  cardElement.remove();          // nur die Karte aus dem DOM nehmen
  updateFavoritesInfo(favorites.length);
}

const typeColors = {
  electric: 'bg-yellow-300 text-yellow-900',
  grass: 'bg-green-300 text-green-900',
  poison: 'bg-purple-300 text-purple-900',
  fire: 'bg-orange-300 text-orange-900',
  water: 'bg-blue-300 text-blue-900'
};

function updateFavoritesInfo(count) {
  document.getElementById('favorites-count').textContent = count;
  document.getElementById('favorites-empty').classList.toggle('hidden', count > 0);
}

// ---------- Eine Favoriten-Karte  ----------
function createFavoriteCard(pokemon) {
  const card = document.createElement('li');
  card.className = 'rounded-lg border border-gray-200 bg-white p-3 shadow-sm';

  // Kopfzeile: Bild + Titel + Infos
  const header = document.createElement('div');
  header.className = 'flex items-center gap-3';

  const img = document.createElement('img');
  img.src = pokemon.image;
  img.alt = pokemon.name;
  img.className = 'h-16 w-16 object-contain';
  header.appendChild(img);

  const info = document.createElement('div');
  info.className = 'flex-1';

  const title = document.createElement('h3');
  title.className = 'font-semibold text-gray-800';
  title.textContent = pokemon.name;
  info.appendChild(title);

  const idText = document.createElement('p');
  idText.className = 'text-xs text-gray-500';
  idText.textContent = `#${String(pokemon.id).padStart(4, '0')}`;
  info.appendChild(idText);

  const typeList = document.createElement('div');
  typeList.className = 'mt-1 flex flex-wrap gap-1';
  pokemon.types.forEach((type) => {
    const badge = document.createElement('span');
    badge.className = `rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[type] || 'bg-gray-200 text-gray-800'}`;
    badge.textContent = type;
    typeList.appendChild(badge);
  });
  info.appendChild(typeList);
  header.appendChild(info);

  // FR017: Entfernen-Button
  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50';
  removeBtn.textContent = '✕';
  removeBtn.title = 'Remove from favourites';
  removeBtn.addEventListener('click', () => removeFavorite(pokemon.id, card));
  header.appendChild(removeBtn);

  card.appendChild(header);

  // FR016: Notizfeld
  const noteArea = document.createElement('textarea');
  noteArea.className = 'mt-3 w-full rounded border border-gray-300 p-2 text-sm focus:border-red-400 focus:outline-none';
  noteArea.rows = 2;
  noteArea.placeholder = 'Add a personal note...';
  noteArea.value = pokemon.note || '';
  card.appendChild(noteArea);

  const noteFooter = document.createElement('div');
  noteFooter.className = 'mt-1 flex items-center justify-end gap-2';

  const savedMsg = document.createElement('span');
  savedMsg.className = 'hidden text-xs text-green-600';
  savedMsg.textContent = 'Saved!';
  noteFooter.appendChild(savedMsg);

  const saveBtn = document.createElement('button');
  saveBtn.type = 'button';
  saveBtn.className = 'rounded bg-red-500 px-3 py-1 text-xs font-medium text-white hover:bg-red-600';
  saveBtn.textContent = 'Save note';
  saveBtn.addEventListener('click', () => {
    saveNote(pokemon.id, noteArea.value);
    savedMsg.classList.remove('hidden');
    setTimeout(() => savedMsg.classList.add('hidden'), 1500);
  });
  noteFooter.appendChild(saveBtn);

  card.appendChild(noteFooter);
  return card;
}

// ---------- FR015: Alle Favoriten anzeigen ----------
function renderFavorites() {
  const list = document.getElementById('favorites-list');
  list.textContent = ''; // Liste leeren

  const favorites = getFavorites();
  favorites.forEach((pokemon) => {
    list.appendChild(createFavoriteCard(pokemon));
  });
  updateFavoritesInfo(favorites.length);
}

document.addEventListener('DOMContentLoaded', renderFavorites);
