
GM_addStyle(`

/* ==== Fast search - Поле ввода */
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
    border-radius: 7px;
    margin-bottom: 20px;
    padding-bottom: 8px;
    border: none;
    box-shadow: -5px 0px 0px 0px white;
    margin-left: 6px;
}

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

`);