try {
    function dataForXLS() {
      return $('#uxLblPAideCode').text() + String.fromCharCode(9)
        + $('#ctl00_ContentPlaceHolder1_uxlblInfoName').text() + String.fromCharCode(9)
        + $('#lblHireDate').text() + String.fromCharCode(9)
        + $('#uxLblEmploymentType').text() + String.fromCharCode(9)
        + ' ' + String.fromCharCode(9)
        + $('#lblLastWorkDate').text() + String.fromCharCode(9)
        + ' ' + String.fromCharCode(9)
        + $('#ctl00_ContentPlaceHolder1_lblLangauges').text();
  }

  // Add button
  $('<div class="fs-button-xls">Copy data for List</div>').insertBefore($('#uxLblMessage'));

  $('.fs-button-xls').on('click', () => {
    const obj = dataForXLS();

    navigator.clipboard.writeText(obj);
    alert('Caregiver Data is Copied!');
  });



  GM_addStyle(`
    .fs-button-xls {
        display: inline-block;
        background-color: #447086;
        border-radius: 4px;
        color: white;
        font-weight: 400;
        padding: 2px 5px;
        margin: 3px;
        cursor: pointer;
    }
  `);

} catch{}