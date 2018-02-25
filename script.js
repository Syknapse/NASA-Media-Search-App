const input = document.getElementById('user-search');
const output = document.getElementById('output-display');
const nasaApi = 'https://images-api.nasa.gov/';

input.addEventListener('keypress', function(event) {
    if(event.key === 'Enter'){
        fetch(`${nasaApi}search?q=${input.value}&media_type=image`)
        .then(response => response.json())
        .then(data => {
            let searchResults = '';
            let imagesArray = data.collection.items;
            imagesArray.forEach(function(result){
                let imageHref = result.links[0].href;
                searchResults += `<img src=${imageHref}>`;
            })
            output.innerHTML = searchResults;
            output.addEventListener('click', expand);
        })
        .catch(error => console.log(error))
    }
});

function expand(event) {
    // let image = document.getElementsByTagName('img');
    let thisImage = event.target.src;
    const expandedImage = document.querySelector('.expanded-image');

    expandedImage.classList.add('show');
    expandedImage.innerHTML = `<span>&#128500;</span><img src=${thisImage}>`;
    expandedImage.addEventListener('click', function(){
        expandedImage.classList.remove('show');

    })
    // console.log(thisImage);
}


/*   if (r.target.status === 200) {
    console.log(r.target.response);
} */