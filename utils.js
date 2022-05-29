const debounceHelper = (func, delay)=>{
    let timeoutId;
    //this function will take in a func and debounce it and return the new function definition
    const debounceFunc = (...args)=>{ 
        if(timeoutId){
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(()=>{
            func.apply(null, args);
        }, delay);
    }
    return debounceFunc;
}