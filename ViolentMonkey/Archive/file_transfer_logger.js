//const apiUrl = 'http://localhost:3002';
const apiUrl = 'http://transfer.hha.fs';
const caregiverListUrl = location.href.match(/http[s]?:\/\/fivestararchive\.com\/five_star\/web\/index.php\?r=caregiver(%2F|\/)index.*/gm);
const caregiverPersonalPage = location.href.match(
  /http[s]?:\/\/fivestararchive\.com\/five_star\/web\/index.php\?r=caregiver(%2F|\/)view&id=\d*(&folder=\d*)?/gm
);

window.onload = function () {
  const personType = new URLSearchParams(window.location.search).get('r').includes('caregiver') ? 1 : 2;
  const personIds = [];

  // --- Страница со списком Caregiver ---
  if (caregiverListUrl) {
    // Получаем список person_id по Caregiver и заполняем массив
    document.querySelectorAll('.general-table tr[data-key]').forEach((el) => {
      personIds.push(el.getAttribute('data-key'));
    });

    if (personIds.length > 0) {
      const personIdsToString = `${personIds.join(',')}`;
      const url = `${apiUrl}/get-person-files-state?personType=${personType}&personId=${personIdsToString}`;

      GM_xmlhttpRequest({
        method: 'GET',
        url: url,

        onload: function (response) {
          const apiResult = JSON.parse(response.responseText); // result: [{"person_id":25750,"sum_states":0,"total_files":1},{"person_id":25751,"sum_states":0,"total_files":11}]

          // выводим колнку в списке Caregivers
          addCaregiverListColumn(apiResult);

          // Сохраним список person_id + files в localStorage
          const objPersonIdFiles = apiResult.reduce((acc, el) => {
            acc[el.person_id] = el.total_files;
            return acc;
          }, {});

          for (let i = 0; i < personIds.length; i++) {
            if (!objPersonIdFiles[personIds[i]]) {
              objPersonIdFiles[personIds[i]] = 0;
            }
          }

          localStorage.setItem('transferPersonIds', JSON.stringify(objPersonIdFiles));
        }, // onload
      });
    } // if (personIds.length > 0)
  } // -- Caregiver listing page --

  // --- Персональная страница Caregiver - person page ---
  if (caregiverPersonalPage) {
    const caregiverId = new URLSearchParams(window.location.search).get('id');

    let fileIds = [];

    // ==== Создаем столбец в таблице с количеством файлов ====
    // получаем список закрепленных файлы на странице и заполняем массив fileIds
    document.querySelectorAll('#table tbody tr td a[data-file-id]').forEach((el) => {
      const elId = el.getAttribute('data-file-id');
      const elTr = el.closest('tr');

      elTr.setAttribute('data-id', elId);
      fileIds.push(elId);
    });

    // Получаем статус для каждого файла из БД
    const fileIdsToString = fileIds.join(',');
    const url = `${apiUrl}/get-files-state?personType=${personType}&fileId=${fileIdsToString}`;

    GM_xmlhttpRequest({
      method: 'GET',
      url: url,
      onload: function (response) {
        // result: {"90485":0,"90486":0,"90487":0,"90488":1,"90489":0,"90490":0,"90491":1,"90492":1,"90493":0,"90494":0,"90495":0}
        const apiResult = JSON.parse(response.responseText);

        // === Добавляем файлы если их нет в БД
        console.log('New files:', fileIds.length > 0, Object.keys(apiResult).length < fileIds.length);
        if (fileIds.length > 0 && Object.keys(apiResult).length < fileIds.length) {
          const objKeys = Object.keys(apiResult);
          const newFileIds = arrDifference(fileIds, objKeys);

          if (newFileIds.length > 0) {
            let fileAndStates = [];

            for (let i = 0; i < newFileIds.length; i++) {
              fileAndStates.push({ fileId: newFileIds[i], state: apiResult[newFileIds[i]] || 0 });
            }

            // POST /file-state  - save new files[newFiles]
            GM_xmlhttpRequest({
              method: 'POST',
              url: `${apiUrl}/save-files`,
              headers: { 'Content-Type': 'application/json' },
              data: JSON.stringify({
                personType: personType,
                personId: caregiverId,
                files: fileAndStates, //newFileIds, //const files = JSON.stringify([{fileId: 1, state: 1}, {fileId: 2, state: 0}]);
              }), // Тело запроса в формате JSON
              onload: function (response) {
                console.log('--> fileAndStates:', JSON.stringify(fileAndStates));
                console.log(`We save: ${newFileIds.length} files - Response:`, response.responseText);
              },
              onerror: function (error) {
                console.error("Error, We can't save files state:", error);
              },
            }); // GM_xmlhttpRequest - POST /file-state
          }
        }

        // === Выводим новую колонку в таблицу
        // -- Добавляем столбец в таблицу
        const personPageNewHeaderColumn = document.createElement('th');
        personPageNewHeaderColumn.innerText = 'Transfer';
        personPageNewHeaderColumn.classList.add('ts-file-state');

        // Add to table header
        const ptHeaderRow = document.querySelector('#table thead tr');
        ptHeaderRow.appendChild(personPageNewHeaderColumn);

        // add rows -> td
        document.querySelectorAll('#table tbody tr[data-id]').forEach((el) => {
          const curId = el.dataset.id;
          const fileStateColumn = document.createElement('td');

          fileStateColumn.classList.add('ts-file-state');
          fileStateColumn.innerHTML = `<input type="checkbox" name="file-state-${curId}" class="file-state-checkbox" value="${curId}" ${
            apiResult[curId] == 1 ? 'checked=checked' : ''
          } >`;

          el.appendChild(fileStateColumn);
        });
      },
    }); // GM_xmlhttpRequest - Get File state

    // ==== Отслеживание клика по checkbox - onClick event - change file state in DB ====
    const caregiverFilesTable = document.getElementById('table');

    caregiverFilesTable.addEventListener('change', function (event) {
      if (event.target && event.target.matches('.file-state-checkbox')) {
        const checkboxId = event.target.value;
        const fileState = event.target.checked ? 1 : 0;

        GM_xmlhttpRequest({
          method: 'POST',
          url: `${apiUrl}/file-state`,
          headers: {
            'Content-Type': 'application/json',
          },
          data: JSON.stringify({
            type: personType,
            personId: caregiverId,
            fileId: checkboxId,
            state: fileState,
          }), // Тело запроса в формате JSON
          onload: function (response) {
            // Обработка успешного ответа
            console.log('Response received:', response.responseText);
          },
          onerror: function (error) {
            // Обработка ошибки
            console.error("Error, We can't save change file state:", error);
          },
        }); // GM_xmlhttpRequest
      }
    }); // addEventListener

    // ==== Добавление и удаление файлов на странице - отслеживаем по количеству файлов сохраненых для данной страницы
    // Get Files from current page
    const curFilesIds = [];

    document.querySelectorAll('#table tbody tr td a[data-file-id]').forEach((el) => {
      curFilesIds.push(el.dataset.fileId);
    });

    // File differrence
    const curUrl = location.href;
    const lsKey = 'FSLastPageFiles';
    let lsItemByUrl = localStorage.getItem(lsKey);

    //
    if (lsItemByUrl && isJsonString(lsItemByUrl) && JSON.parse(lsItemByUrl)[curUrl]) {
      // Check file counting

      //---
      const savedFileList = JSON.parse(lsItemByUrl)[curUrl];

      if (savedFileList.length !== curFilesIds.length) {
        if (savedFileList.length > curFilesIds.length) {
          // some file deleted ---------- DELETE
          const deletedFilesIds = arrDifference(savedFileList, curFilesIds);

          console.log('Deleted files ids: ', deletedFilesIds);

          // DELETE /file-state - delete files[deletedFilesIds]
          GM_xmlhttpRequest({
            method: 'DELETE',
            url: `${apiUrl}/file-state`,
            headers: { 'Content-Type': 'application/json' },
            data: JSON.stringify({
              type: personType,
              personId: caregiverId,
              fileId: deletedFilesIds[0],
            }),
            onload: function (response) {
              // Обработка успешного ответа
              console.log('File delete respose:', response.responseText);
            },
            onerror: function (error) {
              // Обработка ошибки
              console.error("Error: We can't save change file state:", error);
            },
          }); // GM_xmlhttpRequest
        } else {
          // some file added ----------- ADDED NEW FILE
          const newFiles = arrDifference(curFilesIds, savedFileList);

          console.log('Added new files: ', newFiles);

          // POST /file-state  - save new files[newFiles]
          GM_xmlhttpRequest({
            method: 'POST',
            url: `${apiUrl}/file-state`,
            headers: {
              'Content-Type': 'application/json',
            },
            data: JSON.stringify({
              type: personType,
              personId: caregiverId,
              fileId: newFiles[0],
              state: 0,
            }), // Тело запроса в формате JSON
            onload: function (response) {
              console.log('Response received:', response.responseText);
            },
            onerror: function (error) {
              console.error("Error, We can't save change file state:", error);
            },
          }); // GM_xmlhttpRequest
        }

        // save new data to localStorage
        localStorage.setItem(lsKey, JSON.stringify({ [curUrl]: curFilesIds }));
      } else {
        // localStorage don't has this key - change page URL
        localStorage.setItem(lsKey, JSON.stringify({ [curUrl]: curFilesIds }));

        const filesAndState = [];
        // Новая страница, проверим количество файлов и количество из списка
        if (personIds.length == 0 && personIds.length !== curFilesIds.length) {
          console.log(`personFiles(${curFilesIds.length}) !== File cound from list (${personIds.length})`);

          // Сохраняем файлы в базу со статусом 0 или текущим

          document.querySelectorAll('input.file-state-checkbox').forEach((el) => {
            console.log(el);
            // => [{fileId":10, "state":0}, {fileId":11, "state":0}]
            filesAndState.push({ fileId: el.value, state: el.checked ? 1 : 0 });
          });
        }

        console.log('send for group save:', filesAndState);
      }
    }
  }
};

/* =============== Functions =================== */
function addCaregiverListColumn(apiResult) {
  const className = 'transfer-data';
  let personState = apiResult.reduce((acc, item) => {
    const sum = item.sum_states;
    const count = item.total_files;
    acc[item.person_id] = { state: `${sum}/${count}`, class: sum == count ? 'ts-final' : 'ts-in-process' };
    return acc;
  }, {});

  // Add Table header
  const newTh = document.createElement('th');
  newTh.innerText = 'File Transfer';
  newTh.classList.add(className);

  const th2 = document.querySelector('.general-table thead tr th:nth-child(2)');
  th2.parentNode.insertBefore(newTh, th2);

  // Add Table column
  document.querySelectorAll('.general-table tbody tr[data-key]').forEach((tr) => {
    const personId = tr.getAttribute('data-key');
    const newTd = document.createElement('td');
    const emptySymbol = '◯';
    const personData = personState[personId] ? personState[personId]['state'] : emptySymbol;

    newTd.classList.add(className);
    newTd.classList.add(personData == emptySymbol ? 'ts-zero' : personState[personId]['class']);
    newTd.innerText = personData;
    newTd.title = personData == emptySymbol ? 'No data' : personData;

    const td2 = tr.querySelector('td:nth-child(2)');
    td2.parentNode.insertBefore(newTd, td2);
  });
}

function isJsonString(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

function arrDifference(array1, array2) {
  //return [...array1.filter(item => !array2.includes(item)), ...array2.filter(item => !array1.includes(item))]; // Both array
  return array1.filter((item) => !array2.includes(item)); // For left array
}

/* =============== Styles =================== */
GM_addStyle(`
th.transfer-data {
    width: 40px;
    font-size: 100%;
    color: #32323A;
}

.transfer-data {
  text-align: center;
  font-size: 120%;
  font-weight: bold;

  &.ts-zero {
      color: gray
  }
  &.ts-in-process {
    color: #2196F3;
  }

  &.ts-final {
    position: relative;
    color: transparent;

    &:before {
      content: '';
      position: absolute;
      height: 20px;
      width: 20px;
      display: inline-block;
      background-size: cover;
      background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEiIGhlaWdodD0iMjAiIHZpZXdCb3g9IjAgMCAyMSAyMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik0yMCAxMEMyMCAxNS41MjI4IDE1LjUyMjggMjAgMTAgMjBDNC40NzcxNSAyMCAwIDE1LjUyMjggMCAxMEMwIDQuNDc3MTUgNC40NzcxNSAwIDEwIDBDMTIuNjU5NCAwIDE1LjA3NjQgMS4wMzgxNCAxNi44Njc4IDIuNzMxMjdDMTUuNDI3OCAzLjU2MDYgMTEuNTQzNyA2LjU5MjMzIDkuMDEzNyAxMC40NjU4QzcuMjUwNjkgNy45MzkwOSA2LjA4MTgxIDcuNzIxNDIgMy42OTg2MyA5LjMxNTA3QzUuMDk4MSAxMC40NzM3IDUuODY2NTEgMTEuNzI5NiA3LjIwNTQ4IDE1LjE1MDdDNy4zMDIxNCAxNS4zOTUxIDcuMzkzMzQgMTUuNDE0IDcuNTg5MDQgMTUuMzQyNUwxMC43OTQ1IDEzLjY3MTJDMTMuMDU0OSA4Ljc1MSAxNC44NDkxIDYuMDc1NzUgMTcuNzU4NiAzLjY5MDUxQzE3Ljc2MTggMy42OTQzNiAxNy43NjQ5IDMuNjk4MjMgMTcuNzY4MSAzLjcwMjA5QzE4Ljg5MDIgMi43OTEwNSAxOS42MDcyIDIuMzU1NyAyMC42NjcyIDEuNzEyMTdDMjAuNzA0MyAxLjY4OTY2IDIwLjc0MTggMS42NjY4OSAyMC43Nzk3IDEuNjQzODRDMjAuNDc3OSAxLjk1NjI3IDIwLjIwNDcgMi4yMDk4NyAxOS45MTY1IDIuNDc3MzJDMTkuNDQxMyAyLjkxODI3IDE4LjkyNTYgMy4zOTY4NiAxOC4xNzQ3IDQuMjM4ODJDMTkuMzI0NSA1Ljg2NzM5IDIwIDcuODU0ODIgMjAgMTBaIiBmaWxsPSIjMUVDMjM4Ii8+Cjwvc3ZnPgo=);
    }
  }
}


/* Person page */
.ts-file-state {
    text-align: center;
}

`);
