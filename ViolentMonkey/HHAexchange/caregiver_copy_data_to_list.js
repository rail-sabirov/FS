try {
    function dataForXLS() {
      const tab = '	'; // String.fromCharCode(9)
      return $('#uxLblPAideCode').text() + tab
        + $('#ctl00_ContentPlaceHolder1_uxlblInfoName').text() + tab
        + $('#lblHireDate').text() + tab
        + $('#uxLblEmploymentType').text() + tab
        + ' ' + tab
        + $('#lblLastWorkDate').text() + tab
        + ' ' + tab
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