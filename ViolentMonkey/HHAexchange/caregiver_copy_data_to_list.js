try {
    function dataForXLS() {
      const tab = '	';
      const caregiverCode = $('#uxLblPAideCode').text();
      const firstName = $('#uxLblPFirstName').text();
      const lastName = $('#uxLblPLastName').text();
      const dob = $('#ctl00_ContentPlaceHolder1_uxlblInfoDOB').text();
      const type = $('#uxLblEmploymentType').text();
      const hireDate = $('#lblHireDate').text();
      const lastWorkDate = $('#lblLastWorkDate').text();
      const LastDate = $('#uxLblDtTerminated').text();

      return `${caregiverCode}${tab}${firstName}${tab}${lastName}${tab}${dob}${tab}${type}${tab}${hireDate}${tab}${lastWorkDate}${tab}${LastDate}`;
  }

  // Add button
  $('<div class="fs-button-xls" title="Copy for FS-Terminated-HHA-Caregivers/google/sheets">Copy data for List</div>').insertBefore($('#uxLblMessage'));

  $('.fs-button-xls').on('click', () => {
    const obj = dataForXLS();

    navigator.clipboard.writeText(obj);
    //alert('Caregiver Data is Copied!');
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