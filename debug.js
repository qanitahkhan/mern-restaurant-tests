// debug.js - Run this to diagnose the issue
const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function testChromeDriver() {
    console.log('=== ChromeDriver Diagnostic Test ===\n');
    
    console.log('Step 1: Checking Chrome installation...');
    const options = new chrome.Options();
    options.addArguments('--headless=new');
    options.addArguments('--no-sandbox');
    options.addArguments('--disable-dev-shm-usage');
    
    let driver;
    
    try {
        console.log('Step 2: Attempting to start ChromeDriver...');
        console.log('This may take 30-60 seconds on first run...\n');
        
        const startTime = Date.now();
        
        driver = await new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build();
        
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`✓ SUCCESS! ChromeDriver started in ${elapsed} seconds\n`);
        
        console.log('Step 3: Testing navigation...');
        await driver.get('https://www.google.com');
        const title = await driver.getTitle();
        console.log(`✓ Page loaded successfully. Title: "${title}"\n`);
        
        console.log('=== ALL TESTS PASSED ===');
        console.log('Your ChromeDriver is working correctly!');
        console.log('The issue might be with your application URL or test configuration.\n');
        
    } catch (error) {
        console.error('✗ FAILED:', error.message);
        console.error('\nFull error details:');
        console.error(error);
        
        console.log('\n=== TROUBLESHOOTING STEPS ===');
        console.log('1. Check Chrome version: chrome://version/');
        console.log('2. Try: npm install chromedriver@latest --save-dev');
        console.log('3. Check if Chrome is installed at default location');
        console.log('4. Try running as Administrator');
        console.log('5. Disable antivirus temporarily');
    } finally {
        if (driver) {
            await driver.quit();
            console.log('\nChromeDriver closed.');
        }
    }
}

// Run the test
console.log('Starting diagnostic test...\n');
testChromeDriver().catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
});