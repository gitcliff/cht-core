const submitButton = () => $('.enketo .submit');
const nextButton = () => $('button.btn.btn-primary.next-page');
const addButton = () => $('.action-container .general-actions:not(.ng-hide) .fa-plus');
const leftActionBarButtons = () => $$('.general-actions .actions.dropup > a');
const reportTitle = () => $('#report-form #form-title');

const nextPage = async (numberOfPages = 1) => {
  for (let i = 0; i < numberOfPages; i++) {
    await (await nextButton()).waitForDisplayed();
    await (await nextButton()).click();
  }
};

const formByHref = (href) => {
  const css = `.action-container .general-actions .dropup.open .dropdown-menu li a[href="#/reports/add/${href}"]`;
  return $(css);
};

const selectForm = async (formId, nonAdminUser = false) => {
  if (!nonAdminUser) { // non-admin may or may not get the "select" mode button, depending on permissions
    const expectedActionbarButtons = 3;
    // wait for all actionbar links to appear
    await browser.pause(async () => await leftActionBarButtons().count() === expectedActionbarButtons, 1000);
  }


  await (await addButton()).waitForDisplayed();

  // select form
  await (await addButton()).click();
  await (await formByHref(formId)).click();

  // waiting for form
  await (await reportTitle()).waitForDisplayed();
};

module.exports = {
  submitButton,
  nextPage,
  selectForm,
};
