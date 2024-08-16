// HHAexchange - Full Text Search
const fsKeepedFocusTitle = '📌 Keeped focus';
const fsSearchTabName = 'fs-search-tab';
const fsFullTextSearchTabName = 'fs-full-text-search-tab';

const fsFullTextSearchBlockName = 'fs-full-text-search';
const fsCaregiverSearchTableBlockName = 'fs-caregiver-search-table';

// For localStorage
const lsSelectedKeyName = 'fs-selected-tabs-caregiver-search'; // текущий тип поиска
const lsCaregiverSearchFocus = 'fs-caregiver-search-focus'; // для фокусировки

// Доступные элементы для фокуса на странице поиска
const availableElements = {
        'ctl00_ContentPlaceHolder1_uxtxtSSN': {
            labelId: 'ctl00_ContentPlaceHolder1_uxlblSSN'
        },
        'ctl00_ContentPlaceHolder1_uxtxtAideCode': {
            labelId: 'ctl00_ContentPlaceHolder1_uxLblAideCode'
        },
        'ctl00_ContentPlaceHolder1_uxtxtDOB': {
            labelId: 'ctl00_ContentPlaceHolder1_lblHDOB'
        },
        'ctl00_ContentPlaceHolder1_uxtxtPhoneNumber': {
            labelId: 'ctl00_ContentPlaceHolder1_Label4'
        },
        'ctl00_ContentPlaceHolder1_uxTxtAltAideCode': {
            labelId: 'ctl00_ContentPlaceHolder1_uxLblAltAideCode'
        },
        'ctl00_ContentPlaceHolder1_uxtxtFirstName': {
            labelId: 'ctl00_ContentPlaceHolder1_Label2'
        },
        'ctl00_ContentPlaceHolder1_uxtxtLastName': {
            labelId: 'ctl00_ContentPlaceHolder1_Label1'
        },
    };



try {
  // Скрываем обычный поиск
  document.querySelector('#ctl00_UpdatePanel1 > table').style.display='none';

  // Выводим форму ввода поисковой строки
  showSearchBlock();
  showSearchTabs();
  onClickByTabs();
  sendByEnterInDateField();

  // Focus, F2 - keep focus in localStorage
  fsKeepFocusForCurrentSearchField(availableElements, lsCaregiverSearchFocus);

  //Получаем последнее значение из LocalStorage
  if (selectedTabLs = localStorage.getItem(lsSelectedKeyName)) {
    switchTabsBlocks(selectedTabLs);
  } else {
    switchTabsBlocks(fsSearchTabName);
  }


  const inputField = document.getElementById('fs-full-text-query');

  inputField.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      event.preventDefault();

      const inputValue = inputField.value;

      searchQuery(inputValue);
    }

    if (event.key === 'Escape') {
        if (inputField && inputField.style.display !== 'none') {
            inputField.value = '';

            // Удаляем результат поиска
            document.getElementById('fs-full-text-result').remove();
        }
    }
  });

  const searchButton = document.getElementById('fs-full-text-query-button');
  searchButton.addEventListener('click', function(event) {

      event.preventDefault();

      const inputValue = inputField.value;

      searchQuery(inputValue);

  });
} catch {}

// === Functions ===
function showSearchBlock() {
  const updatePanel = document.getElementById('ctl00_UpdatePanel1');
  const newDiv = document.createElement('div');
  newDiv.id = "fs-full-text-search";

  newDiv.innerHTML = `
    <div class="header">Caregiver: Full Text Search</div>
    <div class="search-box">
      <div class="search-box-title"><span>Search by:</span> First Name; Last Name; Caregiver Code; Assignment Id (PIN); SSN (xxx-xx-xxxx)</div>
      <input name="fs-full-text-query" type="text" id="fs-full-text-query">
      <button type="button" id="fs-full-text-query-button">Search</button>
    </div>
  `;

  updatePanel.insertBefore(newDiv, updatePanel.firstChild);

  // Скрываем форму, при выводе
  newDiv.style.display='none';

  // Задаем Id для таблицы, чтобы потом можно было скрыть при переключении закладок
  let table = document.querySelector('#fs-full-text-search + table');
  table.id="fs-caregiver-search-table";
}

function showSearchTabs() {
  const updatePanel = document.getElementById('ctl00_UpdatePanel1');
  const newDiv = document.createElement('div');

  newDiv.id = "fs-search-tabs";
  newDiv.innerHTML = `
    <div id="fs-search-tab" class="fs-search-tab-item fs-selected">Search<div class="balloon"></div></div>
    <div id="fs-full-text-search-tab" class="fs-search-tab-item">Full Search<div class="balloon"></div></div>
  `;

  updatePanel.insertBefore(newDiv, updatePanel.firstChild);
}

function onClickByTabs() {
  /* Отрабаываем клики.
   *   Использовать после двух функции, они создают используемые блоки
   *   showSearchBlock();
   *   showSearchTabs();
   */
  const fsFullTextSearchTab = document.getElementById(fsFullTextSearchTabName);
  fsFullTextSearchTab.addEventListener('click', () => {
      switchTabsBlocks(fsFullTextSearchTabName);
  });

  const fsSearchTab = document.getElementById(fsSearchTabName);
  fsSearchTab.addEventListener('click', () => {
    switchTabsBlocks(fsSearchTabName);
  });
}


/*
 * Switch tab block after click in by tab
 * availiable tabs name: fs-search-tab | fs-full-text-search-tab
 * */
function switchTabsBlocks(tabName=fsSearchTabName) {
  let selectedTab = '';
  const fsFullTextSearchTab = document.getElementById(fsFullTextSearchTabName);
  const fsFullTextSearchBlock = document.getElementById(fsFullTextSearchBlockName);

  const fsSearchTab = document.getElementById(fsSearchTabName);
  const fsSearchBlock = document.getElementById(fsCaregiverSearchTableBlockName);
  const selectedClassName = 'fs-selected';

  if (tabName == fsSearchTabName) {
    fsFullTextSearchBlock.style.display = 'none';
    fsSearchBlock.style.display = 'table';

    fsFullTextSearchTab.classList.remove(selectedClassName);
    fsSearchTab.classList.add(selectedClassName);

    // set Focus by lastName input field
    //document.getElementById('ctl00_ContentPlaceHolder1_uxtxtLastName').focus();
    try {
      fsSetSearchFocus(lsCaregiverSearchFocus, availableElements, lsCaregiverSearchFocus);
    } catch(e) {
      console.error(e);
      alert('error;')
    }
  }

  if (tabName == fsFullTextSearchTabName) {
    fsFullTextSearchBlock.style.display = 'block';
    fsSearchBlock.style.display = 'none';

    fsFullTextSearchTab.classList.add(selectedClassName);
    fsSearchTab.classList.remove(selectedClassName);

    // set Focus on input field
    document.getElementById('fs-full-text-query').focus();

  }

  // Сохраним выбранную закладку
  localStorage.setItem(lsSelectedKeyName, tabName);
}

function convertData(data) {
    const regex = /(?<fio>[\w\s\.\,\'\"\-\;\:\@\(\)]+)\s\((?<caregiverCode>FSH-\d{1,8}),*(?<AssignmentId>\d{4,8})\)\s{0,3}(?<ssn>\d{3}-\d{2}-\d{4})?/gm;
    let m;

    while ((m = regex.exec(data)) !== null) {
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }

        return m.groups;
    }
}

function showResultTable(htmlElements='<div class="fs-full-text-didnt-find">We didnt find anything.</div>') {
  const container = document.getElementById(fsFullTextSearchBlockName);
  const newDivIdName = 'fs-full-text-result';

  // Проверяем, существует ли уже элемент с определенным id или классом
  const existingElement = container.querySelector(`#${newDivIdName}`);



  // Если элемент еще не существует, создаем и добавляем его
  if (existingElement) {
    existingElement.remove();
  }

  const newDiv = document.createElement('div');

  newDiv.id = `${newDivIdName}`;
  newDiv.innerHTML = htmlElements;

  // Добавляем новый элемент в конец контейнера
  container.appendChild(newDiv);
  //}
}

function searchQuery(queryString) {
  const entKey = window.location.pathname.split('/')[1];
  const url = `https://app.hhaexchange.com/${entKey}/Autosuggest.asmx/AutoSuggestCaregivers`;
  let out = '';
  let rows = 0;

  fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', // Указываем тип содержимого
      },
      body: JSON.stringify({
          prefixText: queryString,
          count: 500,
          contextKey: 363
      })
  })
  .then(response => response.json()) // Преобразуем ответ в JSON
  .then(data => {
      data.d.forEach(str => {
          const aid = JSON.parse(str);
          const data = convertData(aid.First);
          const caregiver = {...data, url: `https://app.hhaexchange.com/${entKey}/Aide/Aide.aspx?AideId=${aid.Second}`};


          let txtFio = includeWords(queryString, caregiver.fio);
          let txtCaregiverCode = includeWords(queryString, caregiver.caregiverCode);
          let txtAssignmentId = includeWords(queryString, caregiver.AssignmentId);
          let txtSsn = includeWords(queryString, caregiver.ssn);

        rows++;
        out += `<tr>
                <td>${rows}</td>
                <td><a href="${caregiver.url}">${txtFio ?? '--'}</a></td>
                <td><a href="${caregiver.url}">${txtCaregiverCode ?? '--'}</a></td>
                <td><a href="${caregiver.url}">${txtAssignmentId ?? '--'}</a></td>
                <td><a href="${caregiver.url}">${txtSsn ?? '--'}</a></td>
            </tr>`;

      });

    showResultTable(`<table>
        <thead>
            <tr>
                <th>#</th>
                <th>Name</th>
                <th>Caregiver Code</th>
                <th>Assignment ID (PIN)</th>
                <th>SSN</th>
            </tr>
        </thead>
        <tbody>${out}</tbody>
        <tfoot><tr><td colspan=5>Found ${rows} caregivers</td></tr></tfoot>
    </table>`);

  }) // Обрабатываем данные
  .catch(error => console.error('Error:', error)); // Обрабатываем ошибки
}

// Для выделения искомого слова в тексте
function includeWords(searchWords, text) {
  const words = searchWords.split(" ");

  // Создаем регулярное выражение для поиска каждого слова
  //const regex = new RegExp(`\\b(${words.join("|")})\\b`, "gi");
  const regex = new RegExp(`(${words.join("|")})`, "gi");

  // Заменяем каждое найденное слово тегом <span>
  const highlightedText = text.replace(regex, "<span>$1</span>");

  return highlightedText;
}

// Событие на Enter в поле data при поиске Caregiver
function sendByEnterInDateField() {
  const dobField = document.getElementById('ctl00_ContentPlaceHolder1_uxtxtDOB');
  dobField.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
        event.preventDefault();

        const searchBtn = document.getElementById('ctl00_ContentPlaceHolder1_uxbtnSearch');
          if (searchBtn) {
              searchBtn.click();
          }
      }
  });
}

// Focus: Сохранение фокуса в поле при нажатии на кнопку F2, для следующего использования
function fsKeepFocusForCurrentSearchField(availableElements, lsCaregiverSearchFocus) {
    // F2 - будет работать в обычном поиске
    const searchTable = document.getElementById('fs-caregiver-search-table');
    searchTable.addEventListener('keydown', function(event) {
        if (event.key === 'F2') {
          event.preventDefault();

          const activeElement = document.activeElement;
            if (availableElements[activeElement.id]) {
                const oldFocus = localStorage.getItem(lsCaregiverSearchFocus);
                const label = availableElements[activeElement.id].labelId;

                if (oldFocus) {
                    const oldLabel = availableElements[oldFocus].labelId;
                    const fsElementLabel = document.getElementById(oldLabel)

                    fsElementLabel.classList.remove(lsCaregiverSearchFocus);
                    fsElementLabel.removeAttribute('title');
                }

                localStorage.setItem(lsCaregiverSearchFocus, activeElement.id);
                const fsElementLabelNew = document.getElementById(label);
                fsElementLabelNew.classList.add(lsCaregiverSearchFocus);
                fsElementLabelNew.setAttribute('title', fsKeepedFocusTitle);
            }
        }
      });
}

// Focus: Установка фокуса при открытии страницы
function fsSetSearchFocus(lsCaregiverSearchFocus, availableElements, lsCaregiverSearchFocus) {
    const elementId = localStorage.getItem(lsCaregiverSearchFocus);

    if(elementId && availableElements[elementId]) {
        const labelId = availableElements[elementId].labelId;
        const fsElementLabelKeeped = document.getElementById(labelId);
        fsElementLabelKeeped.classList.add(lsCaregiverSearchFocus);
        fsElementLabelKeeped.setAttribute('title', fsKeepedFocusTitle);
      setTimeout(()=>{
        document.getElementById(elementId).focus();
      }, 200);
    }
}




// === Styles ===
GM_addStyle(`
  #fs-search-tabs {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-content: flex-start;
    align-items: flex-start;
    border-bottom: 2px solid #cbcbcb;

    .fs-search-tab-item {
      font-size: 14px;
      border: 2px solid #cbcbcb;
      border-bottom: none;
      padding: 5px 20px 5px 20px;
      border-radius: 8px 8px 0 0;
      margin: 10px 10px 0px 0px;
      position: relative;
      cursor: pointer;

      &:first-child {
        margin-left: 20px !important;
      }

      &.fs-selected {
        background: linear-gradient(0deg, rgba(234, 234, 234, 1) 0%, rgba(240, 240, 240, 1) 40%, rgba(255, 255, 255, 1) 100%);
        font-weight: bold;

        .balloon {
          position: absolute;
          z-index: 8;
          background-color: #eaeaea;
          width: calc(100% + 14px);
          left: -8px;
          height: 8px;
        }

        &:after {
          content: '';
          position: absolute;
          width: 10px;
          aspect-ratio: 1;
          border: none;
          right: -12px;
          bottom: -2px;
          z-index: 9;
          border-radius: 0 0 0 8px;
          border-left: 2px solid #cbcbcb;
          border-bottom: 2px solid #cbcbcb;
          background-color: #fff;
        }

        &:before {
          content: '';
          position: absolute;
          height: 10px;
          width: 10px;
          border: 0 dashed #eaeaea;
          left: -12px;
          bottom: -2px;
          z-index: 9;
          border-radius: 0 0 8px 0;
          border-right: 2px solid #cbcbcb;
          border-bottom: 2px solid #cbcbcb;
          background-color: #fff;
        }
      }
    }

    div#fs-search-tab {
      display: block;
    }

    div#fs-full-text-search-tab {
      display: block;
    }
  }

  #fs-full-text-search {
      div.header {
          background-color: #eaeaea;
          font-size: 12px;
          color: #254679;
          font-family: Verdana, Arial, Helvetica, sans-serif;
          text-decoration: none;
          font-weight: bold;
          padding: 5px 5px 5px 16px;
      }

      div.search-box {
          margin: 10px;
          border: 2px solid #d5dbe9;
          padding: 10px;
          font-size: 12px;
          display: flex;
          flex-direction: column;
          flex-wrap: nowrap;

        span {
          font-weight: bold;
        }

        #fs-full-text-query {
            margin-top: 10px;
            font-size: 20px;
            border-radius: 6px;
            border: 1px solid #b9b9b9;
            padding: 5px 10px;
            box-sizing: border-box;
        }

        button {
          background-color: #265a76;
          border: none;
          margin-top: 15px;
          color: white;
          font-weight: bold;
          padding: 8px 10px;
          border-radius: 4px;
          width: 10%;
          min-width: 180px;
        }
      }
  }

/* result table */

  div#fs-full-text-result {
    padding: 10px;
    padding-bottom: 20px;

      table {
        width: 100%;
        border-spacing: 0px;

        thead {
            background-color: #d5dbe9;
            font-size: 12px;

            th {
                text-align: left;
                padding: 5px 5px 5px 10px;
                border-bottom: 2px solid #a2a9bb;
            }
        }

        tbody {
          tr {
            &:hover td {
                background-color: #becff57d;
                border-top: 1px solid #b9ceffc7;
                border-bottom: 1px solid #b9ceff;
            }

            &:nth-child(even) {
                background-color: #d5dbe95c;
            }
            td {
                font-size: 12px;
                padding: 3px 3px 3px 10px;
                cursor: pointer;
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;
                border-bottom: 1px dotted #e3e3e3 !important;
                border-left: 1px dotted #e3e3e3 !important;

              span {
                  background-color: #FFEB3B;
              }

              &:first-child {
                width: 30px;
                text-align: center;
              }

              a {
                font-size: 12px;
              }
            }
          }

        }

        tfoot {
          tr {
            td {
              border-top: 4px solid #a2a9bb;
              background-color: #d5dbe9;
              font-size: 13px;
              padding: 5px 10px;
            }
          }
        }
    }
  }

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