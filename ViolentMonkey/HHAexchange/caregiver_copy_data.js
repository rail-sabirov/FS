try {
    $('#uximgPicture').on('click', () => {
      fsProfileData = {
        'firstName': $('#uxLblPFirstName').text(),
        'lastName': $('#uxLblPLastName').text(),
        'middleName': $('#uxLblPMiddleName').text(),
        'gender': $('#uxLblPGender').text(),
        'caregiverCode': $('#uxLblPAideCode').text(),
        'dob': $('#uxLblPDOB').text(),
        'discipline': $('#uxLblEmploymentType').text().replaceAll(' ', '').split(','),
        'ssn': $('#uxLblPSSN').text().replaceAll('-', ''),
        'martial': $('#lblMaritalStatus').text(),
        'languages': $('#ctl00_ContentPlaceHolder1_lblLangauges').text().replaceAll('<br>', ''),
        'email': $('#uxlblNotificationEmail').text(),
        'homePhone': $('#uxLblAE1Phone1').text(),
        'cellPhone': $('#uxlblNotificationTextNumber').text(),
        'address1': $('#uxLblPStreet1').text(),
        'address2': $('#uxLblPStreet2').text(),
        'city': $('#uxLblPCity').text(),
        'state': $('#uxLblPState').text(),
        'zip': $('#uxLblPZipCode').text(),

        'hireDate': $('#lblHireDate').text().trim() || '',
        'rehireDate': $('#uxlblRehireDate').text().trim() || '',
        'status': $('#ctl00_ContentPlaceHolder1_uxLblAideStatus').text(),
        'terminationDate': $('#uxTxtDtTerminated').val()
      };

      navigator.clipboard.writeText(JSON.stringify(fsProfileData));

      alert('Data is copied!')
    })

    /* --- Function for copy to clipboard - Set by tag Click event for copy to clipboard ---*/
    function copyElementData(elementSelector, callback, title = '', addClass = 'fs-hover-red-border') {
      try {
        $(() => {
          let data = '';

          $(elementSelector)
            .addClass(addClass)
            .attr('title', title);
          $(elementSelector)
            .on('click', (ev) => {
              copyTextToClipboard(callback(ev));
            });
        });

      } catch{}
    }


    /* --- Copy caregiver code --- */
    copyElementData('#uxLblPAideCode, #ctl00_ContentPlaceHolder1_uxlblInfoAideInitials',
      data => data
        .target
        .innerText
        .trim(),
      'Copy caregiver code');

    /* --- Copy SSN onClick event --- */

      const $ssn = $('#uxLblPSSN');

      $ssn.on('click', (el) => {
          const ssn = $(el.target).text().replaceAll('-', '');
          copyTextToClipboard(ssn);
      });
} catch {}    