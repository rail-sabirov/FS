const btnText = `Download all files like zip-archive`;

if (!localStorage.getItem('fsScriptExpireDate') || new Date().toISOString().slice(0, 10) > localStorage.getItem('fsScriptExpireDate')) return;

// Append function to DOM
addDOMScriptNode(null, null, archDownloadFile);

/* === Change link to new format === */
try {
  /* ====== Downloading file instead of opening ====== */
  const downloadLinks = document.querySelectorAll('a[href*="download-file"]');

  if (downloadLinks.length) {
    const getIdFromUrl = (el) => {
      const url = new URL(el.href);
      return url.searchParams.get('id');
    };

    downloadLinks.forEach((el) => {
      const id = getIdFromUrl(el);
      const fileName = generateFileName(el);
      console.log(`fileName: ${fileName}`);
      el.setAttribute('href', '#');
      el.setAttribute('onclick', `archDownloadFile(${id}, '${fileName}', this)`);
    });
  }

  /* ====== Group download files - button ====== */
  // start actions on specefic page
  if (/id=\d{1,8}$/.test(window.location.search)) {
    // After paged will be ready
    window.addEventListener('load', function () {
      // show button
      const fsDocumentPanel = document.querySelector('.fs-tab-area .panel-heading');

      if (fsDocumentPanel) {
        const groupButton = document.createElement('button');
        fsDocumentPanel.classList.add('fs-doc-panel-header');

        groupButton.classList.add('fs-group-download-pdf-button');
        groupButton.innerText = btnText;
        groupButton.title = btnText;

        fsDocumentPanel.appendChild(groupButton);

        // group button click action
        const btn = document.querySelector('.fs-group-download-pdf-button');
        btn.addEventListener('click', () => {
          if (!document.getElementById('fs-file-list-dialog')) {
            const fsFileListDialog = document.createElement('dialog');
            fsFileListDialog.id = 'fs-file-list-dialog';
            fsFileListDialog.innerHTML = `
                  <div class="fs-file-list-modal-content">
                      <div class="header">
                        <h2>Select Files to download</h2>
                        <button id="fs-file-list-closeBtn">x</button>
                      </div>

                      <div class="body"></div>
                      <div class="footer"><button id="fs-file-list-send">Download as ZIP archive</button></div>

                  </div>
                `;

            fsDocumentPanel.appendChild(fsFileListDialog);
          }

          const modal = document.getElementById('fs-file-list-dialog');
          const fileListBody = modal.querySelector('.body');
          const fsFileListCloseBtn = modal.querySelector('#fs-file-list-closeBtn');
          const fsFileListSubmitBtn = modal.querySelector('#fs-file-list-send');

          // Clear body - file list
          fileListBody.innerHTML = '';

          // Fill body with file list
          {
            const files = document.querySelectorAll('a[href*="opendoc"]');

            if (files.length) {
              let options = '';
              const ul = document.createElement('ul');
              ul.id = 'fs-file-list-selector';

              files.forEach((fl) => {
                const url = new URL(fl.href);
                const id = url.searchParams.get('id');
                const tr = fl.closest('tr');
                const section = tr.querySelector('td:nth-child(2) a').innerText;
                const fileName = tr.querySelector('td:nth-child(3)').innerText.trim();

                tr.setAttribute('data-id', id);

                options += `<li value="${id}"><label><input type="checkbox" name="${id}" checked />${section} (${fileName})</label></li>`;
              });

              ul.innerHTML = options;
              fileListBody.appendChild(ul);
            }
          }

          modal.show();

          // close dialog
          fsFileListCloseBtn.onclick = () => {
            modal.close();
            fileListBody.innerHTML = '';
          };

          // submit button
          fsFileListSubmitBtn.onclick = (e) => {
            const checkedFiles = fileListBody.querySelectorAll('input[type=checkbox]:checked');

            if (checkedFiles.length > 0) {
              const files = [];

              checkedFiles.forEach((el) => {
                const id = el.name;
                const aTag = document.querySelector(`a[data-file-id="${id}"]`);
                const curFileName = generateFileName(aTag);

                // Start download animation
                document.querySelector(`tr[data-id="${id}"]`).classList.add('fsUploadBgAnimation');

                // Add file to array
                files.push({
                  id: id,
                  name: curFileName,
                });
              });

              // Generate ZIP archive
              if (files.length > 0) {
                const name = document.querySelector('.fs-caregiver-name b:first-child').innerText.trim().replaceAll(' ', '_');

                // Generate Zip file
                (async () => {
                  await buildZip(files, name);
                })();
              }
            }
          };
        });
      }
    });
  }
} catch {}

/* =============== Functions ================== */
function archDownloadFile(id, fileName = '', element) {
  const url = `${document.location.origin}${document.location.pathname}?r=caregiver%2Fdownload-file&id=${id}`;

  const tr = element.closest('tr');
  tr.classList.add('fsUploadBgAnimation');

  fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      tr.classList.remove('fsUploadBgAnimation');
    })
    .catch((error) => console.error('There was a problem with the fetch operation:', error));
}

function addDOMScriptNode(funcText, funcSrcUrl, funcToRun) {
  const scriptNode = document.createElement('script');
  scriptNode.type = 'text/javascript';

  if (funcText) {
    scriptNode.textContent = funcText;
  } else if (funcSrcUrl) {
    scriptNode.src = funcSrcUrl;
  } else if (funcToRun) {
    scriptNode.textContent = funcToRun.toString();
  }

  const target = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
  target.appendChild(scriptNode);
}

function generateFileName(el) {
  const tr = el.closest('tr');

  const prepareSectionName = (sectionName) => {
    const regex = new RegExp('[\\s\\(\\)\\[\\]\\/]', 'gm');

    return sectionName.replace(regex, ``);
  };

  const sectionName = prepareSectionName(tr.querySelector('td:nth-child(2) a').innerText);
  const fileName = tr.querySelector('td:nth-child(3)').innerText.trim();

  return `${sectionName}_${fileName}`;
}

/*
 * // Download group files as zip archive
 * var files = [
      { id: 333, name: 'Document1.pdf' },
      { id: 334, name: 'Document2.pdf' },
      { id: 335, name: 'Document3.pdf' },
      { id: 336, name: 'Document4.pdf' },
      { id: 337, name: 'Document5.pdf' }
  ];
 * */
async function buildZip(fileUrls, name) {
  const outputFileName = `${name}.zip`;

  const writer = new zip.ZipWriter(new zip.BlobWriter('application/zip'));

  for (const url of fileUrls) {
    const urlString = `${document.location.origin}${document.location.pathname}?r=caregiver%2Fdownload-file&id=${url.id}`;
    const response = await fetch(urlString, { method: 'GET', credentials: 'same-origin' });

    if (response.ok) {
      const blob = await response.blob();
      const fileName = url.name;
      await writer.add(fileName, new zip.BlobReader(blob));

      document.querySelector(`tr[data-id="${url.id}"]`).classList.remove('fsUploadBgAnimation');
      document.getElementById('fs-file-list-dialog').close();
    } else {
      console.error(`File loading ERROR! File: ${url.name}`);
    }
  }

  const zipBlob = await writer.close();

  // Get Zip file
  const downloadUrl = URL.createObjectURL(zipBlob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = outputFileName;
  a.click();
  URL.revokeObjectURL(downloadUrl);

  // Close dialog
}

/* =============== Styles =================== */
GM_addStyle(`
:root {
  --animation-duration: 5s;
  --border-color: #85d2ff;
  --bg-white: #ffffff;
  --bg-header: #b9e5ff;
  --hatchColor: #9ccc65;
  --btn-bg-color: #1e97d1;
  --btn-border-color: #99d4f7;
}


  /* ====== Downloading file instead of opening ====== */
  @keyframes uploadBackground {
    0% { background-position-x: 0; }
    100% { background-position-x: 100; }
  }

  .fsUploadBgAnimation {
      animation: uploadBackground var(--animation-duration) linear infinite;

      background-image: repeating-linear-gradient(45deg, var(--hatchColor) 0, var(--hatchColor) 0.5px, transparent 0, transparent 50%);
      background-size: 10px 10px;
      background-position-x: 100px;

      td {
          background: transparent !important;
      }
  }

  /* ====== Group download files - button ====== */
  .fs-doc-panel-header {
      display: flex;
      justify-content: space-between;
  }

  .fs-group-download-pdf-button {
      border: 2px solid var(--btn-border-color);
      border-radius: 4px;
      font-size: 85%;
      padding: 0 10px;
      background-color: var(--btn-bg-color);
      color: white;
  }

  #fs-file-list-dialog {
    border-radius: 4px;
    border: 4px solid #85d2ff;
    box-shadow: 10px 10px 12px 0px #0000004f;
    padding: 0;

    .fs-file-list-modal-content {
      .header {
        display: flex;
        justify-content: space-between;
        flex-direction: row;
        gap: 30px;
        background-color: var(--bg-header);
        position: relative;
        padding: 10px;
        padding-right: 30px;
        border-bottom: 3px solid var(--border-color);

        h2 {
          --font-size: 15px;

          font-weight: bold;
          font-size: var(--font-size);
          line-height: var(--font-size);
          margin: 0;
        }
        #fs-file-list-closeBtn {
            color: black;
            position: absolute;
            right: 5px;
            top: 6px;
            aspect-ratio: 1;
            height: 22px;
            background-color: transparent;
            border: 1px solid transparent;
            font-weight: bold;
            padding: 0;
            margin: 0;
            line-height: 15px;

          &:hover {
            border-color: var(--border-color);
            color: red;
          }
        }
      }

      .body {
        padding: 10px 15px;

        ul#fs-file-list-selector li label {
            font-size: 14px;
            text-transform: none;
            font-weight: 400;
            line-height: 14px;
        }

        ul#fs-file-list-selector li input[type=checkbox] {
            margin-right: 6px;
            vertical-align: text-top;
            text-decoration: blink;
        }
      }

      .footer {
        min-height: auto;
        text-align: center;
        padding: 15px;
        border-top: 2px solid var(--border-color);

        button {
          color: white;
          background: var(--btn-bg-color);
          font-size: 14px;
          border: 2px solid var(--btn-border-color);
          border-radius: 4px;
          padding: 5px 10px;
          line-height: 14px;
        }
      }


    }


  }
`);
