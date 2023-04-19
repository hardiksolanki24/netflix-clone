//Consts
const apikey = "38deca7304e13deb5ee5c96442c4c4d3";
const apiEndpoint = "https://api.themoviedb.org/3";
const imgPath = "https://image.tmdb.org/t/p/original";
const youtube_apikey ="AIzaSyDTn0sVDpk5kCcE4D-qdXvEx6X_c78I-uc"
const apiPaths = {
    // fetchALLCategories:``
    fetchALLCategories : `${apiEndpoint}/genre/movie/list?api_key=${apikey}`,
    fetchMovieList : (id) => `${apiEndpoint}/discover/movie?api_key=${apikey}&with_genres=${id}`,
    fetchTreading: `${apiEndpoint}/trending/all/day?api_key=${apikey}&language=en-US`,
    searchOnYoutube: (query) =>`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&key=${youtube_apikey}`
    
} 


//Boots up the App
function init(){
    fetchTrendingMovies(); 
    fetchAndBuitALLSections();
    // fetchTrendingMovies();
    // fetch(apiPaths.fetchALLCategories)
    // .then(res=>res.json())
    // .then(res=>console.table(res.genres))
    // .catch(err=>console.error(err));
}
function fetchTrendingMovies(){
    fetchAndBuildMovieSection(apiPaths.fetchTreading,'Treading Now')
    .then(list=>{
        const randomIndex = parseInt(Math.random()*list.length); 
        buildBannerSection(list[randomIndex]);
    }).catch(err=>{
        console.error(err);
    });
}

function buildBannerSection(movie){
    const bannerCont = document.getElementById('banner-section');
    bannerCont.style.backgroundImage = `url('${imgPath}${movie.backdrop_path}')`;

    const div = document.createElement('div');
    div.innerHTML = `
        <h2 class="banner-title">${movie.title}</h2>
        <p class="banner-info">Trending in Movies | Released - ${movie.release_date}</p>
        <p class="banner-overview">${movie.overview && movie.overview.length>200 ? movie.overview.slice(0,200).trim()+'...' : movie.overview}</p>
        <div class="action-buttons-cont">
            <button class="action-button"><i style="font-size:18px" class="fa">&#xf04b;</i> &nbsp; Play</button>
            <button class="action-button"><i style="font-size:18px" class="fa">&#xf05a;</i> &nbsp; More
                Info</button>
        </div>
    `;
    div.className="banner-content container";

    bannerCont.append(div);
}


function fetchAndBuitALLSections(){
    fetch(apiPaths.fetchALLCategories)
    .then(res => res.json())
    .then(res => {
        const categories = res.genres;
        if(Array.isArray(categories) && categories.length){
            categories.forEach(category => { 
                fetchAndBuildMovieSection(
                    apiPaths.fetchMovieList(category.id),
                    category.name   
                );
            });
        }
        // console.table(movies);
    })
    .catch(err=>console.error(err));
}

function fetchAndBuildMovieSection(fetchUrl,categoryName){
    // console.log(fetchUrl,categoryName);
    return fetch(fetchUrl)
    .then(res => res.json())
    .then(res=>{ 
        // console.table(res.results);
        const movies = res.results;
        if(Array.isArray(movies) && movies.length){
            buildMoviesSection(movies.slice(0,8),categoryName);
        }
        return movies;
    })
    .catch(err=>console.error(err))
}

function buildMoviesSection(list,categoryName){
    // console.log(list,categoryName)

    const movieCont = document.getElementById('movies-cont');

    const moviesListHTML = list.map(item=> {
        return `
            <div class="movie-item" onmouseenter="searchMovieTrailer('${item.title}','yt${item.id}')">
                <img class="movie-item-img" src="${imgPath}${item.backdrop_path}" alt="${item.title}"/>
                <iframe width="245px" height="150px" src="" id="yt${item.id}"> </iframe>
            </div>`;
    }).join('');
    
    const moviesSectionHTML = `  
            <h2 class="moives-section-heading">${categoryName} <span class="explore-nudge">Explore All</span></h2>
            <div class="movies-row">
                ${moviesListHTML}
            </div>
        </div>
    `
    const div = document.createElement('div');
    div.className = "movies-section";   
    div.innerHTML = moviesSectionHTML;

    //append html into container
    movieCont.append(div);  
     
}

function searchMovieTrailer(movieName,iframId){
    console.log(document.getElementById(iframId),iframId);
    if(!movieName) return;

    fetch(apiPaths.searchOnYoutube(movieName))
    .then(res => res.json())
    .then(res =>{
        const bestResult = res.items[0];
        const youtubeUrl = `https://www.youtube.com/watch?v=${bestResult.id.videoId}`; 
        console.log(youtubeUrl);
        const elements = document.getElementById(iframId);
        elements.src = `https://www.youtube.com/embed/${bestResult.id.videoId}?autoplay=1&controls=0`;
    })
    .catch(err=>console.log(err));
}
window.addEventListener('load',function(){
    init();
    window.addEventListener('scroll',function(){
          // header ui update
          const header = document.getElementById('header');
          if (window.scrollY >5) header.classList.add('black-bg')
          else header.classList.remove('black-bg');
    })
})