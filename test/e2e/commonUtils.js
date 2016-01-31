'use strict';

var CommonUtils = function () {
  // this.Protractor = protractor.getInstance();
};

CommonUtils.prototype.getSelectedOptions = function getSelectedOptions(element) {
  return element.all(by.css('option')).filter(function (item) {
    item.isSelected().then(function (selected) {
      console.log('Item = ' + JSON.stringify(item) + ' Selected = ' + selected);
      return selected;
    });
  });
};

CommonUtils.prototype.getDropdownMenuItem = function getSelectedOptions(dropdownText) {
  return element.all(by.css('.dropdown-menu li')).filter(function (item) {
    item.getText().then(function (text) {
      return dropdownText === text;
    });
  });
  // element(by.css('.dropdown-menu li')).element(by.css('li a')).isPresent().then(function () {
  //   console.log('Yes! Dropdown presents!');
  // // });
  // return element(by.css('.dropdown-menu')).element(by.css('li a'));
  // .filter(function (item) {
  //   item.getText().then(function (text) {
  //     console.log('Selected Anchor = ' + text);
  //     return dropdownText === text;
  //   });
  // });
  // // return element(by.css('.dropdown-menu li')).element(by.css('[a role="menuitem"]')).all().filter(function (item) {
  //   item.getText().then(function (text) {
  //     console.log('Selected Anchor = ' + text);
  //     return dropdownText === text;
  //   });
  // });
};

CommonUtils.prototype.expectSelectedOptionValue = function expectSelectedOptionValue(element, optionValue) {
  var value = element.all(by.css('option')).reduce(function (acc, elem) {
    return elem.isSelected().then(function (selected) {
      if (selected) {
        return elem.getText().then(function (text) {
          if (acc === undefined) {
            acc = '';
          }
          return acc + text + ' ';
        });
      } else {
        return acc;
      }
    });
  });
  expect(value).toEqual(optionValue + ' ');
};

CommonUtils.prototype.selectOption = function selectOption(element, optionValue) {
  element.all(by.tagName('option')).then(function (rows) {
    rows.forEach(function (item) {
      if (item.getText().toBe(optionValue)) {
        item.click();
      }
    });
  });
};

CommonUtils.prototype.selectOptions = function selectOptions(element, optionValues) {
  element.all(by.tagName('option')).then(function (rows) {
    rows.forEach(function (item) {
      item.getText().then(function (text) {
        if (optionValues.indexOf(text) > -1) {
          item.click();
        }
      });
    });
  });
};

module.exports = new CommonUtils();
