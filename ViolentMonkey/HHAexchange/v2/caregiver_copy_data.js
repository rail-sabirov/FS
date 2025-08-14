// Check if function exists before declaring
if (typeof copyTextToClipboard !== 'function') {
    function copyTextToClipboard(text) {
        navigator.clipboard.writeText(text);
    }
}

// Copy Caregiver Data for FS-Archive - Create a new Caregiver
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

