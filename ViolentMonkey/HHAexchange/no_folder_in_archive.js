// ==UserScript==
// @name        DEV: HHAexchange - No Folder in archive room (probably)
// @namespace   FiveStar
// @match       https://app.hhaexchange.com/ENT*/Aide/Aide.aspx*

// @grant       none
// @version     1.0
// @author      Rail-S.FiveStar
// @description 8/1/2024, 2:04:25 PM
// @grant GM_addStyle
// ==/UserScript==
try {
    const curDate = new Date('06/27/2023');
    const appDate = document.querySelector('#uxlblApplicationDate');
    if (appDate) {
        let applicationDate = new Date(appDate.getHTML());
        const rehireDate = document.getElementById('uxlblRehireDate').innerText;

        if (!!rehireDate) {
          applicationDate = new Date(rehireDate);
        }

        if(applicationDate > curDate) {
          document.querySelector('body').classList.add('no-folder-in-archive');

          // Добавляем новый элемент #no-folder-in-archive в начало body
          const newDiv = document.createElement('div');
          newDiv.id = 'no-folder-in-archive';

          if (!!rehireDate) {
            newDiv.classList.add('rehire');
          }
          // Получаем ссылку на первый элемент в body
          const firstElement = document.body.firstChild;

          // Вставляем новый элемент перед первым элементом
          document.body.insertBefore(newDiv, firstElement);
        }
    }
} catch {}

  // --- Styles ------------------------------------
  GM_addStyle(`
    #no-folder-in-archive {
      position: relative;
    }
    #no-folder-in-archive:after {
        content: '';
        position: absolute;
        top: 110px;
        right: 35px;
        aspect-ratio: 1;
        height: 60px;
        z-index: 998;
        background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMDQ4IDIwNDgiIHdpZHRoPSIxMjgwIiBoZWlnaHQ9IjEyODAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDApIiBkPSJtMCAwaDIwNDh2MjA0OGgtMjA0OHoiIGZpbGw9IiNGRTEyMEMiLz4KPHBhdGggdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCkiIGQ9Im0wIDBoMjA0OHYyMDQ4aC0yMDQ4em05NzYgMjgtNTIgNC0zNSA0LTM4IDYtNTAgMTAtNDAgMTAtMzcgMTEtMzYgMTItMzcgMTQtMjggMTItMjQgMTEtMjUgMTItMjMgMTItMjMgMTMtMjcgMTYtMjIgMTQtMjUgMTctMTggMTMtMTIgOS0xMyAxMC0xNCAxMS0xMiAxMC0xMSA5LTEzIDEyLTggNy0xMiAxMS0xNiAxNi03IDZ2MmwtNCAyLTcgOC0xNyAxNy05IDExLTggOC05IDExLTExIDEzLTEzIDE3LTEwIDEyLTE0IDE5LTE0IDIwLTEwIDE1LTExIDE3LTEzIDIxLTE2IDI4LTEzIDI0LTkgMTctMTMgMjgtMTIgMjctMTMgMzMtMTMgMzYtMTIgMzgtMTIgNDUtOCAzNy03IDM4LTYgNDItNCA0My0yIDMwLTEgMjh2MzVsMiA0MiAzIDM3IDMgMjcgNiA0MiA5IDQ3IDE0IDU2IDEyIDM5IDE0IDQxIDE0IDM1IDExIDI1IDEzIDI4IDEzIDI2IDEyIDIyIDE0IDI0IDEyIDIwIDIyIDMzIDExIDE2IDExIDE1IDEwIDEzIDExIDE0IDEzIDE2IDExIDEzIDEyIDE0IDEyIDEzIDcgOCA0NiA0NiA4IDcgMTIgMTEgOCA3aDJ2MmwxMCA4IDEyIDEwIDE0IDExIDkgNyAxOSAxNCAxOCAxMyAxMiA4IDI1IDE2IDIxIDEzIDI4IDE2IDMxIDE2IDE2IDggMzYgMTcgMzIgMTMgMzUgMTMgNDYgMTUgMzUgMTAgMzkgOSA0MSA4IDQ5IDcgMzkgNCA0MyAzaDY3bDM4LTIgMzYtMyA0OC02IDQwLTcgNDItOSA0Mi0xMSA0NS0xNCAzMS0xMSAyOC0xMSAzMC0xMyAzNi0xNyAzMS0xNiAyMy0xMyAyOC0xNyAyMi0xNCAxNS0xMCAyMC0xNCAyMS0xNiAxMy0xMCAxNi0xMyAxMC04IDE0LTEyIDI0LTIyIDE2LTE1IDI2LTI2IDctOCAxMi0xMyAxMS0xMiA5LTExIDExLTEzIDEwLTEzIDExLTE0IDEyLTE2IDEyLTE3IDIyLTMzIDE1LTI0IDIyLTM4IDI1LTUwIDctMTYgNy0xNSAxNS0zNyA3LTE4IDE0LTQzIDgtMjcgMTAtMzkgOC0zNyA3LTQxIDUtMzggMy0zNCAzLTQ4di02NWwtMy00Ni0zLTMzLTYtNDUtOC00My05LTQxLTExLTQwLTEyLTM4LTExLTMxLTExLTI4LTEyLTI4LTE2LTM0LTE4LTM1LTIwLTM1LTE1LTI0LTIwLTMwLTIwLTI4LTEzLTE3LTgtMTAtMTEtMTQtMTItMTQtMTEtMTMtMTQtMTUtMTEtMTItNDEtNDEtOC03LTE0LTEzLTExLTktMTAtOS0xNC0xMS0xNS0xMi0xNi0xMi0xNC0xMC0xNy0xMi0yNy0xOC0zMi0xOS0yNC0xNC00MS0yMS0zNC0xNi0zNi0xNS00My0xNi00NC0xNC00MS0xMS00MC05LTQ1LTgtMzctNS00MS00LTMxLTJ6IiBmaWxsPSIjRkRGRkZEIi8+CjxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDk4NCwyNDgpIiBkPSJtMCAwaDg1bDQ0IDQgNDIgNiAzNiA3IDQ4IDEyIDI5IDkgMzEgMTEgMjIgOSAyMSA5IDI5IDE0IDIyIDExIDI0IDE0IDIzIDE0IDI0IDE2IDE0IDEwIDE1IDExIDE0IDExIDExIDkgMTMgMTEgOCA3IDEzIDEyIDEyIDExIDI2IDI2IDcgOCAxNCAxNSAxOCAyMiAxMiAxNSAxNCAxOSAxNCAyMCAxMSAxNyAxMSAxOCAxNCAyNCAxNyAzMyAxNSAzMiAxNCAzNSAxMyAzNyAxMSAzOCA5IDM4IDcgMzkgNCAyOSAzIDMxIDIgMzh2NTJsLTIgMzYtNCAzOS03IDQzLTkgNDEtOCAzMC0xNSA0Ni04IDIxLTEzIDMxLTEwIDIyLTEwIDE5LTEzIDI1LTEwIDE3LTEyIDE5LTE4IDI3LTEzIDE4LTUgNS0xNTMtMTUzIDEtNSAxMy0zNSAxNS0zOSAyNi03MCAxMS0yOSAyMS01NiAxOS01MSAyMC01MyAxNS00MCAxMy0zNSA3LTE5di0yaC01OTRsLTQtMi03LTgtNjgtNjggNC0yaDY4bDM2NiAxdi0xNTZsLTUxMC0xLTgtNy0yOC0yOC04LTctMjQtMjQtOC03LTI3LTI3LTgtNy0yOC0yOC04LTctMTAtMTBoLTY2bC0xNi0xLTEwOS0xMDkgMS00IDExLTkgMTYtMTEgMjktMTkgMjctMTYgMzItMTcgMjQtMTIgMzAtMTMgMjktMTEgMTktNyAyOS05IDMwLTggMzAtNyAzOS03IDQwLTV6IiBmaWxsPSIjRkRGRkZEIi8+CjxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDYzMCw5MDQpIiBkPSJtMCAwaDExOGw4IDcgMTcgMTcgOCA3IDIgNCA0IDIgNTYwIDU2MCA2IDV2Mmw0IDIgMTYgMTYgMyA1LTEgMS05NCAxaC02NzRsLTE3MC0xLTYtNS05LTExLTExLTE0LTItMiAxLTkgMTQtMzcgMTktNTEgMTEtMjkgMzAtODAgMjItNTkgMzAtODAgMTEtMjkgMTMtMzUgNTEtMTM2IDExLTI5eiIgZmlsbD0iIzM0MzMzMyIvPgo8cGF0aCB0cmFuc2Zvcm09InRyYW5zbGF0ZSg0MzgsMTUzMikiIGQ9Im0wIDBoOTM5bDUgNSAxMCA5IDE0IDE0djJsNCAyIDc4IDc4IDEgMy0xMCA4LTIzIDE2LTI1IDE2LTE1IDktMjEgMTItMzMgMTctMjggMTMtMzcgMTUtMjggMTAtMzYgMTEtMzYgOS0zNCA3LTM4IDYtNDAgNC0zMyAyaC01N2wtNDUtMy0zNS00LTQyLTctMzYtOC0zMC04LTI5LTktMzEtMTEtMjktMTItMzMtMTUtMjQtMTItMjMtMTMtMjItMTMtMjItMTQtMjAtMTQtMTktMTQtMjUtMjAtMTMtMTEtMTItMTEtOC03LTEzLTEyLTktOC03LTgtOC04di0yaC0ybC03LTgtMTItMTN6IiBmaWxsPSIjRkRGRkZEIi8+CjxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDE2NTEsOTAzKSIgZD0ibTAgMCAxIDMtMTAgMjgtMTEgMjktMTUgNDAtMTcgNDUtMjIgNTktMjYgNjktMjIgNTktMTcgNDUtOSAyNC0xMiAzMS0xIDItNS0yLTctOC04MS04MS05LTgtNS01di0ybC00LTItNC01LTItMXYtMmgtMnYtMmgtMmwtNy04LTE5OS0xOTktNS00di0ybC00LTItMS0zaC0ydi0ybC00LTItOC04di0yaC0ybC0zLTN2LTJoLTJsLTctOC02OC02OCAxLTJ6IiBmaWxsPSIjMzQzMzMzIi8+CjxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDY3MSw1MTUpIiBkPSJtMCAwaDc4bDE2IDE2IDggNyAyOCAyOCA4IDcgMjcgMjcgOCA3IDI0IDI0IDggNyAyOCAyOCAyIDEgNTEwIDEgMSAzLTEgMTU0aC00MzdsLTUtMi0xMi0xMi04LTctMzAtMzB2LTJoLTJsLTctOC01LTUtMy0ydi0yaC0ybC0xMC0xMHYtMmwtNC0yLTctOC0xNi0xNi0yLTF2LTJoLTJsLTctOC0xNS0xNS01LTQtNy04LTE2MS0xNjF2LTJ6IiBmaWxsPSIjMzQzMzMzIi8+CjxwYXRoIHRyYW5zZm9ybT0idHJhbnNsYXRlKDM5OSw1NTkpIiBkPSJtMCAwIDUgMSAxMyAxMSAyNSAyNXYyaDJsNyA4IDY5IDY5IDQgM3YyaDJsNyA4IDIxIDIxIDggNyAzMCAzMCA3IDggMTcgMTYgMzggMzggMiAxdjJsNCAyIDcgOXYzaC02MWwtNTMgMS0zIDktMjEgOTUtNTQgMjQzLTE2IDcxLTQwIDE4MC0xMyA1OS0yIDgtNC0yLTQtNi0xLTV2LTkxMnoiIGZpbGw9IiMzNDMzMzMiLz4KPHBhdGggdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzkzLDU3MCkiIGQ9Im0wIDBoMmwxIDMzMHY5NGwtMSA0ODUtNC00LTIxLTMyLTEzLTIxLTE0LTI0LTE1LTI5LTEzLTI3LTE0LTMzLTktMjQtMTUtNDYtMTItNDgtNy0zNi02LTQyLTQtNDQtMS0yMnYtNDVsMi0zNCA0LTQxIDctNDUgOC0zOCA4LTMxIDgtMjYgMTAtMzAgMTEtMjggOS0yMSAxMy0yNyA4LTE2IDEyLTIzIDgtMTMgMTAtMTcgMTgtMjcgNy0xMXoiIGZpbGw9IiNGREZGRkQiLz4KPHBhdGggdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjA2LDgyNCkiIGQ9Im0wIDBoNjJsMTAgOSA2OSA2OXYyaC0xMTdsLTIgOS0xNSA0MC0xMSAyOS05NiAyNTYtMTkgNTEtMzAgODAtMTQgMzctMTggNDgtMTYgNDJoLTNsLTItMyAxLTEwIDE5LTg2IDgtMzUgOS00MiAxOC04MCAxMy01OCA1Ni0yNTIgMTktODYgNC0xNiAyLTN6IiBmaWxsPSIjRkRGRkZEIi8+Cjwvc3ZnPgo=);
        background-size: contain;
        border-radius: 50%;
        box-shadow: 0px 0px 0px 60px rgba(248,62,62,0.05),
                    0px 0px 0px 40px rgba(248,62,62,0.05),
                    0px 0px 0px 20px rgba(248,62,62,0.05);
    }

    div#no-folder-in-archive.rehire:before {
        content: 'ReHire';
        position: absolute;
        top: 170px;
        right: 35px;
        width: 60px;
        height: 15px;
        z-index: 999;
        text-align: center;
        font-size: 120%;
        border-radius: 15px;
        background-color: #ffe3e3;
        font-weight: bold;
        color: #000;
    }
  `);