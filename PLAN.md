FR001 	Group Collaboration 	You build it as a group, and everyone shares responsibility for it.
FR002 	Group Guidelines 	Follow best practices for teamwork and communication.
FR003 	Public GitHub Repo 	Work in one public repo created from the template. Do not add instructors as collaborators.
FR004 	PR Workflow 	All updates merge into main strictly through Pull Requests.
FR005 	Core Web APIs 	Demonstrate usage of DOM manipulation, localStorage, and fetch.
FR006 	Tailwind Styling 	Style UI using Tailwind CSS utilities via CDN script.
FR007 	File Structure 	Setup dual-page app (index.html ↔ main.js, pokedex.html ↔ pokedex.js).
FR008 	Navigation Bar 	A navbar on both pages, switching between the homepage and the pokedex.
FR009 	Fetch API Data 	Fetch and render popular movies or Pokémon dynamically on load.
FR010 	Search Modal 	Provide search input; display query results or messages in a dialog modal.
FR011 	Component Cards 	Each movie's image, title and info, laid out as a card.
FR012 	Save to Favourites 	An "add to favourites" button that stores the movie as an object in an array in localStorage.
FR013 	Empty & Error States 	When the films cannot be loaded, or a search finds nothing, the page says so instead of sitting empty.
FR014 	Card State Toggle 	A card's favourite button shows whether that film is already in your pokedex, and flips when you click it.
FR015 	Favourites Display 	The pokedex page lists the favourite movies from localStorage, with image, title and info.
FR016 	Personal Notes 	Allow users to attach custom text notes to saved objects in localStorage.
FR017 	Remove Favourites 	Delete selected objects from localStorage and update the view without full reload.


Lennart - lennart.dmoch@gmail.com
Frank - fraendk@hotmail.com
Daniel - danielciekalski@gmail.com
Dustin - dustin.jabs98@icloud.com

1. landing page (FR008, die search bar aus fr010, fr013)
2. die pokedex cards  (fr011, fr012, fr014)
3. Data fetch (fr009, die search results aus fr010)
4. favorite funktion ( fr015, fr016, fr017)

Tasks:
// FR001 : nichts zu tun
// FR002 : nichts zu tun
// FR003 : nichts zu tun
// FR004 : nichts zu tun
// FR005 : nichts zu tun
// FR006 : nichts zu tun 
FR007 : Dustin
FR008 : Frank
FR009 : Dustin
FR010 : Frank
FR011 : Daniel
FR012 : Daniel
FR013 : Frank
FR014 : Daniel
FR015 : Lennart
FR016 : Lennart
FR017 : Lennart

Dummy Data to be used: 
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