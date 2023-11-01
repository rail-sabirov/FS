try {
  $('#ctl00_ContentPlaceHolder1_S1_InternalPatientProfileIFrame').on('click', ()=>{
    setTimeout(function() {
        Array.prototype.getElementsDataFormat = function() {
            return `${this[2]}-${this[0]}-${this[1]}`;
        }

        const obj = {};
        let out = '';
        let iframe = $('#frmRightSide');
        let iframeDoc = iframe.contents();

        // get patient data
        iframe = $('#frmRightSide');
        iframeDoc = iframe.contents();

        obj.firstName = iframeDoc.find('td.tdbold:contains("First Name") + td > span').text();
        obj.lastName = iframeDoc.find('td.tdbold:contains("Last Name") + td > span').text();
        obj.coordinatorName = $('td.tdbold:contains("Coordinator") + td > span').text();
        obj.nurse = iframeDoc.find('td.tdbold:contains("Nurse") + td > span').text().trim();
        obj.startDate = iframeDoc.find('td.tdbold:contains("Start Date") + td > span').text(); //.split('/').getElementsDataFormat();
        obj.dob = $('td.tdbold:contains("DOB") + td > span').text(); //.split('/').getElementsDataFormat();

        obj.homePhone1 = iframeDoc.find('#leftPhLocTr2').prev().find('td:nth-child(2)').text().trim();
        obj.homePhone2 = iframeDoc.find('#leftPh2LocTr2').prev().find('td:nth-child(2)').text().trim();
        obj.homePhone3 = iframeDoc.find('#leftPh3Tr').prev().find('td:nth-child(2)').text().trim();

        obj.homePhones = [obj.homePhone1, obj.homePhone2, obj.homePhone3].reduce((acc, el) => {
          let len = acc.length;
          let additional = el;

          if (el.length > 0) {
              if (len) {
                  additional = ', ' + el;
              }
          }

          return acc + additional;
      });

        // patient id
        const medicaidNumber = iframeDoc.find('td.tdbold:contains("Medicaid Number") + td > span').text()

        if (medicaidNumber.length > 0 && medicaidNumber !== '') {
            obj.patientId = medicaidNumber
        } else {
            obj.patientId = $('#ctl00_ContentPlaceHolder1_PatientInfo1_uxLblPatientNumber').text();
        }

        out = `${obj['patientId']}	${obj['firstName']}	${obj['lastName']}	${obj['dob']}	${obj['nurse']}	${obj['startDate']}	${obj['coordinatorName']}	${obj['homePhones']}`;


        $('<button>Copy Patient data to XLS</button>')
          .addClass('fs-copy-patient-to-xls')
          .click(() => { navigator.clipboard.writeText(out); })
          .css({
            'background-color': '#4caf50',
            'color': 'white',
            'border': '1px solid #46a34a',
            'border-radius': '3px',
            'padding': '2px 10px',
            'margin': '3px 10px',
            'cursor': 'pointer'
          })
          .insertBefore(iframeDoc.find('#uxPatientProfile_uxLblPMessage'))
    }, 1000)
});

} catch {}