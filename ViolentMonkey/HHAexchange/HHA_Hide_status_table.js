(function() {
  'use strict';

    const div = document.getElementById('fs-divType');
    const label = document.createElement('label');
    label.className = 'switch';

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = 'toggleSwitch';

    // Проверяем localStorage при загрузке
    const savedUrl = localStorage.getItem('fs-hide-table');
    if (savedUrl === true) {
        input.checked = true;
        div.classList.add('fs-half-hide');
    }

    input.addEventListener('click', () => {
        div.classList.toggle('fs-half-hide');
        if (input.checked) {
            localStorage.setItem('fs-hide-table', true);
        } else {
            localStorage.removeItem('fs-hide-table');
        }
    });

    const span = document.createElement('span');
    span.className = 'slider round';

    // Собираем переключатель
    label.appendChild(input);
    label.appendChild(span);
    document.getElementById('fs-divType').prepend(label);

  GM_addStyle(`
     div#fs-divType.fs-half-hide {
       position: relative !important;
       height: 110px !important;
        overflow: hidden;
     }
    /* div - Table styles */
     div#fs-divType.fs-half-hide::after {
        display: block;
        position: absolute;
        background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 100%) !important;
        height: 50px;
        width: 100%;
        z-index: 1;
        content: '';
        bottom: 0;
    }

    /* The switch - the box around the slider */
    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 20px;
    }

    /* Hide default HTML checkbox */
    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    /* The slider */
    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      -webkit-transition: .4s;
      transition: .4s;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 14px;
      width: 14px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      -webkit-transition: .4s;
      transition: .4s;
    }

    input:checked + .slider {
      background-color: #2196F3;
    }

    input:focus + .slider {
      box-shadow: 0 0 1px #2196F3;
    }

    input:checked + .slider:before {
      -webkit-transform: translateX(26px);
      -ms-transform: translateX(26px);
      transform: translateX(26px);
    }

    /* Rounded sliders */
    .slider.round {
      border-radius: 34px;
    }

    .slider.round:before {
      border-radius: 50%;
    }

    #fs-divType label.switch {
        margin: 10px;
    }
    #fs-divType label.switch::after {
        content: 'Hide / show table';
        display: block;
        position: relative;
        left: 60px;
        font-size: 12px;
        bottom: 3px;
        width: 200px;
    }
  `);
})();