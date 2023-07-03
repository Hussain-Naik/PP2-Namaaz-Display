//Use MutationObserve to update added html buttons
//https://fek.io/blog/how-to-observe-changes-to-the-dom-without-using-a-java-script-framework/

const divSection = document.querySelector('#display');

const observer = new MutationObserver((mutationsList, observer) => {
    for(const mutation of mutationsList) {
        if (mutation.type === 'childList') {
            console.log('A child node has been added or removed.');
            let buttons = document.getElementsByClassName("button");
            
	        for (let button of buttons) {
		        button.addEventListener("click", function() {
                    loadPage(this.getAttribute("data-type"));
                    console.log(this.getAttribute("data-type"));
                });
	        }
        }
    }
});

observer.observe(divSection, { 
    attributes: true, 
    childList: true, 
    subtree: false }
);

// Wait for the DOM to finish loading before loading page
// Get the button elements and add event listeners to them

document.addEventListener("DOMContentLoaded", function() {
	loadPage('index');
});
/**
 * Load increment display data-type by 1 and call loadForm
 */
async function clickByCity() {
    let html = document.getElementById('display');
    let pageIncrement = pageInc(html , '+');
    loadForm();

    try {
        let res = await fetch(`http://api.geonames.org/countryInfoJSON?username=hussain_naik`);
        let data = await res.json();
        
        console.log(data);
        let countrySelect = document.getElementById('countries');
        data.geonames.forEach(country => {
            let option = document.createElement('option');
            option.text = country.countryName;
            option.value = country.countryCode;
            countrySelect.appendChild(option);
        });

        countrySelect.addEventListener('change', () => {
            let countryCode = document.getElementById('countries').value;
            console.log(countryCode);
        })
        //http://api.geonames.org/searchJSON?country=GB&maxRows=10&username=hussain_naik&featureClass=P&style=short
    } catch (error) {
        console.log(error);
    }
    html.setAttribute('data-type', pageIncrement);
}

/**
 * populate the name time data from given data and day
 * @param {*} data taken from the api fetch after json function
 * @param {*} date Pass date 
 */
function populateData(data) {
    let element = document.getElementsByClassName('prayer-time');
    let title = document.getElementsByTagName('h3');
    //Set h2 for georgian and hijri date
    title[0].innerHTML = 'georgian date';
    title[1].innerHTML = 'hijri date';
    //set fajr
    element[0].innerHTML = data.data.timings.Fajr;
    //set zohar
    element[1].innerHTML = data.data.timings.Dhuhr;
    //set asar
    element[2].innerHTML = data.data.timings.Asr;
    //set maghrib
    element[3].innerHTML = data.data.timings.Maghrib;
    //set isha
    element[4].innerHTML = data.data.timings.Isha;
}

/**
 * Load increment display data-type by 1 and call loadResult
 */
function clickByLocation() {
    let html = document.getElementById('display');
    
    loadResults();
    const success = async (position) => {
        console.log('latitude=' + position.coords.latitude + '&longitude=' + position.coords.longitude);
        try {
            //get current date
            let currentDate = new Date();
            let day = currentDate.getDate();
            let month = currentDate.getMonth() + 1;
            let year = currentDate.getFullYear();
            console.log(day+ '/'+month+"/"+year)

            let res = await fetch(`http://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=15`);
            let data = await res.json();
            
            console.log(data);
            //timing output
    
            populateData(data);       
        } catch (error) {
            console.log(error);
        }
    }

    const error = () => {
        console.log('error');
    }
    navigator.geolocation.getCurrentPosition(success, error);
    let pageIncrement = pageInc(html , '+');
    html.setAttribute('data-type', pageIncrement);
    
    
    
}

/**
 * Submit clicked
 * Fetch API data for selected city
 * increment data-type by 1 and call loadResult
 */
function clickSubmit() {
    let html = document.getElementById('display');
    
    loadResults();
    // http://api.aladhan.com/v1/calendarByCity/2017/4?city=London&country=United Kingdom&method=15


    let pageIncrement = pageInc(html , '+');
    html.setAttribute('data-type', pageIncrement);
}

function loadForm() {
    let insert = `
    <h2>Country/City Selector</h2>
    <form action="response.html" method="GET" class="frm-display">
        <label for="country">Country:</label>
        <input list="countries" id="country" name="country">
        <datalist id="countries">
        </datalist>
        <label for="city">City:</label>
        <input list="cities" id="city" name="city">
        <datalist id="cities">
        </datalist>
    </form>
    <div class="btn-box">
        <div class="btn button" data-type="back">
            <span>Back</span>
        </div>
    </div>
    <div class="btn-box">
        <div class="btn button" data-type="submit">
            <span>Submit</span>
        </div>
    </div>`;
    let html = document.getElementById('display');
    html.innerHTML = insert;

    html.setAttribute('data-type', '1')
}

function loadResults() {
    let insert = `
    <h3></h3>
    <h3></h3>
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
    let pageIncrement = pageInc(html , '-');
    if (pageIncrement <= 0) {
        indexPage();
    } else if (pageIncrement == 1){
        loadForm();
    }

    //html.setAttribute('data-type', pageIncrement);

}
/**
 * Load the index main html code
 * Set page increment data-type to 0
 */
function indexPage() {
    let insert = `<h2>Display Prayer Times</h2>
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
    let pageIncrement = page.getAttribute('data-type')
    if (inc === '+'){
        pageIncrement++;
    } else {
        pageIncrement--;
    }
    console.log(pageIncrement);
    return pageIncrement;
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
    } else if (page === "submit") {
        clickSubmit();
    }else if (page === "back"){
        previousPage();
    } else {
        indexPage();
    }
}

