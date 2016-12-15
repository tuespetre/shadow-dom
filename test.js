const spawn = require('child_process').spawn;
const webdriver = require('selenium-webdriver');

// Input capabilities
const capabilities = {
  'browserName' : 'safari', 
  'version': '9.1',
  'browserstack.user' : 'derekgray2',
  'browserstack.key' : 'aSyZj64XMxH3Eb61nCf4',
  'browserstack.local': true
};

const serverCmd = process.platform === 'win32' ? 'http-server.cmd' : 'http-server';

const server = spawn(serverCmd, ['-p', '50573']);

const driver = new webdriver.Builder()
  .usingServer('http://hub-cloud.browserstack.com/wd/hub')
  .withCapabilities(capabilities)
  .build();

driver.get('http://localhost:50573/tests/index.html');

driver.executeScript('return window.failedTests;').then(failures => {
    if (!failures.length) {
        console.log('All tests passed');
        return;
    }
    console.log('One or more tests failed');
    console.log(failures);
});

driver.quit();
server.kill();