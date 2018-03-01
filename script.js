const input = document.getElementById('user-search');
const output = document.getElementById('output-display');
const nasaApi = 'https://images-api.nasa.gov/';
let imageHref;
let imageDescription;
let next;
let previous;
const searchResults = [];

input.addEventListener('keypress', function(event) {
    if(event.key === 'Enter'){
        fetch(`${nasaApi}search?q=${input.value}&media_type=image`)
        .then(response => response.json())
        .then(data => {
            searchResults.splice(0, ...data.collection.items);
            // stops an error if searchResults is empty
            if (searchResults.length != 0) {
                next = data.collection.links["0"].href;
            }
        })
        .then(displayResults)
        .catch(error => console.log(error))
    }
});

function showImages() {
    let resultsDisplay = '';

    searchResults.forEach(result => {
        imageHref = result.links[0].href;
        imageDescription = result.data[0].description;
        resultsDisplay += `<img src=${imageHref}>`;
    })
    output.innerHTML =
    `<button id="previous-btn">PREVIOUS</button>
    <button id="next-btn">NEXT</button>
    ${resultsDisplay}`;
    output.addEventListener('click', expand);
}

// prev/next page buttons
output.addEventListener('click', function(event) {
    if (event.target && event.target.matches('button#next-btn')) {
        fetch(next)
        .then(response => response.json())
        .then(data => {
            searchResults.splice(0, ...data.collection.items)
            next = data.collection.links.find(isNext).href;
            previous = data.collection.links.find(isPrevious).href;
        })
        .then(displayResults)
        .catch(error => console.log(error))
    } else if (event.target && event.target.matches('button#previous-btn')) {
        fetch(previous)
        .then(response => response.json())
        .then(data => {
            searchResults.splice(0, ...data.collection.items)
            // Ensure page 1 (no previous href) is displayed
            if (data.collection.links.find(isPrevious)) {
                previous = data.collection.links.find(isPrevious).href;
            }
            next = data.collection.links.find(isNext).href;
        })
        .then(displayResults)
        .catch(error => console.log(error))
    }
});

function isNext(link) {
    return link.prompt === 'Next';
}
function isPrevious(link) {
    return link.prompt === 'Previous';
}

function displayResults() {
    if (searchResults.length != 0) {
        showImages();
    } else {
        output.innerHTML = `<div>Sorry , no matches. Try a different search</div>`;
    }
}

function expand(event) {
    // Fire event only when 'img' is clicked
    if (event.target && event.target.nodeName == 'IMG') {
        let clickedImageUrl = event.target.src;
        let thisImage = searchResults.filter(image => clickedImageUrl === image.links[0].href);
        const description = thisImage["0"].data["0"].description;
        const imageUrl = thisImage["0"].links["0"].href;
        const expandedImage = document.querySelector('.expanded-image');

        expandedImage.classList.add('show');
        expandedImage.innerHTML =
        `<span>X</span>
        <img src=${imageUrl}>
        <div>${description}</div>`;

        expandedImage.addEventListener('click', () =>
            expandedImage.classList.remove('show')

        )
    }

}