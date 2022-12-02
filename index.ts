import * as p from 'puppeteer';

const getValue = (async () => {
    // SETUP ENV
    const SETTING = {
        headless: true
    }
    const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36';
    const DEFAULT_CONCURRENCY_LIST = ['VND', 'USD'];
    const DEFAULT_VALUE = 1;
    const COMPOSE_LINK = `https://www.google.com/search?hl=en&q=${DEFAULT_VALUE}+${DEFAULT_CONCURRENCY_LIST[0]}+to+${DEFAULT_CONCURRENCY_LIST[1]}`;
    const WAIT_TIME = 3000;

    // LAUNCHING CHROMELESS
    const browser = await p.launch(SETTING);
    const page = await browser.newPage();
    await page.setUserAgent(USER_AGENT);
    await page.goto(COMPOSE_LINK);

    // CRAWL DATA PROCESSING
    await page.waitForSelector('#knowledge-currency__updatable-data-column', {
        timeout: WAIT_TIME,
        visible: true,
    });

    const currencyExchange = await page.evaluate(() => {
        return Object.freeze({
            'currency_source_value': parseFloat(document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('input')[0].getAttribute('value')),
            'currency_source_freebase_id': document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[0].options[document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[0].selectedIndex].getAttribute('value'),
            'currency_source_name': document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[0].options[document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[0].selectedIndex].text,
            'currency_target_value': parseFloat(document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('input')[1].getAttribute('value')),
            'currency_target_freebase_id': document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[1].options[document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[1].selectedIndex].getAttribute('value'),
            'currency_target_name': document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[1].options[document.getElementById('knowledge-currency__updatable-data-column').querySelectorAll('select')[1].selectedIndex].text
        });
    });

    // RETURN RESULT ON SCREEN AND CLOSE CHROMELESS
    await browser.close();
    return currencyExchange;
})();

getValue.then(data => console.log(data));