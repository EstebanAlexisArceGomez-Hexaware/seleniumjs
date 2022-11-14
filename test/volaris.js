const { assert } = require("console");
const { By, Builder, Key, until } = require("selenium-webdriver");
const { elementIsVisible } = require("selenium-webdriver/lib/until");
const { writeExcel } = require("../utils/excelHandler");
const { fromObjectToObjectArray } = require("../utils/mapper");
const { schema } = require("../utils/schemas");
require("chromedriver");

const DT_URL = "https://www.volaris.com/";
let DT_DEPARTURE = [];
let DT_DESTINATION = [];

const getRandomLocation = async (locationArray, driver) => {
    let tempArr = await getElementsBy("css", ".destination-item", driver);
    tempArr = await Promise.all(tempArr.map(async (airport) => {
        const airportText = await airport.getText();
        return airportText.includes(" New") ? airportText.replace(" New", "") : airportText
    }));
    tempArr.forEach(element => {
        locationArray.push(element);
    });
    const airportIndex = Math.floor(Math.random() * locationArray.length);
    return locationArray[airportIndex];
}

const setDepartureDate = async (driver) => {
    driver.wait(until.elementIsVisible(await getElementBy("css", "ngx-daterangepicker-material", driver)), 5000);
    await driver.sleep(5000)
    // driver.wait(async function() {
    //     const returnDateItem = await getElementBy("css", "td.loading", driver);
    //     const currentClass = await returnDateItem.getAttribute("class");
    //     return !currentClass.includes("loading");
    // }, 10000);
    const day = await getElementBy("xpath", "//td[not(contains(@class, 'disabled')) and contains(@class, 'customfare')]", driver);
    await day.click();
}

const setReturningDate = async (driver) => {
    await driver.sleep(5000)
    const day = await getElementBy("xpath", "//td[not(contains(@class, 'disabled')) and contains(@class, 'returnCustomfare available')]", driver);
    await day.click();
    await getElementBy("css", ".dialog-bottom button", driver)
        .then(el => el.click());
}

const setPassengers = async (driver) => {
    await getElementBy("css", ".passenger-cnt-sum", driver)
        .then(el => el.click());
    const addAdultButton = await getElementBy("css", "div.passenger-type-list button.quantity-right-plus", driver);
    const passengerNumber = 2;
    for (let index = 1; index < passengerNumber; index++) {
        await addAdultButton.click();
    }
}

const setDeparture = async (driver) => {
    await getElementBy("css", ".SearchOrigin", driver)
        .then(el => el.click());
    await driver.sleep(10000);
    await getElementBy("linkText", "View all our destinations", driver)
        .then(el => el.click());
    const departure = await getRandomLocation(DT_DEPARTURE, driver);
    console.log(`DEPARTURE: ${departure}`);
    await getElementBy("xpath", `//li[contains(@class, "destination-item") and contains(text(), "${departure}")]`, driver)
        .then(el => el.click());
}

const setDestination = async (driver) => {
    await driver.sleep(10000);
    await getElementBy("linkText", "View all our destinations", driver)
        .then(el => el.click());
    const destination = await getRandomLocation(DT_DESTINATION, driver);
    console.log(`DESTINATION: ${destination}`);
    await getElementBy("xpath", `//li[contains(@class, "destination-item") and contains(text(), "${destination}")]`, driver)
        .then(el => el.click());
}

const selectCheapestDeparture = async (driver) => {
    await getElementBy("css", ".sortbyFare", driver)
        .then(el => el.click());
    await getElementBy("css", ".flightItem .flightFares .fareRegular", driver)
        .then(el => el.click());
    const cheapestCard = await getElementBy("css", ".fareTypes .col-md-4", driver);
    const actions = driver.actions({ async: true });
    await actions.move({ origin: cheapestCard }).perform();
    await cheapestCard
        .findElement(By.css("mat-card button"))
        .then(el => el.click())
}

const selectCheapestReturning = async (driver) => {
    await getElementBy("css", ".flightItemDetails .flightFares .fareRegular", driver)
        .then(el => el.click());
    const cheapestCard = await getElementBy("css", ".fareTypes .col-md-4", driver);
    const actions = driver.actions({ async: true });
    await actions.move({ origin: cheapestCard }).perform();
    await cheapestCard
        .findElement(By.css("mat-card button"))
        .then(el => el.click())
}

const checkInfoMatches = async (departure, destination, passengers) => {
    const departureSection = await getElementBy("css", "mbs-selected-flight .flight-info .regular .row .flightroute");
    const flightRoute = await departureSection.getText();
    assert(flightRoute.includes(departure) && flightRoute.includes(destination));
    const passengerSection = await getElementBy("css", "mbs-passengers-card .mat-expansion-panel-content");
    const selectedPassengers = await passengerSection.getText();
    assert(selectedPassengers.includes(passengers));
}

async function exercise() {
    const driver = await new Builder().forBrowser("chrome").build();
    await driver.manage().window().maximize();
    await driver.manage().setTimeouts({ implicit: 10000 });
    await driver.get(DT_URL);

    try {
        await setDeparture(driver);
        await setDestination(driver);
        await setDepartureDate(driver);
        await setReturningDate(driver);
        await setPassengers(driver);
        await getElementBy("css", ".btn-large", driver)
            .then(el => el.click());
        await driver.wait(until.elementIsVisible(await getElementBy("id", "tua-message", driver)), 15000);
        let bookingDetails = await getElementBy("css", ".route-info-heading", driver);
        bookingDetails = await bookingDetails.getText();
        await selectCheapestDeparture(driver);
        // await driver.wait(until.elementIsNotVisible(await getElementBy("id", "system-loader", driver)), 15000);
        await driver.sleep(7000);
        await selectCheapestReturning(driver);
        await driver
            .actions()
            .move({origin: await getElementBy("css", "mat-dialog-container", driver)})
            .perform()
        await getElementBy("css", ".baggage-modal button", driver)
            .then(el => el.click())
        // await checkInfoMatches();
        await driver.actions()
            .scroll(0, 0, 0, 0, await getElementBy("id", "tuaFee", driver))
            .perform();
        await getElementBy("css", ".checkforprice", driver)
            .then(el => el.click());
        await getElementBy("css", "#ContinueToSeat button", driver)
            .then(el => el.click());
        await driver.sleep(7000);
        await getElementBy("css", "mat-grid-tile.available")
            .then(el => el.click());
        const seatsButton = await getElementBy("css", ".pax-tab-container button", driver);
        await seatsButton.click();
        await driver.wait(until.elementTextMatches(seatsButton, "Continue to payment"), 5000);
        await driver.sleep(7000);
        await getElementBy("css", ".continue", driver)
            .then(el => el.click())
        await getElementBy("css", "input[formcontrolname = 'fName']")
            .then(el => el.sendKeys("Alex"));
        await getElementBy("css", "input[formcontrolname = 'lName']")
            .then(el => el.sendKeys("Lora"));
        await getElementBy("css", "input[formcontrolname = 'dobDay']")
            .then(el => el.sendKeys("16"));
        await getElementBy("css", "input[formcontrolname = 'dobMonth']")
            .then(el => el.sendKeys("Jan"));
        await getElementBy("css", "input[formcontrolname = 'dobYear']")
            .then(el => el.sendKeys("1998"));
        await getElementBy("css", ".nationality input")
            .then(el => el.click());
        await getElementBy("css", "mat-option", driver)
            .then(el => el.click())
        await getElementBy("xpath", "(//div[contains(@class, 'primary-customer-section')]/following-sibling::div)[1] //button", driver)
            .then(el => el.click())
    } catch (err) {
        console.log(err);
    } finally {
        driver.quit();
        const aiportsData = { DT_URL, DT_DEPARTURE, DT_DESTINATION };
        const mappedData = fromObjectToObjectArray(aiportsData);
        writeExcel(schema, mappedData, "VolarisTestData");
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