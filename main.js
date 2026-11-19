
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


async function getAndShowFirstTwentyPokemon() {
    let result = await getFirstTwentyPokemon()
    let cards = await mapPokemonInCard(result)
    showPokemonCards(cards)
}

async function getFirstTwentyPokemon() {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20")
    if (response.ok === false) {throw new Error("Laden fehlgeschlagen");}
    let result = await response.json()
    return(result)
}


async function mapPokemonInCard(result) {
    const cards = await Promise.all(result.results.map(async (pokemon) => {
        const link = pokemon.url
        const pokemonID = link.split("/").at(-2)
        const pokemonPicture = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + pokemonID + ".png"
        const detailResponse = await fetch(link)
        const detail = await detailResponse.json()
        const card = {
            id: pokemonID,
            image: pokemonPicture,
            name: pokemon.name,
            types: detail.types.map((entry) => entry.type.name),
        }
        return(card)
    }))
    return(cards)
}


async function showPokemonCards(cards) {
    cards.forEach((card) => {
        container.appendChild(createCard(card))
    })
}



getAndShowFirstTwentyPokemon().catch(showLoadError);




// ─── FR010 · Search with dialog ──────────────────────────────────────────────
// A search bar. On submit, show the results — or a "nothing found" message — in
// a <dialog>.
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");
const searchDialog = document.querySelector("#search-dialog");
const searchResults = document.querySelector("#search-results");

/**
 * Looks up one Pokémon by its exact name.
 * Returns a card object in the shape createCard expects,
 * or null when the API has no Pokémon with that name (404).
 */
async function searchPokemonByName(name) {
  const response = await fetch("https://pokeapi.co/api/v2/pokemon/" + encodeURIComponent(name));
  if (response.status === 404) {
    return null;
  }
 if (response.ok === false) {
  throw new Error("Laden fehlgeschlagen");
}
  const detail = await response.json();
  return {
    id: detail.id,
    image: "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/" + detail.id + ".png",
    name: detail.name,
    types: detail.types.map((entry) => entry.type.name),
  };
}

searchForm.addEventListener("submit", async function(event) {
  event.preventDefault();
  // The API only knows lowercase names, so "Pikachu" is turned into "pikachu".
  const query = searchInput.value.trim().toLowerCase();
  // Empty the field so the next search starts fresh instead of appending to the old name.
  searchInput.value = "";
  searchResults.textContent = "";
  if (query === "") {
    searchResults.textContent = "Bitte gib einen Pokémon-Namen ein.";
  } else {
    try {
      const pokemon = await searchPokemonByName(query);
    if (pokemon === null) {
searchResults.textContent = "Kein Pokémon mit diesem Namen gefunden.";
    } else {
  searchResults.appendChild(createCard(pokemon));
}
    } catch (error) {
      searchResults.textContent = "Die Suche ist fehlgeschlagen. Bitte versuche es erneut.";
    }
  }
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

// Kartenhintergrund je nach erstem Typ. Die Klassen stehen bewusst ausgeschrieben da:
// Sobald Tailwind als Build-Schritt läuft (Woche 2), erzeugt es nur Klassen, die es
// wörtlich im Code findet. Zusammengesetzte Namen wie `from-${farbe}-100` gingen dann verloren.
const typeGradients = {
    normal: 'from-stone-100 to-stone-300',
    fire: 'from-orange-100 to-red-400',
    water: 'from-sky-100 to-blue-400',
    electric: 'from-yellow-100 to-yellow-400',
    grass: 'from-green-100 to-green-400',
    ice: 'from-cyan-50 to-cyan-300',
    fighting: 'from-red-100 to-rose-400',
    poison: 'from-purple-100 to-purple-400',
    ground: 'from-amber-100 to-amber-400',
    flying: 'from-indigo-100 to-sky-300',
    psychic: 'from-pink-100 to-pink-400',
    bug: 'from-lime-100 to-lime-400',
    rock: 'from-yellow-100 to-stone-400',
    ghost: 'from-violet-200 to-indigo-400',
    dragon: 'from-indigo-100 to-violet-400',
    dark: 'from-stone-200 to-stone-400',
    steel: 'from-slate-100 to-slate-300',
    fairy: 'from-pink-50 to-rose-300'
};

function createCard(pokemon) {

    // 25 → "025". String(), weil die ID je nach Quelle als Zahl oder als Text kommt.
    const paddedId = String(pokemon.id).padStart(3, '0')
    const gradient = typeGradients[pokemon.types[0]] || 'from-gray-100 to-gray-300'

    // Außenrahmen: dicker dunkler Rand. "group" lässt den Glanzstreifen auf Hover der Karte reagieren.
    const pokeCard = document.createElement('article')
    pokeCard.className = 'pokemon-card group relative w-64 overflow-hidden rounded-2xl border-8 border-slate-800 bg-slate-800 shadow-md transition duration-300 hover:-translate-y-1 hover:rotate-1 hover:shadow-xl';

    // Innere Fläche: dünne helle Linie + Farbverlauf
    const cardFace = document.createElement('div')
    cardFace.className = `flex h-full flex-col gap-3 rounded-lg border-2 border-white/70 bg-linear-to-b ${gradient} p-3`
    pokeCard.appendChild(cardFace)

    // Kopfzeile: Name links, ID rechts
    const cardHeader = document.createElement('div')
    cardHeader.className = 'flex items-baseline justify-between gap-2'
    cardFace.appendChild(cardHeader)

    const pokeName = document.createElement('h2')
    pokeName.className = 'poke-name min-w-0 truncate text-xl font-bold capitalize text-slate-900'
    pokeName.textContent = pokemon.name
    cardHeader.appendChild(pokeName)

    const pokeID = document.createElement("p")
    pokeID.className = "poke-ID shrink-0 font-mono text-sm font-bold text-slate-700"
    pokeID.textContent = "#" + paddedId
    cardHeader.appendChild(pokeID)

    // Bildfenster: hell, eingerahmt, Innenschatten
    const imageWindow = document.createElement('div')
    imageWindow.className = 'flex justify-center rounded-lg border-2 border-white/80 bg-white/60 p-2 shadow-[inset_0_2px_6px_rgba(0,0,0,0.25)]'
    cardFace.appendChild(imageWindow)

    const pokeImage = document.createElement("img")
    pokeImage.className = "poke-image h-36 w-36 object-contain drop-shadow-md";
    pokeImage.alt = pokemon.name
    pokeImage.src = pokemon.image
    imageWindow.appendChild(pokeImage);

    // Typen als Badges, Farben aus Lennarts typeColors (gleicher Fallback wie bei ihm)
    const pokeType = document.createElement("p")
    pokeType.className = "poke-type flex flex-wrap justify-center gap-1.5"
    pokemon.types.forEach((type) => {
        const typeBadge = document.createElement('span')
        typeBadge.className = `rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize shadow-sm ring-1 ring-black/10 ${typeColors[type] || 'bg-gray-200 text-gray-800'}`
        typeBadge.textContent = type
        pokeType.appendChild(typeBadge)
    })
    cardFace.appendChild(pokeType)

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
        renderFavorites();
});

    favButton.className = "favourite-button mt-auto w-full cursor-pointer rounded-lg bg-slate-900 px-3 py-2 text-sm font-bold text-white shadow-md transition hover:bg-slate-700";
    favButton.textContent = favStatus
    cardFace.appendChild(favButton);

    // Fußzeile im Seriennummer-Stil
    const cardFooter = document.createElement('p')
    cardFooter.className = 'text-center font-mono text-[10px] tracking-wider text-slate-800'
    cardFooter.textContent = 'No. ' + paddedId + ' · Pokédex Diary'
    cardFace.appendChild(cardFooter)

    // Holo-Glanz: schräger Lichtstreifen, startet links außerhalb und läuft bei Hover
    // nach rechts raus. 150 % statt 100 %, weil die Schräge sonst unten rechts eine
    // Ecke stehen lässt. pointer-events-none, damit der Button klickbar bleibt.
    const holoShine = document.createElement('div')
    holoShine.className = 'pointer-events-none absolute inset-y-0 -left-full w-1/2 -skew-x-12 bg-linear-to-r from-transparent via-white/50 to-transparent transition-all duration-700 ease-out group-hover:left-[150%]'
    pokeCard.appendChild(holoShine)

    return pokeCard;
}







const loadMessage = document.querySelector("#load-message");
function showLoadError (){loadMessage.textContent="Pokémon konnten nicht geladen werden.";}
function clearLoadMessage(){loadMessage.textContent = "";}



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
  water: 'bg-blue-300 text-blue-900',
  normal: 'bg-neutral-300 text-neutral-900',
  ice: 'bg-cyan-300 text-cyan-900',
  fighting: 'bg-red-300 text-red-900',
  ground: 'bg-amber-300 text-amber-900',
  flying: 'bg-sky-300 text-sky-900',
  psychic: 'bg-pink-300 text-pink-900',
  bug: 'bg-lime-300 text-lime-900',
  rock: 'bg-stone-300 text-stone-900',
  ghost: 'bg-violet-300 text-violet-900',
  dragon: 'bg-indigo-300 text-indigo-900',
  dark: 'bg-slate-400 text-slate-900',
  steel: 'bg-zinc-300 text-zinc-900',
  fairy: 'bg-rose-300 text-rose-900'
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
