const input = document.getElementById('user-search');
const output = document.getElementById('output-display');
const nasaApi = 'https://images-api.nasa.gov/';
let imageHref;
let imageDescription;
let next = null;
let previous = null;
const searchResults = [];
let searchLinks = [];

input.addEventListener('keypress', function(event) {
    if(event.key === 'Enter'){
        // reset prev/next
        next = null;
        previous = null;
        // default value
        if (input.value == '') {
            input.value += 'earth';
        }
        fetch(`${nasaApi}search?q=${input.value}&media_type=image`)
        .then(response => response.json())
        .then(data => {
            searchResults.splice(0, ...data.collection.items);
            searchLinks = data.collection.links;

            // stops an error if no 'next' link available
            if (data.collection.links && searchResults.length != 0) {
                next = data.collection.links['0'].href;
            }
        })
        .then(displayResults)
        .catch(error => console.log(error))
    }
});

function displayResults() {
    if (searchResults.length != 0) {
        showImages();
    } else {
        output.innerHTML = `<div>Sorry, no matches. Try a different search</div>`;
    }
}

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
    disableUnusedButton();
    output.addEventListener('click', expand);
}

// if no pages available or has reached last/first page
function disableUnusedButton() {
    if (next == null || searchLinks.find(isNext) === undefined) {
        document.getElementById('next-btn').disabled = true;
    }
    if (previous == null || searchLinks.find(isPrevious) === undefined) {
        document.getElementById('previous-btn').disabled = true;
    }
}

// prev/next page buttons
output.addEventListener('click', function(event) {
    if (event.target && event.target.matches('button#next-btn') && next != null) {
        fetch(next)
        .then(response => response.json())
        .then(data => {
            searchResults.splice(0, ...data.collection.items)
            searchLinks = data.collection.links;

            next = searchLinks.find(isNext).href;
            previous = searchLinks.find(isPrevious).href;
        })
        .then(displayResults)
        .catch(error => console.log(error))
    } else if (event.target && event.target.matches('button#previous-btn') && previous != null) {
        fetch(previous)
        .then(response => response.json())
        .then(data => {
            searchResults.splice(0, ...data.collection.items);
            searchLinks = data.collection.links;

            // Ensure page 1 (no previous href) is displayed
            if (searchLinks.find(isPrevious)) {
                previous = searchLinks.find(isPrevious).href;
            }
            next = searchLinks.find(isNext).href;
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