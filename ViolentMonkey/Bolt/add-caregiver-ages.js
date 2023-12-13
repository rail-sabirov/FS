function getAges(dob) {
    const dobMilliseconds = new Date(dob.trim()).getTime();
    const todayMilliseconds = Date.now();

    return Math.floor((todayMilliseconds - dobMilliseconds) / 31557600000);
}

try {
    const dobValue = $("td:contains('D.O.B:')").siblings('.case_value');

    if (dobValue.length > 0) {
        const el = $("td:contains('D.O.B:')")[0];
        const dob = dobValue[0].textContent;
        const ages = getAges(dob);
        el.innerHTML = `<div class="dob-value">D.O.B:<div class="ages">${ages}</div></div>`;
    }
} catch{}

// Styles
GM_addStyle(`
  .dob-value {
    position: relative;
  }

  .ages {
    position: absolute;
    right: 0;
    top: 0;
    border-radius: 20px;
    border: none;
    width: 26px;
    text-align: center;
    color: #03A9F4;
    font-weight: bold;
  }
`);