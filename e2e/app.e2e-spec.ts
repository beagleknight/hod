import { HodPage } from './app.po';

describe('hod App', () => {
  let page: HodPage;

  beforeEach(() => {
    page = new HodPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
