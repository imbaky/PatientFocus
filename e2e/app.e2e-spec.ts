import { Page } from './app.po';
import { browser } from "protractor";

describe('App', () => {
  let page: Page;

  beforeEach(() => {
    page = new Page();
  });

  describe('default screen', () => {
    beforeEach(() => {
      page.navigateTo('/');
    });

    it('should have a title saying Page One', () => {

      page.getTitle().getText().then(title => {
        expect(title).toBe('Page One')
      });
    });
  })
});
