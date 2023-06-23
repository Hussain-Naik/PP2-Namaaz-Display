// Wait for the DOM to finish loading before loading page
// Get the button elements and add event listeners to them

document.addEventListener("DOMContentLoaded", function() {
	let buttons = document.getElementsByClassName("button");

	for (let button of buttons) {
		button.addEventListener("click", function() {
			if (this.getAttribute("data-type") === "home") {
				indexPage();
			} else {
				
			}
		});
	}
	indexPage();
});

function clickByCity() {

}

function clickByLocation() {
    
}

function loadForm() {

}

function loadResults() {

}
/**
 * Load the previous page display depending on user current display
 * App like navigation
 * decrement data-type and set value
 */
function previousPage() {
    let html = document.getElementById('display');
    let x = pageInc(html , '-');
    if (x == 0) {
        indexPage();
    } else if (x == 1){
        loadForm();
    }

    html.setAttribute('data-type', x);

}
/**
 * Load the index main html code
 * Set page increment data-type to 0
 */
function indexPage() {
    let insert = `<h2 class="center">Display Prayer Times</h2>
    <div class="btn-box" data-type="by">
        <div class="btn button">
            <span>By City</span>
        </div>
    </div>
    <div class="btn-box">
        <div class="btn button">
            <span>By Location</span>
        </div>
    </div>`;
    let html = document.getElementById('display');
    html.innerHTML = insert;
    html.setAttribute('data-type', '0')
}
/**
 * Function to increment or decrement the data-type
 * pass argument page as the display element id
 * pass argument +/- for increment/decrement
 * returns value to set data-type
 */
function pageInc(page, inc) {
    let x = page.getAttribute('data-type')
    if (inc === '+'){
        x++;
    } else {
        x--;
    }
    return x;
}