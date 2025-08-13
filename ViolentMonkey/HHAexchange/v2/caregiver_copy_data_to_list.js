// Add button
const div = document.createElement('div');
div.className = 'fs-button-xls';
div.title = 'Copy for FS-Terminated-HHA-Caregivers/google/sheets';
div.textContent = 'Copy data for List';
const targetElement = document.querySelector('#caregiverProfile-label').parentNode;
targetElement.classList.add('fs-label-ci');

targetElement.style.position = 'relative';
targetElement.appendChild(div);


document.querySelector('.fs-button-xls').addEventListener('click', () => {
    const obj = dataForXLS();
    navigator.clipboard.writeText(obj);
});

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .fs-button-xls {
        display: inline-block;
        background-color: #447086;
        border-radius: 4px;
        color: white;
        font-weight: 400;
        padding: 2px 12px;
        margin: 3px;
        cursor: pointer;
        position: absolute;
        top: 0;
        left: 90px;
    }
  `;
  document.head.appendChild(style);



  function dataForXLS() {
    const tab = '	';
    const caregiverCode = document.getElementById('uxLblPAideCode').textContent;
    const firstName = document.getElementById('uxLblPFirstName').textContent;
    const lastName = document.getElementById('uxLblPLastName').textContent;
    const dob = document.getElementById('ctl00_ContentPlaceHolder1_uxlblInfoDOB').textContent;
    const type = document.getElementById('uxLblEmploymentType').textContent;
    const hireDate = document.getElementById('lblHireDate').textContent;
    const lastWorkDate = document.getElementById('lblLastWorkDate').textContent;
    const LastDate = document.getElementById('uxLblDtTerminated').textContent;
    return `${caregiverCode}${tab}${firstName}${tab}${lastName}${tab}${dob}${tab}${type}${tab}${hireDate}${tab}${lastWorkDate}${tab}${LastDate}`;
}