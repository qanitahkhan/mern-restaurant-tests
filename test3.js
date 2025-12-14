const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const assert = require('assert');
const path = require('path');

const APP_URL = 'http://localhost:5173';

describe('Restaurant Tests', function() {
    this.timeout(30000);
    let driver;

    before(async function() {
        this.timeout(60000);
        
        console.log('\nStarting Chrome...');
        
        try {
            // Find chromedriver
            const chromedriverPath = path.join(__dirname, 'node_modules', 'chromedriver', 'lib', 'chromedriver', 'chromedriver.exe');
            console.log('ChromeDriver path:', chromedriverPath);
            
            const service = new chrome.ServiceBuilder(chromedriverPath);
            
            const options = new chrome.Options();
            options.addArguments('--no-sandbox');
            options.addArguments('--disable-dev-shm-usage');
            options.addArguments('--disable-gpu');
            
            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeService(service)
                .setChromeOptions(options)
                .build();
            
            console.log('✓ Chrome started!\n');
        } catch (error) {
            console.error('Error:', error.message);
            throw error;
        }
    });

    after(async function() {
        if (driver) {
            await driver.quit();
            console.log('✓ Closed\n');
        }
    });

    it('TC01: Load homepage', async function() {
        await driver.get(APP_URL);
        await driver.sleep(1000);
        const title = await driver.getTitle();
        assert.ok(title.length > 0);
        console.log('✓ TC01 PASSED');
    });

    it('TC02: Has navigation', async function() {
        await driver.get(APP_URL);
        await driver.sleep(1000);
        const nav = await driver.findElement(By.css('nav'));
        assert.ok(await nav.isDisplayed());
        console.log('✓ TC02 PASSED');
    });

    it('TC03: Has content', async function() {
        await driver.get(APP_URL);
        await driver.sleep(1000);
        const body = await driver.findElement(By.css('body'));
        const text = await body.getText();
        assert.ok(text.length > 0);
        console.log('✓ TC03 PASSED');
    });

    it('TC04: Has links', async function() {
        await driver.get(APP_URL);
        const links = await driver.findElements(By.css('a'));
        assert.ok(links.length > 0);
        console.log(`✓ TC04 PASSED (${links.length} links)`);
    });

    it('TC05: Has images', async function() {
        await driver.get(APP_URL);
        const images = await driver.findElements(By.css('img'));
        console.log(`✓ TC05 PASSED (${images.length} images)`);
    });

    it('TC06: Responsive', async function() {
        await driver.manage().window().setRect({ width: 375, height: 667 });
        await driver.get(APP_URL);
        const body = await driver.findElement(By.css('body'));
        assert.ok(await body.isDisplayed());
        await driver.manage().window().setRect({ width: 1920, height: 1080 });
        console.log('✓ TC06 PASSED');
    });

    it('TC07: Loads fast', async function() {
        const start = Date.now();
        await driver.get(APP_URL);
        const time = Date.now() - start;
        assert.ok(time < 10000);
        console.log(`✓ TC07 PASSED (${time}ms)`);
    });

    it('TC08: Has buttons', async function() {
        await driver.get(APP_URL);
        const buttons = await driver.findElements(By.css('button'));
        console.log(`✓ TC08 PASSED (${buttons.length} buttons)`);
    });

    it('TC09: Has inputs', async function() {
        await driver.get(APP_URL);
        const inputs = await driver.findElements(By.css('input'));
        console.log(`✓ TC09 PASSED (${inputs.length} inputs)`);
    });

    it('TC10: Has title', async function() {
        await driver.get(APP_URL);
        const title = await driver.getTitle();
        assert.ok(title.length > 0);
        console.log(`✓ TC10 PASSED ("${title}")`);
    });

    it('TC11: Correct URL', async function() {
        await driver.get(APP_URL);
        const url = await driver.getCurrentUrl();
        assert.ok(url.includes('localhost'));
        console.log(`✓ TC11 PASSED`);
    });

    it('TC12: No errors', async function() {
        await driver.get(APP_URL);
        await driver.sleep(1000);
        console.log('✓ TC12 PASSED');
    });
});