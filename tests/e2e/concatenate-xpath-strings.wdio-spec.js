const concatenateStrings = require('../page-objects/forms/concatenate-strings.wdio.page');
const common = require('../page-objects/common/common.wdio.page');
const constants = require('../constants');
const genericForm = require('../page-objects/forms/generic-form.wdio.page');
const loginPage = require('../page-objects/login/login.wdio.page');
const { expect } = require('chai');


const userContactDoc = {
  _id: constants.USER_CONTACT_ID,
  name: 'Jack',
  date_of_birth: '',
  phone: '+64274444444',
  alternate_phone: '',
  notes: '',
  type: 'person',
  reported_date: 1478469976421,
  parent: {
    _id: 'some_parent',
  },
};

// If this test starts failing then we need to document in the release notes that we've removed the deprecated
// feature allowing for concatenation of strings
describe('Concatenate xpath strings', () => {
  before(() => {
    loginPage.cookieLogin();
    concatenateStrings.configureForm(userContactDoc);
  });

  it('concatenates strings', async () => {
    await common.goToReports();
    await genericForm.selectForm(concatenateStrings.formInternalId, true);
    const concatElement = await $('#concat');
    await concatElement.waitForDisplayed();
    const fullNameInput = await $('[name="/concatenate-strings/inputs/full_name"]');
    const firstNameInput = await  $('[name="/concatenate-strings/inputs/first_name"]');
    expect(await fullNameInput.getValue()).to.equal('John Doe');

    await firstNameInput.setValue('Bruce');
    await fullNameInput.click();
    expect(await fullNameInput.getValue()).to.equal('Bruce Wayne');
  });
});
