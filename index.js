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

const searchBox = document.querySelector(".container input");

const onInput = debounceHelper(async event => {
    const movies = await fetchData(event.target.value.trim());
    for (let movie of movies){
        const div = document.createElement('div');
        div.innerHTML = `
            <img src="${movie.Poster}"/>
            <h1>${movie.Title}</h1>
        `
        document.querySelector("#searchResults").appendChild(div);
    }
}, 500)

searchBox.addEventListener('input', onInput)
