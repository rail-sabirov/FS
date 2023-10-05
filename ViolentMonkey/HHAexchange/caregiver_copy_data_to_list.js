try {
    function dataForXLS() {
      const tab = '	'; // String.fromCharCode(9)
      const caregiverCode = $('#uxLblPAideCode').text();
      const name = $('#ctl00_ContentPlaceHolder1_uxlblInfoName').text();
      const hireDate = $('#lblHireDate').text();
      const type = $('#uxLblEmploymentType').text();
      const lastWorkDate = $('#lblLastWorkDate').text();
      const lang = $('#ctl00_ContentPlaceHolder1_lblLangauges').text();

      return `${caregiverCode}	${name}	${hireDate}	${type}		${lastWorkDate}		${lang}`;
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