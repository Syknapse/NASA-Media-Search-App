const input = document.getElementById('user-search');
const output = document.getElementById('output-display');
const nasaApi = 'https://images-api.nasa.gov/';
let imageHref;
let imageDescription;
const imagesResults = [];

input.addEventListener('keypress', function(event) {
    if(event.key === 'Enter'){
        fetch(`${nasaApi}search?q=${input.value}&media_type=image`)
        .then(response => response.json())
        .then(data => imagesResults.splice(0, ...data.collection.items))
        .then(showImages)
        .catch(error => console.log(error))
    }
});

function showImages() {
    let searchResults = '';

    imagesResults.forEach(result => {
        imageHref = result.links[0].href;
        imageDescription = result.data[0].description;
        searchResults += `<img src=${imageHref}>`;
    })
    output.innerHTML = searchResults;
    output.addEventListener('click', expand);

}

function expand() {
    let clickedImageUrl = event.target.src;
    let thisImage = imagesResults.filter(image => clickedImageUrl === image.links[0].href);
    const description = thisImage["0"].data["0"].description;
    const imageUrl = thisImage["0"].links["0"].href;
    const expandedImage = document.querySelector('.expanded-image');

    expandedImage.classList.add('show');
    expandedImage.innerHTML =
    `<span>&#128500;</span>
    <img src=${imageUrl}>
    <div>${description}</div>`;

    expandedImage.addEventListener('click', () =>
        expandedImage.classList.remove('show')

    )
}
