const { By, Builder, Key, until } = require("selenium-webdriver");
require("chromedriver");

const URL = "https://www.delta.com/";
let airports = ["MTY", "ATL", "CUN", "NYC"];

const getRandomLocation = () => airports[Math.floor(Math.random() * airports.length)];

const getRandomLocation2 = () => {
    const airportIndex = Math.floor(Math.random() * airports.length);
    const desiredAirport = airports[airportIndex]; 
    airports = airports.filter(airport => airport !== desiredAirport);
    return desiredAirport;
};

const setdepartureDate = async (driver, departure, destination) => {
    await driver.findElement(By.css(".icon-Calendar")).click();
    if (departure !== destination) {
        await driver.findElement(By.css("td.dl-datepicker-current-day")).click();
    } else {
        const days = await driver.findElements(By.css("td.dl-datepicker-available-day"));
        await days[4].click()
    }
    await driver.findElement(By.css("button[value='done']")).click();
}

const setPassengers = async (driver) => {
    const passengersDropdown = await driver.findElement(By.css("span[aria-labelledby='passengers-label']"));
    await passengersDropdown.click();
    const passengerNumber = "3";
    await passengersDropdown.findElement(By.xpath(`//li[contains(text(), ${passengerNumber})]`)).click();
}

const selectLocation = async (driver, location) => {
    const locationInput = await driver.findElement(By.id("search_input"));
    await locationInput.clear();
    await locationInput.sendKeys(location, Key.ENTER);
    await driver.findElement(By.css(".search-results ul li")).click();
}

const setDeparture = async (driver, departure) => {
    await driver.findElement(By.id("fromAirportName")).click();
    await selectLocation(driver, departure);
}

const setDestination = async (driver, destination) => {
    await driver.findElement(By.id("toAirportName")).click();
    await selectLocation(driver, destination);
}

const setTripType = async (driver) => {
    const tripDropdown = await driver.findElement(By.css(".select-ui-wrapper"));
    await tripDropdown.click();
    await tripDropdown.findElement(By.xpath("//li[text() = 'One Way']")).click();
}

const setShopWithMiles = async (driver) => {
    await driver.findElement(By.id("shopWithMiles")).sendKeys(Key.ENTER);
}

async function exercise() {
    const driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: 8000 });
    await driver.get(URL);

    try {
        // await driver.findElement(By.xpath("//button[contains(text(), 'Mexico - English')]")).click();
        await setTripType(driver);
        await setShopWithMiles(driver);
        const departure = getRandomLocation2();
        const destination = getRandomLocation2();
        await setDeparture(driver, departure);
        await setDestination(driver, destination);
        await setdepartureDate(driver, departure, destination);
        await setPassengers(driver);
        await driver.findElement(By.id("btn-book-submit")).click();
        await driver.wait(until.elementIsVisible(driver.findElement(By.className("advanced-search-heading"))), 5000);
        const selectedDeparture = await driver.findElement(By.id("fromAirportName")).getText();
        const selectedDestination = await driver.findElement(By.id("toAirportName")).getText();
        const selectedTrip = await driver.findElement(By.id("selectTripType")).getAttribute("value");
        const results = { selectedDeparture, selectedDestination, selectedTrip };
        console.table(results);
        await driver.sleep(3000);
    } catch (err) {
        console.log(err);
    } finally {
        driver.quit();
    }
}

exercise();