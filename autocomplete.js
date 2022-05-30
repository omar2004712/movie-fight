//this function will create an autocomplete widget
//parameters:
/*
{
    root opject-htmlElement// to add the widget to
    placeHolder value// place holder for the input element
    renderOption function// how options should show inside the menu of reuslts
    onOptionSelect function//what happens when the users selects an option
    inputValue function// which value to put inside the input when the user selects an option 'usually the title of the option
    fetchData function// a function to send a request and returns an array of data
}
*/ 

const createAutoComplete = ({root, placeHolder = "Search", renderOption, onOptionSelect, inputValue, fetchData})=>{
    root.innerHTML = `
    <input class="input" placeholder = "${placeHolder}" />
    <div class="dropdown">
        <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
        </div>
    </div>
    `
    const input = root.querySelector(".input");
    const dropdown = root.querySelector(".dropdown");
    const resultsWrapper = root.querySelector(".results")

    const onInput = debounceHelper(async event => {
        const items = await fetchData(event.target.value.trim());
        
        if(!items.length){ // to check if the response includes the required data
            dropdown.classList.remove("is-active")
            return;
        }

        resultsWrapper.innerHTML = ""; //to clear the search menu for the new data

        dropdown.classList.add('is-active')

        for (let item of items){
            const option = document.createElement('a');
            option.classList.add('dropdown-item')
            option.innerHTML = renderOption(item)
            option.addEventListener('click', ()=>{
                dropdown.classList.remove('is-active');
                input.value = inputValue(item);
                onOptionSelect(item)
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
}