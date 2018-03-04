const input = document.getElementById('user-search');
const output = document.getElementById('output-display');
const nasaApi = 'https://images-api.nasa.gov/';
let imageHref;
let imageDescription;
let next = null;
let previous = null;
const searchResults = [];
let searchLinks = [];

/*
/// Event listeners ///
*/
// Search
input.addEventListener('keypress', event => {
    if(event.key === 'Enter'){
        searchNASA();
        input.blur();
    }
});

// prev/next page buttons
output.addEventListener('click', event => {
    if (event.target && event.target.matches('button#next-btn') && next != null) {
        fetchNext();
    } else if (event.target && event.target.matches('button#previous-btn') && previous != null) {
        fetchPrevious();
    }
});

// Expand image
output.addEventListener('click', expand);
/*
/// Event listeners END///
*/

function searchNASA() {
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

function displayResults() {
    searchResults.length != 0 ? showImages() : output.innerHTML = `<div>Sorry, no matches. Try a different search</div>`;
}

function showImages() {
    let resultsDisplay = '';

    searchResults.forEach(result => {
        imageHref = result.links[0].href;
        imageDescription = result.data[0].description;
        resultsDisplay += `<img src=${imageHref}>`;
    })
    output.innerHTML =
    `<button id="previous-btn">Previous</button>
    <button id="next-btn">Next</button>
    ${resultsDisplay}`;
    disableUnusedButton();
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

function fetchNext() {
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
}

function fetchPrevious() {
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
        const largeImage = document.querySelector('.large-image');
        const descriptionPanel = document.querySelector('.image-description');

        largeImage.setAttribute('src', imageUrl);
        descriptionPanel.innerHTML = description;

        largeImage.addEventListener('mouseenter', () => descriptionPanel.style.display = 'block');
        descriptionPanel.addEventListener('mouseenter', () => descriptionPanel.style.display = 'block');
        largeImage.addEventListener('mouseleave', () => descriptionPanel.style.display = 'none');
        descriptionPanel.addEventListener('mouseleave', () => descriptionPanel.style.display = 'none');

        expandedImage.classList.add('show');
        /* expandedImage.innerHTML =
        `<span>X</span>
        <img src=${imageUrl}>
        <div>${description}</div>`; */


        expandedImage.addEventListener('click', event => {
            if (event.target === expandedImage) {
                expandedImage.classList.remove('show');
            }
        })
    }

}