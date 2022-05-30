//api key 3bf6204b

const autoCompleteConfig = {
    renderOption(movie){
        let imgSrc = movie.Poster == "N/A" ? "" : movie.Poster;
        return  `
        <img src="${imgSrc}"/>
        ${movie.Title} (${movie.Year})
        `
    },
    inputValue(movie){
        return movie.Title;
    },
    async fetchData(searchTerm){
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
}

createAutoComplete(
    {
        ...autoCompleteConfig,
        root: document.body.querySelector('#left-autocomplete'),
        placeHolder: "First Movie",
        
        async onOptionSelect(movie){
            if(document.contains(document.querySelector(".tutorial"))){
                document.querySelector(".tutorial").remove();
            }            const {imdbID: movieId} = movie;
            const response = await axios.get("http://www.omdbapi.com/", {
                params:{
                    apikey: "3bf6204b",
                    i: movieId
                }
            });
            document.querySelector("#left-summary").innerHTML = movieTemplate(response.data);
        },
        
    }
);

createAutoComplete(
    {
        ...autoCompleteConfig,
        root: document.querySelector('#right-autocomplete'),
        placeHolder: "Second Movie",
        async onOptionSelect(movie){
            if(document.contains(document.querySelector(".tutorial"))){
                document.querySelector(".tutorial").remove();
            }
            const {imdbID: movieId} = movie;
            const response = await axios.get("http://www.omdbapi.com/", {
                params:{
                    apikey: "3bf6204b",
                    i: movieId
                }
            });
            document.querySelector("#right-summary").innerHTML = movieTemplate(response.data);
        }
    }
);



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

