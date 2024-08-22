
GM_addStyle(`

/* ==== Fast search - Поле ввода (2024.08.21) */
#searchform div input {
	padding-left: 10px;
	padding-right: 10px;
}

/* ==== Fast search - Стилизация Not found */
div#suggestions:has(.searchheading):not(:has(span.category)) {
    position: relative;

  span.searchheading {
    left: 365px;
    top: 3px;
    color: #df1717;
    border: 2px solid #F44336;
    position: absolute;
    padding: 10px 40px;
    border-radius: 6px;
    background: white;
    box-shadow: 4px 4px 4px 0px #00000047;
    font-weight: bold;
    font-size: 120%;
    background-color: #FFFFFF;
    z-index: 1;
    background-image: repeating-linear-gradient(45deg, #FFC849 0, #FFC849 0.5px, transparent 0, transparent 50%);
    background-size: 12px 12px;

    &:before {
      content: '';
      width: 0;
      height: 0;
      border-style: solid;
      border-right: 7px solid transparent;
      border-left: 7px solid transparent;
      border-bottom: 10px solid #F44336;
      border-top: 0;
      position: absolute;
      top: -10px;
      left: 10px;
    }

    &:after {
        content: '';
        width: 0;
        height: 0;
        border-style: solid;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        border-bottom: 8px solid #ffffff;
        border-top: 0;
        position: absolute;
        top: -8px;
        left: 13px;
    }
  }
}

/* ==== Fast search - Стилизация вывода результатов быстрого поиска в Caregiver */
#searchresults {
  max-height: calc(100vh - 200px) !important;
}


/* ==== Caregiver photo and name field */
.fs-caregiver-profile-section header.panel-heading.clearfix {
    background-color: #ffffff9c;
    border-radius: 8px;
    margin-bottom: 20px;
    padding-bottom: 5px;
    border: none;
    border-left: 4px solid #fff;

  .fs-caregiver-photo {
    box-shadow: 0 0 11px 0px #72a6b982;
  }

  .fs-caregiver-name {
    b:first-child {
      @import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
      font-family: "Great Vibes", cursive;
      text-transform: capitalize;
      font-size: 32px;
      font-weight: 400;
      line-height: 26px;
      color: #1565C0;
    }

    &.woman b:first-child {
      color: #f44336;
    }
  }
}

/* ==== Edit button (2024.08.22) */
.fsCaregiverInfoValidator {
  & ~ p {
    margin-top: 15px;
    border-top: 2px solid #b9e5ff87;
    padding-top: 10px;
    border-radius: 0 8px 0 0;

    & > a {
      font-size: 10px;
      color: #ffffff;
      background-color: #399700;
      border: 1px solid #399700;
      border-radius: 3px;
      padding: 0 11px;
      margin-left: 10px;

      &:after {
        content: 'EDIT';
        font-size: 10px;
        color: #ffffff;
      }

      & > b {
        display: none;
      }

      &:hover {
        position: relative;

        &:before {
            content: '';
            background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDIiIHZpZXdCb3g9IjAgMCA0OCA0MiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjBfZF8xMl84KSI+CjxwYXRoIGQ9Ik0xNS41IDMwLjVDMTUuNSAzMy41Mzc2IDEzLjAzNzYgMzYgMTAgMzZDNi45NjI0MyAzNiA0LjUgMzMuNTM3NiA0LjUgMzAuNUM0LjUgMjcuNDYyNCA2Ljk2MjQzIDI1IDEwIDI1QzEzLjAzNzYgMjUgMTUuNSAyNy40NjI0IDE1LjUgMzAuNVoiIGZpbGw9IndoaXRlIi8+CjxwYXRoIGQ9Ik00NCAxNkM0NCAyNC44MzY2IDM2LjgzNjYgMzIgMjggMzJDMTkuMTYzNSAzMiAxMiAyNC44MzY2IDEyIDE2QzEyIDcuMTYzNDQgMTkuMTYzNSAwIDI4IDBDMzYuODM2NiAwIDQ0IDcuMTYzNDQgNDQgMTZaIiBmaWxsPSJ3aGl0ZSIvPgo8cGF0aCBkPSJNMTUuMjUgMzAuNUMxNS4yNSAzMy4zOTk1IDEyLjg5OTUgMzUuNzUgMTAgMzUuNzVDNy4xMDA1MSAzNS43NSA0Ljc1IDMzLjM5OTUgNC43NSAzMC41QzQuNzUgMjcuNjAwNSA3LjEwMDUxIDI1LjI1IDEwIDI1LjI1QzEyLjg5OTUgMjUuMjUgMTUuMjUgMjcuNjAwNSAxNS4yNSAzMC41Wk00My43NSAxNkM0My43NSAyNC42OTg1IDM2LjY5ODUgMzEuNzUgMjggMzEuNzVDMTkuMzAxNSAzMS43NSAxMi4yNSAyNC42OTg1IDEyLjI1IDE2QzEyLjI1IDcuMzAxNTEgMTkuMzAxNSAwLjI1IDI4IDAuMjVDMzYuNjk4NSAwLjI1IDQzLjc1IDcuMzAxNTIgNDMuNzUgMTZaIiBzdHJva2U9IiNCOUI3QjciIHN0cm9rZS13aWR0aD0iMC41Ii8+CjwvZz4KPGcgZmlsdGVyPSJ1cmwoI2ZpbHRlcjFfZF8xMl84KSI+CjxjaXJjbGUgY3g9IjIuNSIgY3k9IjM3LjUiIHI9IjIuNSIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMi41IiBjeT0iMzcuNSIgcj0iMi4yNSIgc3Ryb2tlPSIjQ0NDQ0NDIiBzdHJva2Utd2lkdGg9IjAuNSIvPgo8L2c+CjxwYXRoIGQ9Ik0yNS44NDA5IDIzLjI0MTNMMjIuNDgyMyAyMS4xMTM2TDIxLjY3OTMgMjYuMDk1OEwyNS44NDA5IDIzLjI0MTNaIiBmaWxsPSJibGFjayIvPgo8cGF0aCBkPSJNMjYuNTUwMSAyMi4xMjE4TDIzLjE5MTUgMTkuOTk0MUwzMi4wNTY4IDZMMzUuNDE1NCA4LjEyNzY3TDI2LjU1MDEgMjIuMTIxOFoiIGZpbGw9ImJsYWNrIi8+CjxkZWZzPgo8ZmlsdGVyIGlkPSJmaWx0ZXIwX2RfMTJfOCIgeD0iNC41IiB5PSIwIiB3aWR0aD0iNDMuNSIgaGVpZ2h0PSI0MCIgZmlsdGVyVW5pdHM9InVzZXJTcGFjZU9uVXNlIiBjb2xvci1pbnRlcnBvbGF0aW9uLWZpbHRlcnM9InNSR0IiPgo8ZmVGbG9vZCBmbG9vZC1vcGFjaXR5PSIwIiByZXN1bHQ9IkJhY2tncm91bmRJbWFnZUZpeCIvPgo8ZmVDb2xvck1hdHJpeCBpbj0iU291cmNlQWxwaGEiIHR5cGU9Im1hdHJpeCIgdmFsdWVzPSIwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAxMjcgMCIgcmVzdWx0PSJoYXJkQWxwaGEiLz4KPGZlT2Zmc2V0IGR4PSIyIiBkeT0iMiIvPgo8ZmVHYXVzc2lhbkJsdXIgc3RkRGV2aWF0aW9uPSIxIi8+CjxmZUNvbXBvc2l0ZSBpbjI9ImhhcmRBbHBoYSIgb3BlcmF0b3I9Im91dCIvPgo8ZmVDb2xvck1hdHJpeCB0eXBlPSJtYXRyaXgiIHZhbHVlcz0iMCAwIDAgMCAwLjYwNDE2NyAwIDAgMCAwIDAuNjA0MTY3IDAgMCAwIDAgMC42MDQxNjcgMCAwIDAgMC4yNSAwIi8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW4yPSJCYWNrZ3JvdW5kSW1hZ2VGaXgiIHJlc3VsdD0iZWZmZWN0MV9kcm9wU2hhZG93XzEyXzgiLz4KPGZlQmxlbmQgbW9kZT0ibm9ybWFsIiBpbj0iU291cmNlR3JhcGhpYyIgaW4yPSJlZmZlY3QxX2Ryb3BTaGFkb3dfMTJfOCIgcmVzdWx0PSJzaGFwZSIvPgo8L2ZpbHRlcj4KPGZpbHRlciBpZD0iZmlsdGVyMV9kXzEyXzgiIHg9IjAiIHk9IjM1IiB3aWR0aD0iNyIgaGVpZ2h0PSI3IiBmaWx0ZXJVbml0cz0idXNlclNwYWNlT25Vc2UiIGNvbG9yLWludGVycG9sYXRpb24tZmlsdGVycz0ic1JHQiI+CjxmZUZsb29kIGZsb29kLW9wYWNpdHk9IjAiIHJlc3VsdD0iQmFja2dyb3VuZEltYWdlRml4Ii8+CjxmZUNvbG9yTWF0cml4IGluPSJTb3VyY2VBbHBoYSIgdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDAgMCAwIDEyNyAwIiByZXN1bHQ9ImhhcmRBbHBoYSIvPgo8ZmVPZmZzZXQgZHg9IjEiIGR5PSIxIi8+CjxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjAuNSIvPgo8ZmVDb21wb3NpdGUgaW4yPSJoYXJkQWxwaGEiIG9wZXJhdG9yPSJvdXQiLz4KPGZlQ29sb3JNYXRyaXggdHlwZT0ibWF0cml4IiB2YWx1ZXM9IjAgMCAwIDAgMC43MzMzMzMgMCAwIDAgMCAwLjczMzMzMyAwIDAgMCAwIDAuNzMzMzMzIDAgMCAwIDAuMjUgMCIvPgo8ZmVCbGVuZCBtb2RlPSJub3JtYWwiIGluMj0iQmFja2dyb3VuZEltYWdlRml4IiByZXN1bHQ9ImVmZmVjdDFfZHJvcFNoYWRvd18xMl84Ii8+CjxmZUJsZW5kIG1vZGU9Im5vcm1hbCIgaW49IlNvdXJjZUdyYXBoaWMiIGluMj0iZWZmZWN0MV9kcm9wU2hhZG93XzEyXzgiIHJlc3VsdD0ic2hhcGUiLz4KPC9maWx0ZXI+CjwvZGVmcz4KPC9zdmc+Cg==);
            position: absolute;
            border: none;
            height: 40px;
            aspect-ratio: 1;
            background-repeat: no-repeat;
            background-position: bottom left;
            left: 85%;
            top: -32px;
            background-size: contain;
            z-index: 1;
        }
      }
    }


  }

  /* fixing first element */
  & + p {
    margin-top: 0;
    border-top: none;
    padding-top: 0;
    border-radius: 0;
  }
}

`);