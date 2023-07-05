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

// Wait for the DOM to finish loading before loading initial page

document.addEventListener("DOMContentLoaded", function() {
	loadPage('index');
});
/**
 * Load increment display data-type by 1 and call loadForm
 */
async function clickByCity() {
    loadForm();

    try {
        let res = await fetch(`http://api.geonames.org/countryInfoJSON?username=hussain_naik`);
        let data = await res.json();
        let countrySelect = document.getElementById('countries');
        data.geonames.forEach(country => {
            let option = document.createElement('option');
            option.text = country.countryName;
            option.value = country.countryCode;
            countrySelect.appendChild(option);
        });

        document.getElementById('country').addEventListener('change', async () => {
            let countryCode = document.getElementById('country').value;
            let res = await fetch(`http://api.geonames.org/searchJSON?country=${countryCode}&maxRows=1000&username=hussain_naik&featureClass=P&style=short`);
            let data = await res.json();
            let citySelect = document.getElementById('cities');
            data.geonames.forEach(city => {
                let option = document.createElement('option');
                option.value = city.name;
                citySelect.appendChild(option);
            });
            
        })
    } catch (error) {
        console.log(error);
    }
}

/**
 * populate the name time data from given data and day
 * @param {*} data taken from the api fetch after json function
 * @param {*} location Pass location for heading display 
 */
function populateData(data1, data2, location) {
    let element = document.getElementsByClassName('prayer-time');
    let prayers = document.getElementsByClassName('prayers');
    let title = document.getElementsByTagName('h3');
    //Set h2 for georgian and hijri date
    title[0].innerHTML = data1.data.date.readable + ' <span id="clock"></span>';
    title[1].innerHTML = data1.data.date.hijri.day + ' ' + data1.data.date.hijri.month.en + ' ' + data1.data.date.hijri.year;
    title[2].innerHTML = location;
    //set fajr
    element[0].innerHTML = data1.data.timings.Fajr;
    prayers[0].setAttribute('data-type', data1.data.timings.Sunrise);
    //set zohar
    element[2].innerHTML = data1.data.timings.Dhuhr;
    prayers[1].setAttribute('data-type', data1.data.timings.Asr);
    //set asar
    element[4].innerHTML = data1.data.timings.Asr;
    prayers[2].setAttribute('data-type', data1.data.timings.Sunset);
    //set maghrib
    element[6].innerHTML = data1.data.timings.Maghrib;
    prayers[3].setAttribute('data-type', data1.data.timings.Isha);
    //set isha
    element[8].innerHTML = data1.data.timings.Isha;
    prayers[4].setAttribute('data-type', data1.data.timings.Fajr);
    //set fajr next day
    element[1].innerHTML = data2.data.timings.Fajr;
    //set zohar next day
    element[3].innerHTML = data2.data.timings.Dhuhr;
    //set asar next day
    element[5].innerHTML = data2.data.timings.Asr;
    //set maghrib next day
    element[7].innerHTML = data2.data.timings.Maghrib;
    //set isha next day
    element[9].innerHTML = data2.data.timings.Isha;
}

/**
 * Load increment display data-type by 1 and call loadResult
 */
function clickByLocation() {
    let html = document.getElementById('display');
    
    loadResults();
    const success = async (position) => {
        let pos = 'latitude :' + position.coords.latitude + ' longitude :' + position.coords.longitude;
        try {
            //get current date
            let currentDate = new Date();
            let day = currentDate.getDate();
            let month = currentDate.getMonth() + 1;
            let year = currentDate.getFullYear();
            console.log(day+ '/'+month+"/"+year)

            let res = await fetch(`http://api.aladhan.com/v1/timings/${day}-${month}-${year}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=15`);
            let data1 = await res.json();
            res = await fetch(`http://api.aladhan.com/v1/timings/${day + 1}-${month}-${year}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=15`);
            let data2 = await res.json();
            
            console.log(data1);
            //timing output
    
            populateData(data1, data2, pos);
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
async function clickSubmit() {
    let html = document.getElementById('display');
    let city = document.getElementById('city').value;
    let country = document.getElementById('country').value;
    console.log(city);
    console.log(country);
    loadResults();

    try {
        //get current date
        let currentDate = new Date();
        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        let res = await fetch(`http://api.aladhan.com/v1/timingsByCity/${day}-${month}-${year}?city=${city}&country=${country}&method=15`);
        let data1 = await res.json();
        res = await fetch(`http://api.aladhan.com/v1/timingsByCity/${day + 1}-${month}-${year}?city=${city}&country=${country}&method=15`);
        let data2 = await res.json();
        
        console.log(data1);
        //timing output

        populateData(data1, data2, city);       
    } catch (error) {
        console.log(error);
    }
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
    <h3><span id="clock"></span></h3>
    <h3></h3>
    <h3></h3>
    <div class="prayer">
        <div class="prayers active" data-type="">
            <h3 class="prayer-name">Fajr</h3>
            <h3 class="prayer-time current active"><i class="fa-solid fa-spinner fa-spin"></i></h3>
            <h3 class="prayer-time next hidden"><i class="fa-solid fa-spinner fa-spin"></i></h3>
        </div>
        <div class="prayers active" data-type="">
            <h3 class="prayer-name">Zohar</h3>
            <h3 class="prayer-time current active"><i class="fa-solid fa-spinner fa-spin"></i></h3>
            <h3 class="prayer-time next hidden"><i class="fa-solid fa-spinner fa-spin"></i></h3>
        </div>
        <div class="prayers active" data-type="">
            <h3 class="prayer-name">Asar</h3>
            <h3 class="prayer-time current active"><i class="fa-solid fa-spinner fa-spin"></i></h3>
            <h3 class="prayer-time next hidden"><i class="fa-solid fa-spinner fa-spin"></i></h3>
        </div>
        <div class="prayers active" data-type="">
            <h3 class="prayer-name">Maghrib</h3>
            <h3 class="prayer-time current active"><i class="fa-solid fa-spinner fa-spin"></i></h3>
            <h3 class="prayer-time next hidden"><i class="fa-solid fa-spinner fa-spin"></i></h3>
        </div>
        <div class="prayers active" data-type="">
            <h3 class="prayer-name">Isha</h3>
            <h3 class="prayer-time current active"><i class="fa-solid fa-spinner fa-spin"></i></h3>
            <h3 class="prayer-time next hidden"><i class="fa-solid fa-spinner fa-spin"></i></h3>
        </div>
    </div>
    <div class="btn-box">
        <div class="btn button" data-type="back">
            <span>Back</span>
        </div>
    </div>`;
    let html = document.getElementById('display');
    html.innerHTML = insert;
    startTime();
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
        clickByCity();
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

/**
 * Start clock with one second time intervals
 */
function startTime() {
    let today = new Date();
    let h = today.getHours();
    let m = today.getMinutes();
    let s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    let clock = document.getElementById('clock');
    
    if (document.getElementsByClassName('prayer').length > 0 ) {
        changeActive(h + ":" + m)
        setTimeout(startTime, 1000);
        insertTimer();
        clock.innerHTML = h + ":" + m + ":" + s;
    }
    else {
        clearTimeout();
    }
}
/**
 * Function to remove active class and switch time to next day
 * @param {*} time parameter of current time
 */
function changeActive(time){
    let activePrayer = document.getElementsByClassName('prayers');
    for (i = 0; i < activePrayer.length -1; i++) {
        if (timeDifference(time,activePrayer[i].getAttribute('data-type')) < 0 && activePrayer[i].children.length > 3){
            activePrayer[i].classList.remove('active');
            let elements = activePrayer[i].children;
            activePrayer[i].removeChild(activePrayer[i].lastElementChild);
            elements[1].classList.remove('active');
            elements[1].classList.add('hidden');
            elements[2].classList.remove('hidden');
            elements[2].classList.add('active');
            
        }
    }

}

function insertTimer(){
    let element = document.getElementsByClassName('prayers active');
    if (element[0].children.length < 4){
        element[0].innerHTML += `<div class="timer"></div>`;
    }
}
 /**
  * Function to return value for number less than 10 with leading zero
  * @param {*} i 
  * @returns value of string with leading zero
  */  
function checkTime(i) {
    if (i < 10) {i = "0" + i};
    return i;
}

/**
 * Function to return the time difference between two time intervals in seconds
 * @param {*} time1 start time parameter as string
 * @param {*} time2 end time parameter as string
 * @returns value of time2 - time1 in seconds
 */
function timeDifference(time1, time2) {
    //code to process string to number
    let time1Array = time1.split(':');
    let startSec = (time1Array[0] * 60 * 60) + (time1Array[1] * 60);
    let time2Array = time2.split(':');
    let endSec = (time2Array[0] * 60 * 60) + (time2Array[1] * 60);

    let timeDiff = endSec - startSec;
    return timeDiff;
}
/**
 * Function to convert seconds to hours and minutes
 * @param {*} seconds paramter 
 * @returns return string as HH:MM
 */
function convertToTime(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = seconds % 3600;
    m = m / 60;
    m = checkTime(m);
    h = checkTime(h);
    return h + ':' + m;
}