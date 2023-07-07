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
            let nextDate = new Date();
            nextDate.setDate(currentDate.getDate() + 1);

            let res = await fetch(`http://api.aladhan.com/v1/timings/${currentDate.getDate()}-${currentDate.getMonth()}-${currentDate.getFullYear()}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=15`);
            let data1 = await res.json();
            res = await fetch(`http://api.aladhan.com/v1/timings/${nextDate.getDate()}-${nextDate.getMonth()}-${nextDate.getFullYear()}?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&method=15`);
            let data2 = await res.json();
            
            console.log(data1);
            console.log(data2);
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
        let nextDate = new Date();
        nextDate.setDate(currentDate.getDate() + 1);

        let res = await fetch(`http://api.aladhan.com/v1/timingsByCity/${currentDate.getDate()}-${currentDate.getMonth()}-${currentDate.getFullYear()}?city=${city}&country=${country}&method=15`);
        let data1 = await res.json();
        res = await fetch(`http://api.aladhan.com/v1/timingsByCity/${nextDate.getDate()}-${nextDate.getMonth()}-${nextDate.getFullYear()}?city=${city}&country=${country}&method=15`);
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
        <div class="prayers active" data-type="24:00">
            <h3 class="prayer-name">Fajr</h3>
            <h3 class="prayer-time current active"><i class="fa-solid fa-spinner fa-spin"></i></h3>
            <h3 class="prayer-time next hidden"><i class="fa-solid fa-spinner fa-spin"></i></h3>
        </div>
        <div class="prayers active" data-type="24:00">
            <h3 class="prayer-name">Zohar</h3>
            <h3 class="prayer-time current active"><i class="fa-solid fa-spinner fa-spin"></i></h3>
            <h3 class="prayer-time next hidden"><i class="fa-solid fa-spinner fa-spin"></i></h3>
        </div>
        <div class="prayers active" data-type="24:00">
            <h3 class="prayer-name">Asar</h3>
            <h3 class="prayer-time current active"><i class="fa-solid fa-spinner fa-spin"></i></h3>
            <h3 class="prayer-time next hidden"><i class="fa-solid fa-spinner fa-spin"></i></h3>
        </div>
        <div class="prayers active" data-type="24:00">
            <h3 class="prayer-name">Maghrib</h3>
            <h3 class="prayer-time current active"><i class="fa-solid fa-spinner fa-spin"></i></h3>
            <h3 class="prayer-time next hidden"><i class="fa-solid fa-spinner fa-spin"></i></h3>
        </div>
        <div class="prayers active" data-type="24:00">
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
        changeActive(h + ":" + m + ":" + s)
        setTimeout(startTime, 1000);
        insertTimer();
        updateTimer();
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
        if (timeDifference(time, activePrayer[i].getAttribute('data-type'), '00:00') < 0 && activePrayer[i].children.length > 3){
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
/**
 * Function to add timer HTML;
 */
function insertTimer(){
    let element = document.getElementsByClassName('prayers active');
    if(document.getElementsByClassName('prayers active').length === 5 && element[element.length - 1].children.length < 4) {
        element[element.length - 1].innerHTML += `
        <div class="timer">
            <div class ="percent" style="--num:1;">
                <svg>
                    <circle cx="40" cy="40" r="38"></circle>
                    <circle cx="40" cy="40" r="38"></circle>
                </svg>
                <div class="countdown">
                </div>
            </div>
        </div>`;
    }else if (element[0].children.length < 4 && document.getElementsByClassName('prayers active').length < 5){
        element[0].innerHTML += `
        <div class="timer">
            <div class ="percent" style="--num:1;">
                <svg>
                    <circle cx="40" cy="40" r="38"></circle>
                    <circle cx="40" cy="40" r="38"></circle>
                </svg>
                <div class="countdown">
                </div>
            </div>
        </div>`;
    }
}

function updateTimer() {
    const element = document.getElementsByClassName('timer');
    let check = document.getElementsByClassName('prayers active')
    if (check.length > 1 && check.length < 5) {
        let timer = timeDifference(document.getElementById('clock').innerHTML, element[0].parentElement.getAttribute('data-type'), '00:00');
        let limit = timeDifference(element[0].parentElement.getElementsByClassName('active')[0].innerHTML, element[0].parentElement.getAttribute('data-type'), '00:00');
        let percentage = Math.floor(timer / limit * 100);
        document.getElementsByClassName('percent')[0].setAttribute('style', `--num:${percentage}`);
        document.getElementsByClassName('countdown')[0].innerHTML = `<h4>${convertToTime(timer)}</h4>`;
    }
    else if (check.length == 5) {
        let timer = timeDifference(document.getElementById('clock').innerHTML, element[0].parentElement.getAttribute('data-type'), '00:00');
        let limit = timeDifference('00:00', element[0].parentElement.getAttribute('data-type'), '00:00');
        let percentage = Math.floor(timer / limit * 100);
        document.getElementsByClassName('percent')[0].setAttribute('style', `--num:${percentage}`);
        document.getElementsByClassName('countdown')[0].innerHTML = `<h4>${convertToTime(timer)}</h4>`;
    } else {
        let timer = timeDifference(document.getElementById('clock').innerHTML, element[0].parentElement.getAttribute('data-type'), '24:00');
        let limit = timeDifference(element[0].parentElement.getElementsByClassName('active')[0].innerHTML, element[0].parentElement.getAttribute('data-type'), '24:00');
        let percentage = Math.floor(timer / limit * 100);
        document.getElementsByClassName('percent')[0].setAttribute('style', `--num:${percentage}`);
        document.getElementsByClassName('countdown')[0].innerHTML = `<h4>${convertToTime(timer)}</h4>`;
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
 * @param {*} exception 24 hour displacemnt for isha time
 * @returns value of time2 - time1 in seconds
 */
function timeDifference(time1, time2, exception) {
    //code to process string to number
    
    let startSec = convertToSeconds(time1);
    let endSec = convertToSeconds(time2) + convertToSeconds(exception);

    let timeDiff = endSec - startSec;
    return timeDiff;
}
/**
 * function to convert time into seconds
 * @param {*} arg parameter for time string
 * @returns time converted in seconds
 */
function convertToSeconds(arg) {
    let seconds = 0;
    let array = arg.split(':');
    for (let i = 0; i < array.length; i++) {
        for (let x = 2; x > i; x--) {
            array[i] *= 60;
        }
        seconds += Number(array[i]);
    }
    return seconds;
}
/**
 * Function to convert seconds to hours and minutes
 * @param {*} seconds paramter 
 * @returns return string as HH:MM
 */
function convertToTime(seconds) {
    let h = Math.floor(seconds / 3600);
    let m = seconds % 3600;
    let s = m % 60;
    m = Math.floor(m / 60);
    m = checkTime(m);
    h = checkTime(h);
    s = checkTime(s);
    if (seconds < 0) {
        return  '00:00:00';
    }
    return h + ':' + m + ':' + s;
}