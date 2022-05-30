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

let rightData;
let leftData;

const onMovieSelect = async (movie, summaryEl, side)=>{
    const {imdbID: movieId} = movie;
    const response = await axios.get("http://www.omdbapi.com/", {
                params:{
                    apikey: "3bf6204b",
                    i: movieId
                }
            });
    summaryEl.innerHTML = movieTemplate(response.data);
    if(side=="left"){
        leftData = response.data;
    }
    else{
        rightData = response.data;
    }

    if(rightData && leftData){
        compare();
    }
}

const compare = ()=>{
    const leftSideStats = document.querySelectorAll('#left-summary .notification');
    const rightSideStats = document.querySelectorAll('#right-summary .notification');

    for(let i = 0; i < leftSideStats.length; i++){
        let leftSideStat = leftSideStats[i];
        let rightSideStat = rightSideStats[i];
        if(leftSideStat.dataset.value === undefined ||leftSideStat.dataset.value === undefined){
            leftSideStat.style.background = "gray";
            rightSideStat.style.background = "gray";
            continue;
        } else {
            var leftValue =  parseFloat(leftSideStat.dataset.value);
            var rightValue = parseFloat(rightSideStat.dataset.value);
        }
        if(leftValue > rightValue){
            leftSideStat.style.background = "rgba(0, 200, 0, 0.5)";
            rightSideStat.style.background = "rgba(200, 0, 0, 0.5)";
        } else if(rightValue > leftValue){
            leftSideStat.style.background = "rgb(200, 0, 0, 0.5)";
            rightSideStat.style.background = "rgb(0, 200, 0, 0.5)";
        }
        else{
            leftSideStat.style.background = "gray";
            rightSideStat.style.background = "gray";
        }
    }

}


createAutoComplete(
    {
        ...autoCompleteConfig,
        root: document.body.querySelector('#left-autocomplete'),
        placeHolder: "First Movie",
        
        async onOptionSelect(movie){
            if(document.contains(document.querySelector(".tutorial"))){
                document.querySelector(".tutorial").classList.add("is-hidden");
            }            
            onMovieSelect(movie, document.querySelector('#left-summary'), 'left');
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
                document.querySelector(".tutorial").classList.add("is-hidden");
            }            
            onMovieSelect(movie, document.querySelector('#right-summary'), 'right');
        }
    }
);

const movieTemplate = (movieDetail)=>{
    const dollars = movieDetail.BoxOffice === undefined ? undefined : parseInt(movieDetail.BoxOffice.replace(/\$/g, '').replace(/,/g, ''));
    const metascore = movieDetail.Metascore === undefined ? undefined : parseInt(movieDetail.Metascore);
    const imdbRating = movieDetail.imdbRating === undefined ? undefined : parseFloat(movieDetail.imdbRating);
    const imdbVotes = movieDetail.imdbVotes === undefined ? undefined : parseInt(movieDetail.imdbVotes.replace(/,/, ''));
    const awards = movieDetail.Awards === undefined ? undefined : movieDetail.Awards.split(' ').reduce((totalAwards, item)=>{
        let award = parseInt(item);
        if(award){
            return totalAwards += award;
        }
        else{
            return totalAwards;
        }
    }, 0)
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
    <article data-value= ${awards} class="notification is-primary">
        <p class="title">${movieDetail.Awards}</p>
        <p class="subtitle">Awards</p>
    </article>
    <article data-value=${dollars} class="notification is-primary">
    <p class="title">${movieDetail.BoxOffice}</p>
    <p class="subtitle">Box Office</p>
    </article>
    <article data-value = ${metascore} class="notification is-primary">
        <p class="title">${movieDetail.Metascore}</p>
        <p class="subtitle">Metascore</p>
    </article>
    <article data-value= ${imdbRating} class="notification is-primary">
        <p class="title">${movieDetail.imdbRating}</p>
        <p class="subtitle">IMDB Rating</p>
    </article>
    <article data-value=${imdbVotes} class="notification is-primary">
        <p class="title">${movieDetail.imdbVotes}</p>
        <p class="subtitle">IMDB votes</p>
    </article>
    `
}

