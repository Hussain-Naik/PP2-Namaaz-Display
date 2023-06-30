//Use MutationObserve to update added html buttons
//https://fek.io/blog/how-to-observe-changes-to-the-dom-without-using-a-java-script-framework/

const div_section = document.querySelector('#display');

const observer = new MutationObserver((mutationsList, observer) => {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
            let buttons = document.getElementsByClassName("button");
            console.log(buttons);

            let page = 'index'
    
	        for (let button of buttons) {
		        button.addEventListener("click", function() {
			    if (this.getAttribute("data-type") === "city") {
				    page = 'city';
                    console.log(page);
                    loadPage(page);
                } 
                else if (this.getAttribute("data-type") === "location"){
                    page = 'location';
                    console.log(page);
                    loadPage(page);
                }
                else if (this.getAttribute("data-type") === "back"){
                    page = 'back';
                    console.log(page);
                    previousPage();
                } 
                else {
                    page = 'index'
                    loadPage(page);
                }
            });
	        }
        }
    }
});

observer.observe(div_section, { 
    attributes: true, 
    childList: true, 
    subtree: true }
);

// Wait for the DOM to finish loading before loading page
// Get the button elements and add event listeners to them

document.addEventListener("DOMContentLoaded", function() {
	loadPage('index');
});
/**
 * Load increment display data-type by 1 and call loadForm
 */
function clickByCity() {
    let html = document.getElementById('display');
    let x = pageInc(html , '+');
    loadForm();
    html.setAttribute('data-type', x);
}

/**
 * populate the name time data from given data and day
 * @param {*} data taken from the api fetch after json function
 * @param {*} day array index value
 */
function populateData(data, day) {
    let element = document.getElementsByClassName('prayer-time');
    //set fajr
    element[0].innerHTML = data.data[day].timings.Fajr;
    //set zohar
    element[1].innerHTML = data.data[day].timings.Dhuhr;
    //set asar
    element[2].innerHTML = data.data[day].timings.Asr;
    //set maghrib
    element[3].innerHTML = data.data[day].timings.Maghrib;
    //set isha
    element[4].innerHTML = data.data[day].timings.Isha;
}

/**
 * Load increment display data-type by 1 and call loadResult
 */
function clickByLocation() {
    let html = document.getElementById('display');
    let x = pageInc(html , '+');
    loadResults();
    html.setAttribute('data-type', x);
    
    
    const success = async (position) => {
        console.log('latitude=' + position.coords.latitude + '&longitude=' + position.coords.longitude);
        try {
            //get current date
            let currentDate = new Date();
            const day = currentDate.getDate();
            let month = currentDate.getMonth() + 1;
            let year = currentDate.getFullYear();
            console.log(day+ '/'+month+"/"+year)

            let res = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=2`);
            let data = await res.json();
            console.log(data);
            console.log(data.data[0].timings);
            console.log(data.data[0].timings.Fajr);
            //timing output
    
            populateData(data, day);       
            
            console.log(element);
        } catch (error) {
            console.log(error);
        }
    }

    const error = () => {
        console.log('error');
    }
    navigator.geolocation.getCurrentPosition(success, error);
    
    
    
}

function loadForm() {
    let insert = `
    <form action="response.html" method="GET" class="frm-display">
        <label for="country">Country:</label>
        <input list="countries" id="country" name="country">
        <datalist id="countries">
            <option value="option1">
        </datalist>
        <label for="city">City:</label>
        <input list="cities" id="city" name="city">
        <datalist id="cities">
            <option value="city1">
        </datalist>
    </form>
    <div class="btn-box">
        <div class="btn button" data-type="back">
            <span>Back</span>
        </div>
    </div>
    <div class="btn-box">
        <div class="btn button" data-type="location">
            <span>Submit</span>
        </div>
    </div>`;
    let html = document.getElementById('display');
    html.innerHTML = insert;
}

function loadResults() {
    let insert = `
    <div class="prayer">
        <div class="prayers">
            <div class="timer">

            </div>
            <h3 class="prayer-name">Fajr</h3>
            <h3 class="prayer-time">05:00</h3>
        </div>
        <div class="prayers">
            <h3 class="prayer-name">Zohar</h3>
            <h3 class="prayer-time">05:00</h3>
        </div>
        <div class="prayers">
            <h3 class="prayer-name">Asar</h3>
            <h3 class="prayer-time">05:00</h3>
        </div>
        <div class="prayers">
            <h3 class="prayer-name">Maghrib</h3>
            <h3 class="prayer-time">05:00</h3>
        </div>
        <div class="prayers">
            <h3 class="prayer-name">Isha</h3>
            <h3 class="prayer-time">05:00</h3>
        </div>
    </div>
    <div class="btn-box">
        <div class="btn button" data-type="back">
            <span>Back</span>
        </div>
    </div>`;
    let html = document.getElementById('display');
    html.innerHTML = insert;
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
    <div class="btn-box">
        <div class="btn button" data-type="city">
            <span>By City</span>
        </div>
    </div>
    <div class="btn-box">
        <div class="btn button" data-type="location">
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
/**
 * Function to run click event code depending on data-type
 * pass argument button element clicked
 * check and run city or location function
 */
function loadPage(page) {
    if (page === "city") {
        clickByCity();
    } else if (page === "location") {
        clickByLocation();
    } else {
        indexPage();
    }
    console.log(page);
}

