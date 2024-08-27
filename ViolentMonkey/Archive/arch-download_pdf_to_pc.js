/* Downloading file instead of opening */
function archDownloadFile(id, fileName='', element) {
    const url = `${document.location.origin}${document.location.pathname}?r=caregiver%2Fdownload-file&id=${id}`;

    const tr = element.closest('tr');
    tr.classList.add('fsUploadBgAnimation');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
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
        .catch(error => console.error('There was a problem with the fetch operation:', error));
}

function addDOMScriptNode (funcText, funcSrcUrl, funcToRun) {
  var scriptNode = document.createElement('script');
  scriptNode.type = "text/javascript";

  if (funcText) {
    scriptNode.textContent = funcText;
  } else if (funcSrcUrl) {
    scriptNode.src = funcSrcUrl;
  } else if (funcToRun) {
    scriptNode.textContent = funcToRun.toString();
  }

  var target = document.getElementsByTagName('head')[0] || document.body || document.documentElement;
  target.appendChild(scriptNode);
}

addDOMScriptNode(null, null, archDownloadFile);


/* =========================================================================================================== */

/* Change link to new format */
try {
  const downloadLinks = document.querySelectorAll('a[href*="download-file"]');

  if (downloadLinks.length) {
    const getIdFromUrl = (el) => {
        const url = new URL(el.href);
        return url.searchParams.get('id');
    };

    const generateFileName = (el) => {
        const tr = el.closest('tr');
        const sectionName = prepareSectionName(tr.querySelector('td:first-child a').innerText);
        const fileName = tr.querySelector('td:nth-child(2)').innerText.trim();
        return `${sectionName}_${fileName}`;
    };

    const prepareSectionName = (sectionName) => {
        const regex = new RegExp('[\\s\\(\\)\\[\\]\\/]', 'gm');

        return sectionName.replace(regex, ``);
    }
    
    downloadLinks.forEach((el) => {
        const id = getIdFromUrl(el);
        const fileName = generateFileName(el);

        el.setAttribute('href', '#');
        el.setAttribute('onclick', `archDownloadFile(${id}, '${fileName}', this)`);
    });
  }
} catch {}

GM_addStyle(`
  @keyframes uploadBackground {
        0% {
            background-position-x: 0;
        }
        100% {
            background-position-x: 100;
        }
    }

    .fsUploadBgAnimation {
        --hatchColor: #9ccc65;

        animation: uploadBackground 20s linear infinite;

        background-image: repeating-linear-gradient(-45deg, var(--hatchColor) 0, var(--hatchColor) 0.5px, transparent 0, transparent 50%);
        background-size: 10px 10px;
        background-position-x: 100px;

        td {
            background: transparent !important;
        }
    }
`);