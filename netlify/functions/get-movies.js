// CONFIG 
const API_KEY = '71034be6716933659774eac4c597bdc6';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// ELEMENTS
const nav = document.querySelector('[data-nav]');
const openBtn = document.querySelector('.nav-toggle');
const closeBtn = document.querySelector('.nav-close');
const moviesEl = document.getElementById('movies');
const pageTitle = document.querySelector('.page-title');
const categoryButtons = document.querySelectorAll('[data-category]');

//NAV CONTROLS 
openBtn.addEventListener('click', () => {
  nav.classList.add('is-open');
});

closeBtn.addEventListener('click', () => {
  nav.classList.remove('is-open');
});

//  FETCH MOVIES 
async function fetchMovies(category) {
  try {
    const res = await fetch(
      `${BASE_URL}/movie/${category}?api_key=${API_KEY}`
    );
    const data = await res.json();
    showMovies(data.results);
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}

// DISPLAY MOVIES 
function showMovies(movies) {
  moviesEl.innerHTML = '';

  movies.forEach(movie => {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    movieEl.innerHTML = `
      <img 
        src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/300x450'}"
        alt="${movie.title}"
      />
      <div class="movie-info-overlay">
        <h3>${movie.title}</h3>
        <p>${movie.overview || 'No description available.'}</p>
        <small>⭐ ${movie.vote_average}</small>
      </div>
    `;

    moviesEl.appendChild(movieEl);
  });
}

// CATEGORY CLICK 
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    pageTitle.textContent = btn.textContent;
    fetchMovies(category);
    nav.classList.remove('is-open');
  });
});

// LOAD DEFAULT
fetchMovies('popular');

// MODAL ELEMENTS
const modal = document.getElementById('movieModal');
const modalClose = document.querySelector('.movie-modal-close');
const modalTitle = document.getElementById('modalTitle');
const modalOverview = document.getElementById('modalOverview');
const modalPoster = document.getElementById('modalPoster');
const modalRelease = document.getElementById('modalRelease');
const modalVote = document.getElementById('modalVote');

// OPEN MODAL ON CLICK
moviesEl.addEventListener('click', (e) => {
  const movieCard = e.target.closest('.movie');
  if (!movieCard) return;

  const index = Array.from(moviesEl.children).indexOf(movieCard);
  const movie = currentMovies[index];

  modal.style.display = 'block';
  modalTitle.textContent = movie.title;
  modalOverview.textContent = movie.overview;
  modalPoster.src = movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/300x450';
  modalRelease.textContent = 'Release Date: ' + movie.release_date;
  modalVote.textContent = 'Rating: ⭐ ' + movie.vote_average;
});

// CLOSE MODAL
modalClose.addEventListener('click', () => {
  modal.style.display = 'none';
});

// CLICK OUTSIDE MODAL TO CLOSE
window.addEventListener('click', (e) => {
  if (e.target === modal) modal.style.display = 'none';
});

// STORE CURRENT MOVIES FOR MODAL REFERENCE
let currentMovies = [];

async function fetchMovies(category) {
  try {
    const res = await fetch(`${BASE_URL}/movie/${category}?api_key=${API_KEY}`);
    const data = await res.json();
    currentMovies = data.results; // save for modal
    showMovies(currentMovies);
  } catch (error) {
    console.error('Error fetching movies:', error);
  }
}
