/*global element, by*/
'use strict';

function DrinkDetailsPage() {
  this.text = element(by.tagName('p'));
  this.heading = element(by.tagName('h2'));
}

module.exports = DrinkDetailsPage;
