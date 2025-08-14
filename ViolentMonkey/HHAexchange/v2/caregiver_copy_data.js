function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text);
}

/* --- Function for copy to clipboard - Set by tag Click event for copy to clipboard ---*/
function copyElementData(elementSelector, callback, title = '', addClass = 'fs-hover-red-border') {
    try {
        document.addEventListener('DOMContentLoaded', () => {
            const elements = document.querySelectorAll(elementSelector);
            
            elements.forEach(element => {
                element.classList.add(addClass);
                element.setAttribute('title', title);
                element.addEventListener('click', (ev) => {
                    copyTextToClipboard(callback(ev));
                });
            });
        });
    } catch {}
}


try {
    const hdrDemographics = document.getElementById('hdrDemographics');
    if (hdrDemographics) {
        hdrDemographics.addEventListener('click', () => {
            const getElementText = (id) => {
                const element = document.getElementById(id);
                return element ? element.textContent || element.innerText : '';
            };
            
            const getElementValue = (id) => {
                const element = document.getElementById(id);
                return element ? element.value : '';
            };
            
            const fsProfileData = {
                'firstName': getElementText('uxLblPFirstName'),
                'lastName': getElementText('uxLblPLastName'),
                'middleName': getElementText('uxLblPMiddleName'),
                'gender': getElementText('uxLblPGender'),
                'caregiverCode': getElementText('uxLblPAideCode'),
                'dob': getElementText('uxLblPDOB'),
                'discipline': getElementText('uxLblEmploymentType').replaceAll(' ', '').split(','),
                'ssn': getElementText('uxLblPSSN').replaceAll('-', ''),
                'martial': getElementText('lblMaritalStatus'),
                'languages': getElementText('ctl00_ContentPlaceHolder1_lblLangauges').replaceAll('<br>', ''),
                'email': getElementText('uxlblNotificationEmail'),
                'homePhone': getElementText('uxLblAE1Phone1'),
                'cellPhone': getElementText('uxlblNotificationTextNumber'),
                'address1': getElementText('uxLblPStreet1'),
                'address2': getElementText('uxLblPStreet2'),
                'city': getElementText('uxLblPCity'),
                'state': getElementText('uxLblPState'),
                'zip': getElementText('uxLblPZipCode'),

                'hireDate': getElementText('lblHireDate').trim() || '',
                'rehireDate': getElementText('uxlblRehireDate').trim() || '',
                'status': getElementText('ctl00_ContentPlaceHolder1_uxLblAideStatus'),
                'terminationDate': getElementValue('uxTxtDtTerminated')
            };

            copyTextToClipboard(JSON.stringify(fsProfileData));
        });
    }


    /* --- Copy caregiver code --- */
    copyElementData('#uxLblPAideCode, #ctl00_ContentPlaceHolder1_uxlblInfoAideInitials',
        data => data
            .target
            .innerText
            .trim(),
        'Copy caregiver code');

    /* --- Copy SSN onClick event --- */
    const ssnElement = document.getElementById('uxLblPSSN');
    if (ssnElement) {
        ssnElement.addEventListener('click', (el) => {
            const ssn = el.target.textContent.replaceAll('-', '');
            copyTextToClipboard(ssn);
        });
    }
} catch {}    

// Create and inject custom styles for button
const styleElement = document.createElement('style');
styleElement.textContent = `
  #hdrDemographics::after {
    content: 'Copy Caregiver Data For FS-Archive';
    position: relative;
    margin-left: 20px;
    padding: 2px 8px 4px;
    border-radius: 5px;
    line-height: 20px;
    font-size: 80%;
    background: #4CAF50;
    color: white;
    cursor: pointer;
  }
  
  #hdrDemographics::after:hover {
    background: #45a049;
  }
`;
document.head.appendChild(styleElement);

