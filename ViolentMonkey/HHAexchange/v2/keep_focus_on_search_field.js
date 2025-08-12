// HHAexchange - Keep Focus on Search Field
const fsKeepedFocusTitle = '📌 Keeped focus';
const fsSearchTabName = 'fs-search-tab';
const fsFullTextSearchTabName = 'fs-full-text-search-tab';
const searchFormSelector = '#TABLE1 .card.hhax-card';

const fsFullTextSearchBlockName = 'fs-full-text-search';
const fsCaregiverSearchTableBlockName = 'fs-caregiver-search-table';

// For localStorage
const lsSelectedKeyName = 'fs-selected-tabs-caregiver-search'; // Ключ для хранения выбранной вкладки в localStorage
const lsCaregiverSearchFocus = 'fs-caregiver-search-focus'; // Ключ для фокусировки

// Доступные элементы для фокуса на странице поиска
const availableElements = {
        'ctl00_ContentPlaceHolder1_uxtxtSSN': {
            labelId: 'ctl00_ContentPlaceHolder1_uxlblSSN',
            labelClass: '.ctl00_ContentPlaceHolder1_uxtxtSSN_label'
        },
        'ctl00_ContentPlaceHolder1_uxtxtAideCode': {
            labelId: 'ctl00_ContentPlaceHolder1_uxLblAideCode',
            labelClass: '.ctl00_ContentPlaceHolder1_uxtxtAideCode_label'
        },
        'ctl00_ContentPlaceHolder1_uxtxtDOB': {
            labelId: 'ctl00_ContentPlaceHolder1_lblHDOB',
            labelClass: '.ctl00_ContentPlaceHolder1_uxtxtDOB_label'
        },
        'ctl00_ContentPlaceHolder1_uxtxtPhoneNumber': {
            labelId: 'ctl00_ContentPlaceHolder1_Label4',
            labelClass: '.ctl00_ContentPlaceHolder1_uxtxtPhoneNumber_label'
        },
        'ctl00_ContentPlaceHolder1_uxTxtAltAideCode': {
            labelId: 'ctl00_ContentPlaceHolder1_uxLblAltAideCode',
            labelClass: '.ctl00_ContentPlaceHolder1_uxTxtAltAideCode_label'
        },
        'ctl00_ContentPlaceHolder1_uxtxtFirstName': {
            labelId: 'ctl00_ContentPlaceHolder1_Label2',
            labelClass: '.ctl00_ContentPlaceHolder1_uxtxtFirstName_label'
        },
        'ctl00_ContentPlaceHolder1_uxtxtLastName': {
            labelId: 'ctl00_ContentPlaceHolder1_Label1',
            labelClass: '.ctl00_ContentPlaceHolder1_uxtxtLastName_label'
        },
    };

// Add Class to label
initLabels();

// Focus, F2 - keep focus in localStorage
fsKeepFocusForCurrentSearchField(availableElements, lsCaregiverSearchFocus, searchFormSelector);

// Set Focus on the Field
fsSetSearchFocus(lsCaregiverSearchFocus, availableElements);

// Focus: Сохранение фокуса в поле при нажатии на кнопку F2, для следующего использования
function fsKeepFocusForCurrentSearchField(availableElements, lsCaregiverSearchFocus, searchFormSelector) {
    // F2 - будет работать в обычном поиске
    const searchTable = document.querySelector(searchFormSelector);
    searchTable.addEventListener('keydown', function(event) {
        if (event.key === 'F2') {
          event.preventDefault();

          const activeElement = document.activeElement;
            if (availableElements[activeElement.id]) {
                const oldFocus = localStorage.getItem(lsCaregiverSearchFocus);
                const label = availableElements[activeElement.id].labelClass;

                if (oldFocus) {
                    const oldLabel = availableElements[oldFocus].labelClass;
                    //const fsElementLabel = document.getElementById(oldLabel)
                    const fsElementLabel = document.querySelector(oldLabel);

                    try {
                        fsElementLabel.classList.remove(lsCaregiverSearchFocus);
                        fsElementLabel.removeAttribute('title');
                    } catch {}
                }

                localStorage.setItem(lsCaregiverSearchFocus, activeElement.id);

                const fsElementLabelNew = document.querySelector(label);
                fsElementLabelNew.classList.add(lsCaregiverSearchFocus);
                fsElementLabelNew.setAttribute('title', fsKeepedFocusTitle);
            }
        }
      });
}

// Focus: Установка фокуса при открытии страницы
function fsSetSearchFocus(lsCaregiverSearchFocus, availableElements) {
    const elementId = localStorage.getItem(lsCaregiverSearchFocus);

    if(elementId && availableElements[elementId]) {
        const labelClass = availableElements[elementId].labelClass;
        const fsElementLabelKeeped = document.querySelector(labelClass);

        try {
            fsElementLabelKeeped.classList.add(lsCaregiverSearchFocus);
            fsElementLabelKeeped.setAttribute('title', fsKeepedFocusTitle);
        } catch {}

      setTimeout(()=>{
        document.getElementById(elementId).focus();
      }, 200);
    }
}

function initLabels() {
    document.querySelectorAll('#TABLE1 .card.hhax-card input').forEach((element, index) => {
        const elName = element.name;
        const types = ['text', 'date'];
        const id = element.id;
        const label = element.closest('label');

        if(elName && types.includes(element.type)) {
            label.classList.add(`${id}_label`);
        }
    });
}


// === Styles ===
GM_addStyle(`
  /* Focus: styles */
  #ctl00_uxLblPageTitle:after {
      content: '(F2) Keep focus on current field';
      margin-left: 15px;
      border: 1px solid #00000050;
      border-radius: 3px;
      padding: 2px 4px;
      font-size: 80%;
      text-transform: uppercase;
      font-weight: 400;
      color: #00000070;
  }

  .fs-caregiver-search-focus:before {
      content: '📌';
      position: relative;
      margin-right: 5px;
  }

  /* Уровень 9 для затемнения фона при выводе ошибки, чтобы скрыть "верстку" */
  .modal-dialog-bg {
      z-index: 9;
  }

`);