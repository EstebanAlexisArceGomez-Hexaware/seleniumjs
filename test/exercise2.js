const { By, Builder, Key, until } = require("selenium-webdriver");
const { writeExcel } = require("../utils/filehandler");
const { fromObjectToObjectArray } = require("../utils/mapper");
const { schema } = require("../utils/schemas");
require("chromedriver");

const DT_URL = "https://rahulshettyacademy.com/dropdownsPractise/";
let DT_DEPARTURE = [];
let DT_DESTINATION = [];

const getRandomDeparture = async (driver) => {
    DT_DEPARTURE = await getElementsBy("css", ".dropdownDiv li", driver);
    DT_DEPARTURE = await Promise.all(DT_DEPARTURE.map(async (airport) => await airport.getText()));
    const airportIndex = Math.floor(Math.random() * DT_DEPARTURE.length);
    const desiredAirport = DT_DEPARTURE[airportIndex];
    return desiredAirport;
};

const getRandomDestination = async (driver) => {
    DT_DESTINATION = await getElementsBy("css", "#glsctl00_mainContent_ddl_destinationStation1_CTNR li", driver);
    DT_DESTINATION = await Promise.all(DT_DESTINATION.map(async (airport) => await airport.getText()));
    const airportIndex = Math.floor(Math.random() * DT_DESTINATION.length);
    const desiredAirport = DT_DESTINATION[airportIndex];
    return desiredAirport;
};

const setdepartureDate = async (driver) => {
    await getElementBy("id", "ctl00_mainContent_view_date1", driver)
        .then(el => el.click());
    const days = await getElementsBy("class", "ui-state-default", driver);
    await days[4].click();
}

const setPassengers = async (driver) => {
    await getElementBy("id", "divpaxinfo", driver)
        .then(el => el.click());
    const passengerNumber = 3;
    for (let index = 0; index < passengerNumber - 1; index++) {
        await getElementBy("id", "hrefIncAdt", driver)
            .then(el => el.click());
    }
    await getElementBy("id", "btnclosepaxoption", driver)
        .then(el => el.click());
}

const setDeparture = async (driver) => {
    await getElementBy("id", "ctl00_mainContent_ddl_originStation1_CTXTaction", driver)
        .then(el => el.click());
    const departure = await getRandomDeparture(driver);
    console.log(`DEPARTURE: ${departure}`);
    await getElementBy("id", "ctl00_mainContent_ddl_originStation1_CTXT", driver)
        .then(el => el.sendKeys(departure));
}

const setDestination = async (driver) => {
    const destination = await getRandomDestination(driver);
    console.log(`DESTINATIONS: ${destination}`);
    await getElementBy("xpath", `//div[@id = 'glsctl00_mainContent_ddl_destinationStation1_CTNR'] //li/a[contains(text(), "${destination}")]`, driver)
        .then(el => el.click());
}

const setTripType = async (driver) => {
    await getElementBy("id", "ctl00_mainContent_rbtnl_Trip_0", driver)
        .then(el => el.click());
}

const setShopWithMiles = async (driver) => {
    await getElementBy("id", "ctl00_mainContent_chk_friendsandfamily", driver)
        .then(el => el.sendKeys(Key.ENTER));
}

async function exercise() {
    const driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: 8000 });
    await driver.get(DT_URL);

    try {
        await setTripType(driver);
        await setShopWithMiles(driver);
        await setDeparture(driver);
        await setDestination(driver);
        await setdepartureDate(driver);
        await driver.sleep(3000);
        await setPassengers(driver);
        await getElementBy("id", "ctl00_mainContent_btn_FindFlights", driver)
            .then(el => el.click());
        console.log("Booked");
        await driver.sleep(3000);
    } catch (err) {
        console.log(err);
    } finally {
        driver.quit();
        const aiportsData = { DT_URL, DT_DEPARTURE, DT_DESTINATION };
        const mappedData = fromObjectToObjectArray(aiportsData);
        writeExcel(schema, mappedData, "TestData");
    }
}

const getElementBy = async (locatorType, locator, driver) => {
    switch (locatorType) {
        case "id":
            return await driver.findElement(By.id(locator));
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
        default:
            break;
    }
}

const getElementsBy = async (locatorType, locator, driver) => {
    switch (locatorType) {
        case "id":
            return await driver.findElements(By.id(locator));
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