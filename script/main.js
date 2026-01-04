// ===== CONFIG =====
const API_KEY = '71034be6716933659774eac4c597bdc6';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

// ===== ELEMENTS =====
const nav = document.querySelector('[data-nav]');
const openBtn = document.querySelector('.nav-toggle');
const closeBtn = document.querySelector('.nav-close');
const moviesEl = document.getElementById('movies');
const pageTitle = document.querySelector('.page-title');
const categoryButtons = document.querySelectorAll('[data-category]');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const errorMessage = document.getElementById('errorMessage');
const loadingSpinner = document.getElementById('loadingSpinner');

// MODAL ELEMENTS
const modal = document.getElementById('movieModal');
const modalClose = document.querySelector('.movie-modal-close');
const modalTitle = document.getElementById('modalTitle');
const modalOverview = document.getElementById('modalOverview');
const modalPoster = document.getElementById('modalPoster');
const modalRelease = document.getElementById('modalRelease');
const modalVote = document.getElementById('modalVote');

// STORE CURRENT MOVIES
let currentMovies = [];

// ===== NAV CONTROLS =====
openBtn.addEventListener('click', () => nav.classList.add('is-open'));
closeBtn.addEventListener('click', () => nav.classList.remove('is-open'));

// ===== SPINNER HELPERS =====
function showSpinner() { loadingSpinner.style.display = 'flex'; }
function hideSpinner() { loadingSpinner.style.display = 'none'; }

// ===== FETCH MOVIES =====
async function fetchMovies(category) {
  showSpinner();
  try {
    const res = await fetch(`${BASE_URL}/movie/${category}?api_key=${API_KEY}`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      errorMessage.textContent = 'No movies found.';
      errorMessage.style.display = 'block';
      currentMovies = [];
      moviesEl.innerHTML = '';
      return;
    }

    errorMessage.style.display = 'none';
    currentMovies = data.results;
    showMovies(currentMovies);
  } catch (error) {
    errorMessage.textContent = 'Failed to fetch movies. Please try again later.';
    errorMessage.style.display = 'block';
    console.error(error);
  } finally {
    hideSpinner();
  }
}

// ===== DISPLAY MOVIES =====
function showMovies(movies) {
  moviesEl.innerHTML = '';

  if (!movies || movies.length === 0) {
    errorMessage.textContent = 'No movies found.';
    errorMessage.style.display = 'block';
    return;
  }

  errorMessage.style.display = 'none';

  movies.forEach(movie => {
    const movieEl = document.createElement('div');
    movieEl.classList.add('movie');

    movieEl.innerHTML = `
      <img src="${movie.poster_path ? IMG_URL + movie.poster_path : 'https://via.placeholder.com/300x450'}" alt="${movie.title}">
      <div class="movie-info-overlay">
        <h3>${movie.title}</h3>
        <p>${movie.overview || 'No description available.'}</p>
        <small>⭐ ${movie.vote_average}</small>
      </div>
    `;

    moviesEl.appendChild(movieEl);
  });
}

// ===== CATEGORY CLICK =====
categoryButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const category = btn.dataset.category;
    pageTitle.textContent = btn.textContent;
    fetchMovies(category);
    nav.classList.remove('is-open');
  });
});

// ===== SEARCH =====
async function searchMovies(query) {
  if (!query) return;
  pageTitle.textContent = `Search: ${query}`;
  showSpinner();
  try {
    const res = await fetch(`${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
    const data = await res.json();

    if (!data.results || data.results.length === 0) {
      errorMessage.textContent = 'No movies found for this search.';
      errorMessage.style.display = 'block';
      currentMovies = [];
      moviesEl.innerHTML = '';
      return;
    }

    errorMessage.style.display = 'none';
    currentMovies = data.results;
    showMovies(currentMovies);
  } catch (error) {
    errorMessage.textContent = 'Failed to search movies. Please try again later.';
    errorMessage.style.display = 'block';
    console.error(error);
  } finally {
    hideSpinner();
  }
}

// SEARCH EVENTS
searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  searchMovies(query);
});
searchInput.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    const query = searchInput.value.trim();
    searchMovies(query);
  }
});

// ===== MODAL =====
moviesEl.addEventListener('click', e => {
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
modalClose.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', e => { if (e.target === modal) modal.style.display = 'none'; });

// ===== INITIAL LOAD =====
fetchMovies('popular');
