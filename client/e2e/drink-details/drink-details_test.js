/*global describe, beforeEach, it, browser, expect */
'use strict';

var DrinkDetailsPagePo = require('./drink-details.po');

describe('Drink details page', function () {
  var drinkDetailsPage;

  beforeEach(function () {
    drinkDetailsPage = new DrinkDetailsPagePo();
    browser.get('/#/drink-details');
  });

  it('should say DrinkDetailsCtrl', function () {
    expect(drinkDetailsPage.heading.getText()).toEqual('drinkDetails');
    expect(drinkDetailsPage.text.getText()).toEqual('DrinkDetailsCtrl');
  });
});
