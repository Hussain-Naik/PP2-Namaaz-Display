# Namaaz Display
![Namaaz Display](documentation/responsive-display.png)

The [Namaaz Display](https://hussain-naik.github.io/PP2-Namaaz-Display/) website allows people to find namaaz times for a given city location or gps coordinates. The website also displays a timer for time remaing to perform current prayer.

---
## User stories

### First time visitor goals
- As a first time visitor I want to know what time each islamic prayer is
- As a first time visitor I want the site Responsive on my device
- As a first time visitor I want the site to be easy to navigate

### Returning visitor goals
- As a returning visitor I want to know how long remaining for current prayer

### Frequent visitor goals
- As a Frequent visitor I want to know prayer times in different cities
- As a Frequent visitor I want to know next day prayer times to avoid missing my prayers

---
## Technologies Used

- [HTML](https://developer.mozilla.org/en-US/docs/Web/HTML)
- [CSS](https://developer.mozilla.org/en-US/docs/Web/css)
- [Font Awesome icons](https://fontawesome.com/)
- [Google fonts](https://fonts.google.com/)
- [VSCode](https://code.visualstudio.com/)
- [Canva](https://www.canva.com/)
- [Git](https://git-scm.com/)
- [GitHub](https://github.com/)
- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Balsamiq Wireframes](https://balsamiq.com/)
- [Postman](https://en.wikipedia.org/wiki/Postman_(software))

---
## Design

### Wireframe

- Index Page Mockup
![Index Page](documentation/index-wireframe.png)

- City Form Selector Mockup
![City Form Page](documentation/city-form-wireframe.png)

- Results Page Mockup
![Results Page](documentation/results-wireframe.png)

- Error Page Mockup
![Error Page](documentation/errors-wireframe.png)


### Color Scheme

![color-palette](documentation/color-palette.png)
- Main color 60% of site #20232F Raisin Black
- Secondary color 30% of site #F3FCF0 Honeydew
- Action Color 10% of site #C3B367 Ecru
- Form Validation #FF0000 Red

### Typography

- Google Fonts
    - [Oxygen](https://fonts.google.com/specimen/Oxygen?query=oxygen) - used for heading and logo
    - [Roboto](https://fonts.google.com/specimen/Roboto?query=Roboto) - used for remaing body text

---
## Features
![Home Page](documentation/responsive-city-display.png)
![Form](documentation/responsive-city-display.png)
![Form Validation](documentation/responsive-validator-display.png)
![Results](documentation/responsive-results-display.png)
![No GeoLocation](documentation/responsive-error-display.png)
![Fetch Error](documentation/responsive-error-fetch-display.png)
![404 Error](documentation/responsive-404-display.png)

---
## Testing

### Full Testing

Full testing was performed on the following devices:

- Decktop:
  - Mac Mini 2014
- Mobile Devices:
  * iPhone SE (3rd Gen).
  * iPhone X


Each device tested the site using the following browsers:

* Google Chrome
* Safari
* Firefox

| Feature | Expected Outcome | Testing Performed | Result | Pass/Fail |
| --- | --- | --- | --- | --- |
| The Sites title | Link directs the user back to the home page | Clicked title | Home page reloads | Pass |
| All Link - hover effect | Animation of green underline when hovered | Hover over all links on page | Each link displayed correct styling when hovered over | Pass |
| Click By City | Display City Selection Form | Clicked By City | Display Form with Country and City Selection | Pass |
| Click By Location (Allow location)| Load Prayers times for given location | Clicked By Location | Correct location prayer data displayed | Pass |
| Click By Location (restrict location) | Error as Fetch request passed without location parameters | Clicked By Location without user location permission | Custom error displayed stating location permission required | Pass |
| Click Back after By Location | Display Initial Landing Page | Clicked Back | Returned to Initial Display | Pass |
| Click Back after By City | Display Initial Landing Page | Clicked Back | Returned to Initial Display | Pass |
| Click Back after By Location Error | Display Initial Landing Page | Clicked Back | Returned to Initial Display | Pass |
| Click Back after By City Error | Display Initial Landing Page | Clicked Back | Returned to Initial Display | Pass |
| Populate City Selector based on Country | Data List input populated based on country | Selected Country | Cities Populated based on country | Pass |
| Country List Dropdown | Users will see a drop-down list of the pre-defined options as they input data | Begin Typing in Country input | List displayed Country | Pass |
| Assign Country code | Selecting Country from data list will assign Country Code to input field | Selected Country from list | Country Code displayed in input field | Pass |
| City List Dropdown | Users will see a drop-down list of the pre-defined options as they input data | Begin Typing in City input | List displayed Cities | Pass |
| Assign City to input | Selecting City from data list will assign City to input field | Selected a City from list | Chosen City displayed in input field | Pass |
| Click Submit (Inputs Selected) | Load Prayers times for given city | Clicked Submit | Correct location prayer data displayed | Pass |
| Click Submit (City Input Empty) | Required Input prompt user to select a City | Clicked Submit with city input empty | City Label changed colour to red requesting user to select | Pass |
| Click Submit (Country Input Empty) | Required Input prompt user to select a Country | Clicked Submit with country input empty | Country Label colour changed to red requesting user to select | Pass |
| Click Submit (Both Inputs Empty) | Required Inputs prompt user to select a Country and City | Clicked Submit with inputs empty|  Label colour changed to red requesting user input | Pass |
| Click Submit (Country Input invalid) | Error as Fetch request passed with invalid parameters | Clicked Submit with invalid country | Custom error displayed with button to go back | Pass |
| Click Back after Submit | Display Form City Selector | Clicked Back | Country/City Selector form displayed | Pass |
| Click Back after Submit Error | Display Form City Selector | Clicked Back | Country/City Selector form displayed | Pass |



---
## Bugs

### Solved Bugs

- Fix API month parameter as getMonth() returns value from 0-11
    - +1 to month value for current month

- Timer countdown was inserted for each prayer
    - Function to insert timer placed after if statement and removed first timer sibling

- Timer percentage need to convert current time to seconds to compare and calculte percentage
    - Calculate correct precentage from remaining time left

- API fetch data for month unable to get next day when end of month
    - Added two single date API reqeust for current and next day

- API request failed due to GitHub sercurity
    - Changed reqeust to https and add secure prefix for geonames.
    
### Unsolved Bugs

- None

### Mistakes

- Commit without Add Prefix
![mistake](documentation/git-mistake.png)

---
## Validator Testing

### HTML Validator

- Home Page no errors or warnings were found when passing through the official W3C validator.
![Home Page](documentation/html-validation.png)

### CSS Validator

- No errors or warnings were found when passing through the official W3C (Jigsaw)
![css](documentation/css-validation.png)

### JavaScript Validator

- No errors or warnings were found when passing through the official W3C (Jigsaw)
![javascript](documentation/css-validator.png)

### Lighthouse Accessibility and Performance

- Home Page using lighthouse in devtools I confirmed that the page is performing well, accessible and colors and fonts chosen are readable.
![lighthouse](documentation/lighthouse-validation.png)

---
## Deployment

- The site was deployed to GitHub pages. The steps to deploy are as follows: 
  - In the [GitHub repository](https://github.com/Hussain-Naik/PP2-Namaaz-Display), navigate to the Settings tab 
  - From the source section drop-down menu, select the **Main** Branch, then click "Save".
  - The page will be automatically refreshed with a detailed ribbon display to indicate the successful deployment.

The live link can be found [here](https://hussain-naik.github.io/PP2-Namaaz-Display)


- In order to make a local copy of this project, you can clone it. In your IDE Terminal, type the following command to clone my repository:

- `git clone https://github.com/Hussain-Naik/PP2-Namaaz-Display.git`
---
## Future Improvements

- Add a digital clock font to time.
- Add feature for hanafii school prayer times as they differ slightly.
- Add refresh to results at midnight to retrive new data.
- Add reverse geolocation to display user city rather than coordinates.
- Add addional information for islamic relevance dates.

---
## Credits

- All images are taken from [unsplash](https://unsplash.com/), [pixabay](https://pixabay.com/) and [freepik](https://www.freepik.com/) website or created using [canva]().
- favicon was made using [faviconer.com](http://www.faviconer.com/).

---
## Acknowledgments

- Due to the nature of the project the first form of acknowledegement is to Allah with the common islamic phrase Alhamdulillah (roughly equivalent to "thank God". Literally it means "all praise is to God")
- [Aleksei Konovalov](https://github.com/lexach91) great guidance and mentor throughout project
- [Code Institute](https://codeinstitute.net/) tutors and Slack community members for their support and help.
- [Kevin Powell](https://www.youtube.com/user/KepowOb) Flex display tutorials.
- [Coding Artist](https://www.youtube.com/@CodingArtist) CSS hover animation tutorial.
- [David Fekke](https://fek.io/blog/how-to-observe-changes-to-the-dom-without-using-a-java-script-framework/) Documentation on Dom chnages without a javascript framework.
- [Muhammad Irshad - Online Tutorials](https://www.youtube.com/@OnlineTutorialsYT) tutorial on how to make animated circular timer.

---