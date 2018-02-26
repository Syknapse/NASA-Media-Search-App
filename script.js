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
            console.log(data);

            imagesArray.forEach(function(result){
                let imageHref = result.links[0].href;
                let imageDescription = result.data[0].description;
                searchResults += `<img src=${imageHref} title="${imageDescription}">`;
            })
            output.innerHTML = searchResults;
            output.addEventListener('click', expand);
        })
        .catch(error => console.log(error))
    }
});

function expand(event) {
    let thisImageUrl = event.target.src;
    let thisImageDescription = event.target.title;
    const expandedImage = document.querySelector('.expanded-image');

    expandedImage.classList.add('show');
    expandedImage.innerHTML =
    `<span>&#128500;</span>
    <img src=${thisImageUrl}>
    <div>${thisImageDescription}</div>`;

    expandedImage.addEventListener('click', function(){
        expandedImage.classList.remove('show');

    })
}
