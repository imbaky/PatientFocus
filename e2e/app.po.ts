import { browser, by } from 'protractor';

export class Page {

  navigateTo(destination) {
    return browser.get(destination);
  }

  getTitle() {
    return browser.element(by.css('.ion-page .toolbar-title'));
  }

}
