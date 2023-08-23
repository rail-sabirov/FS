try {
  $('#ctl00_ContentPlaceHolder1_S1_InternalPatientProfileIFrame').on('click', ()=>{
    setTimeout(function() {
        Array.prototype.getElementsDataFormat = function() {
            return `${this[2]}-${this[0]}-${this[1]}`;
        }

        const obj = {};
        let iframe = $('#frmRightSide');
        let iframeDoc = iframe.contents();

        // get patient data
        iframe = $('#frmRightSide');
        iframeDoc = iframe.contents();

        obj.firstName = iframeDoc.find('td.tdbold:contains("First Name") + td > span').text();
        obj.lastName = iframeDoc.find('td.tdbold:contains("Last Name") + td > span').text();
        obj.sex = iframeDoc.find('td.tdbold:contains("Gender") + td > span').text();
        obj.status = $('#ctl00_ContentPlaceHolder1_PatientInfo1_uxLblPatientStatus').text();
        obj.coordinatorName = $('td.tdbold:contains("Coordinator") + td > span').text();
        obj.contractName = $('td.tdbold:contains("Contract") + td > span').text();
        obj.discipline = iframeDoc.find('td.tdbold:contains("Accepted Services") + td > span').text();
        obj.nurse = iframeDoc.find('td.tdbold:contains("Nurse") + td > span').text().trim();
        obj.startDate = iframeDoc.find('td.tdbold:contains("Start Date") + td > span').text().split('/').getElementsDataFormat();
        obj.dob = $('td.tdbold:contains("DOB") + td > span').text().split('/').getElementsDataFormat();
        obj.office = $('#ctl00_ContentPlaceHolder1_PatientInfo1_uxlblOfficeName').text();
        obj.homePhone1 = iframeDoc.find('#leftPhLocTr2').prev().find('td:nth-child(2)').text();
        obj.homePhone2 = iframeDoc.find('#leftPh2LocTr2').prev().find('td:nth-child(2)').text();
        obj.homePhone3 = iframeDoc.find('#leftPh3Tr').prev().find('td:nth-child(2)').text();

        // patient id
        const medicaidNumber = iframeDoc.find('td.tdbold:contains("Medicaid Number") + td > span').text()

        if (medicaidNumber.length > 0 && medicaidNumber !== '') {
            obj.patientId = medicaidNumber
        } else {
            obj.patientId = $('#ctl00_ContentPlaceHolder1_PatientInfo1_uxLblPatientNumber').text();
        }

        // Address
        if (!!iframeDoc.find('#tblPatientAddresses')) {
            const addressTd = iframeDoc.find('#tblPatientAddresses > tbody > tr:nth-child(2) > td');
            if (addressTd.length > 0) {
                obj.address1 = $(addressTd).eq(0).text();
                obj.address2 = $(addressTd).eq(1).text();
                obj.city = $(addressTd).eq(2).text();
                obj.state = $(addressTd).eq(3).text();
                obj.county = $(addressTd).eq(4).text();
                obj.zipCode = $(addressTd).eq(5).text();
            }
        }

        //console.log(obj)

        $('<button>Copy Patient data to Clipboard</button>')
          .addClass('fs-copy-patient-to-clipboard')
          .click(() => {
                navigator.clipboard.writeText(JSON.stringify(obj));
          })
          .css({
            'background-color': '#03A9F4',
            'color': 'white',
            'border': '1px solid #2196F3',
            'border-radius': '3px',
            'padding': '2px 10px',
            'margin': '3px 10px',
            'cursor': 'pointer'
          })
          .insertBefore(iframeDoc.find('#uxPatientProfile_uxLblPMessage'))
    }, 1000)
}
);

} catch {}