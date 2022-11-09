const { By, Builder, Key, until } = require("selenium-webdriver");
const { elementIsVisible } = require("selenium-webdriver/lib/until");
const { writeExcel } = require("../utils/excelHandler");
const { fromObjectToObjectArray } = require("../utils/mapper");
const { aeroMexicoSchema } = require("../utils/schemas");
require("chromedriver");

const DT_URL = "https://aeromexico.com/es-mx";
let DT_DEPARTURE = ["Nueva York - John F. Kennedy", "Monterrey", "Madrid"];
let DT_DESTINATION = ["Guadalajara", "San Salvador", "Puerto Vallarta (Riviera Nayarit)", "Lima"];

// const getRandomDeparture = async (driver) => {
//     DT_DEPARTURE = await getElementsBy("css", ".NewBookerAirportAutocompleteList", driver);
//     DT_DEPARTURE = await Promise.all(DT_DEPARTURE.map(async (airport) => await airport.getText()));
//     const airportIndex = Math.floor(Math.random() * DT_DEPARTURE.length);
//     const desiredAirport = DT_DEPARTURE[airportIndex];
//     return desiredAirport;
// };

// const getRandomDestination = async (driver) => {
//     DT_DESTINATION = await getElementsBy("css", ".destination-item", driver);
//     DT_DESTINATION = await Promise.all(DT_DESTINATION.map(async (airport) => await airport.getText()));
//     const airportIndex = Math.floor(Math.random() * DT_DESTINATION.length);
//     const desiredAirport = DT_DESTINATION[airportIndex];
//     return desiredAirport;
// };
const getRandomDeparture = () => {
    const airportIndex = Math.floor(Math.random() * DT_DEPARTURE.length);
    const desiredAirport = DT_DEPARTURE[airportIndex];
    return desiredAirport;
};

const getRandomDestination = () => {
    const airportIndex = Math.floor(Math.random() * DT_DESTINATION.length);
    const desiredAirport = DT_DESTINATION[airportIndex];
    return desiredAirport;
};


const setDepartureDate = async (driver) => {
    await getElementBy("css", ".BookerCalendarPicker-departing", driver)
        .then(el => el.click());
    const days = await getElementsBy("xpath", "//button[not(contains(@class, 'DatePickerCalendarMonthRefactored-day--isDisabled')) and contains(@class, 'DatePickerCalendarMonthRefactored-day')]", driver);
    await days[9].click();
}

const setReturningDate = async (driver) => {
    driver.wait(async function() {
        const returnDateLabel = await getElementBy("css", ".BookerCalendarPicker-returning", driver);
        const currentClass = await returnDateLabel.getAttribute("class");
        console.log(currentClass);
        return currentClass.includes("isActive");
    }, 5000);
    const days = await getElementsBy("xpath", "//button[not(contains(@class, 'DatePickerCalendarMonthRefactored-day--isDisabled')) and contains(@class, 'DatePickerCalendarMonthRefactored-day')]", driver);
    await days[2].click();
}

const setPassengers = async (driver) => {
    await getElementBy("id", "btnPaxSelect", driver)
        .then(el => el.click());
    const addAdultButton = await getElementBy("xpath", "(//div[@class= 'BookerPassengerSelector BookerPassengerSelectorNewBooker'])(1) //button[constains(@class, 'BookerPassengerSelector-button--up')]", driver);
    const passengerNumber = 2;
    for (let index = 1; index < passengerNumber; index++) {
        await addAdultButton.click();
    }
}

const setDeparture = async (driver) => {
    const origin = await getElementBy("name", "origin", driver);
    const departure = getRandomDeparture();
    console.log(departure);
    await driver
        .actions()
        .move({ origin })
        .click()
        .sendKeys(departure, Key.ESCAPE)
        .perform()

    // await getElementBy("xpath", `//li[contains(@class, "destination-item") and contains(text(), "${departure}")]`, driver)
    //     .then(el => el.click());
}

const setDestination = async (driver) => {
    const destination = await getElementBy("name", "destination", driver);
    const dest = getRandomDestination();
    console.log(dest);
    await driver
        .actions()
        .move({ destination })
        .click()
        .sendKeys(dest, Key.ESCAPE)
        .perform()
}

async function exercise() {
    const driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.get(DT_URL);

    try {
        // await setDeparture(driver);
        // await setDestination(driver);
        await setDepartureDate(driver);
        await setReturningDate(driver);
        // await setPassengers(driver);
        // await getElementBy("css", ".btn-calendar", driver)
        //     .then(el => el.click());
        // console.log("Booked");
        // await driver.sleep(5000);
    } catch (err) {
        console.log(err);
    } finally {
        driver.quit();
        // const aiportsData = { DT_URL, DT_DEPARTURE, DT_DESTINATION };
        // const mappedData = fromObjectToObjectArray(aiportsData);
        // writeExcel(aeroMexicoSchema, mappedData, "AeroMexicoTestData");
    }
}

const getElementBy = async (locatorType, locator, driver) => {
    switch (locatorType) {
        case "id":
            return await driver.findElement(By.id(locator));
            break;
        case "name":
            return await driver.findElement(By.name(locator));
            break;
        case "css":
            return await driver.findElement(By.css(locator));
            break;
        case "xpath":
            return await driver.findElement(By.xpath(locator));
            break;
        case "class":
            return await driver.findElement(By.className(locator));
            break;
        case "linkText":
            return await driver.findElement(By.linkText(locator));
            break;
        default:
            break;
    }
}

const getElementsBy = async (locatorType, locator, driver) => {
    switch (locatorType) {
        case "id":
            return await driver.findElements(By.id(locator));
            break;
        case "name":
            return await driver.findElements(By.name(locator));
            break;
        case "css":
            return await driver.findElements(By.css(locator));
            break;
        case "xpath":
            return await driver.findElements(By.xpath(locator));
            break;
        case "class":
            return await driver.findElements(By.className(locator));
            break;
        default:
            break;
    }
}

exercise();