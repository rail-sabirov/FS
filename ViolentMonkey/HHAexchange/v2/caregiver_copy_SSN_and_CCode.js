/*** Functions ******/
// Check if function exists before declaring
if (typeof copyTextToClipboard !== 'function') {
    function copyTextToClipboard(text) {
        navigator.clipboard.writeText(text);
    }
}
/* --- Function for copy to clipboard - Set by tag Click event for copy to clipboard ---*/
if (typeof copyElementData !== 'function') {
    function copyElementData(elementSelector, callback, title = '', addClass = 'fs-hover-red-border') {
        try {
                const elements = document.querySelectorAll(elementSelector);

                elements.forEach(element => {
                    element.classList.add(addClass);
                    element.setAttribute('title', title);
                    element.addEventListener('click', (ev) => {
                        copyTextToClipboard(callback(ev));
                    });
                });
        } catch {}
    }
} 
 
 /* --- Copy SSN onClick event --- */
copyElementData(
    '#uxLblPSSN',
    data => data.target.textContent.replaceAll('-', ''),
    'Copy Caregiver SSN'
);

/* --- Copy caregiver code --- */
copyElementData(
    '#uxLblPAideCode, #ctl00_ContentPlaceHolder1_uxlblInfoAideInitials',
    data => data.target.innerText.trim(),
    'Copy caregiver code'
);


/**** Styles ****/
// Create and inject custom styles for button
const styleElement = document.createElement('style');
styleElement.textContent = `
  .fs-hover-red-border {
    cursor: pointer;
    padding: 2px 5px 4px;
  }

  .fs-hover-red-border:hover {
    border: 1px dashed red;
    border-radius: 6px;
    }
`;
document.head.appendChild(styleElement);