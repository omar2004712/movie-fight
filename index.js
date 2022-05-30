//api key 3bf6204b
const fetchData = async (searchTerm)=>{
    const response = await axios.get("http://www.omdbapi.com/", {
        params:{
            apikey: "3bf6204b",
            s: searchTerm
        }
    });
    if(!response.data.Search){
        return [];
    }
    return response.data.Search;
}

const root = document.querySelector('.autocomplete');
root.innerHTML = `
    <input class="input" placeholder = "First Movie"/>
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
`


const input = document.querySelector(".input");
const dropdown = document.querySelector(".dropdown");
const resultsWrapper = document.querySelector(".results")

const onInput = debounceHelper(async event => {
    const movies = await fetchData(event.target.value.trim());
    
    if(!movies.length){
        dropdown.classList.remove("is-active")
        return;
    }

    resultsWrapper.innerHTML = "";

    dropdown.classList.add('is-active')

    for (let movie of movies){
        const option = document.createElement('a');
        option.classList.add('dropdown-item')
        let imgSrc = movie.Poster == "N/A" ? "" : movie.Poster;
        option.innerHTML = `
            <img src="${imgSrc}"/>
            <b>${movie.Title}</b>
        `
        option.addEventListener('click', ()=>{
            dropdown.classList.remove('is-active');
            input.value = movie.Title;
            onMovieSelect(movie)
        })
        resultsWrapper.appendChild(option);
    }
}, 500)

input.addEventListener('input', onInput)

document.addEventListener('click', (event)=>{
    if(!root.contains(event.target)){
        dropdown.classList.remove('is-active')
    }
})

const onMovieSelect = async (movie)=>{
    const {imdbID: movieId} = movie
    const response = await axios.get("http://www.omdbapi.com/", {
        params:{
            apikey: "3bf6204b",
            i: movieId
        }
    });
    document.querySelector("#summary").innerHTML = movieTemplate(response.data);
}

const movieTemplate = (movieDetail)=>{
    return `
    <article class="media">
        <figure class="media-left">
            <p class="image">
                <img src="${movieDetail.Poster}" />
            </p>    
        </figure>
        <div class="media-content">
            <div class="content">
                <h1>${movieDetail.Title}</h1>
                <h4>${movieDetail.Genre}</h4>
                <p>${movieDetail.Plot}</p>
            </div>
        </div>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB votes</p>
    </article>
    `
}