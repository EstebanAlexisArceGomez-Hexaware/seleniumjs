var webdriver = require('selenium-webdriver');
const { By } = require('selenium-webdriver');
var driver = new webdriver.Builder().forBrowser('chrome').build();
driver.manage().setTimeouts({ implicit: (10000) });

class Page {
    constructor() {
        global.driver = driver;
    }
    async go_to_url(theURL) {
        await driver.get(theURL);
    }
    async getElementBy(locatorType, locator) {
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

    async getElementsBy (locatorType, locator) {
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
    async enterText(element, searchText) {
        await element.sendKeys(searchText);
    }
    async click(element) {
        await element.click();
    }
    async closeBrowser() {
        await driver.quit();
    }
}

module.exports = Page;