/*global describe, beforeEach, it, browser, expect */
'use strict';

var DrinksPagePo = require('./drinks.po');

describe('Drinks page', function () {
  var drinksPage;

  beforeEach(function () {
    drinksPage = new DrinksPagePo();
    browser.get('/#/drinks');
  });

  it('should say DrinksCtrl', function () {
    expect(drinksPage.heading.getText()).toEqual('drinks');
    expect(drinksPage.text.getText()).toEqual('DrinksCtrl');
  });
});
