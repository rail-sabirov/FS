/* ================= Stylize top menu --- */
if (true) {
  try {
    const locationPath = location.pathname;
    let activeElement = null;

    if (!!locationPath.match(/\/Common\//)) {
      activeElement = '#parentmenuid0';
    }

    if (!!locationPath.match(/\/Patient\//)) {
      activeElement = '#parentmenuid1';
    }

    if (!!locationPath.match(/\/Aide\//)) {
      activeElement = '#parentmenuid2';
    }

    if (!!locationPath.match(/\/Call\//)) {
      activeElement = '#parentmenuid3';
    }

    if (!!locationPath.match(/\/Action\//)) {
      activeElement = '#parentmenuid4';
    }

    if (!!locationPath.match(/\/HHAReportsML\//)) {
      activeElement = '#parentmenuid5';
    }

    if (!!locationPath.match(/\/Admin\//)) {
      activeElement = '#parentmenuid6';
    }

    if (!!activeElement) {
      $(document).ready(function () {
        $(activeElement).addClass('fs-active-top-menu');
      });
    }
  } catch (e) {
    console.log('Err: ', e);
  }
}

/* --- open file for viewing in tab + Need Chrome extension "Undisposition" --- */
function ViewScanDocument() {
  var QS =
    'ScanFileGUID=' +
    GScanFileGUID +
    '&ModuleID=' +
    GModuleID +
    '&FeatureID=' +
    GFeatureID +
    '&AgencyID=' +
    GAgencyID +
    '&Module=' +
    GModule +
    '&Feature=' +
    GFeature +
    '&Agency=' +
    GAgency +
    '&IsApproved=' +
    FlgIsApproved +
    '';
  window.open('../Common/Download.aspx?' + QS + '&Flag=VIEW', '_blank');
  return false;
}

/* ================= Remove Notification dialog on the all site === */
let notificationDialogHide = false;

setInterval(function () {
  /* --- remove dialog --- */
  if ($('#NotificationDiv').find('#btnContinue').length > 0) {
    $('#NotificationDiv').find('#btnContinue').click();
    notificationDialogHide = true;
  }

  if (notificationDialogHide) {
    $('body').append('<div id="fs-message">The notification Dialog is removed!</div>');
    notificationDialogHide = false;
    setTimeout(function () {
      $('#fs-message').remove();
    }, 5000);
  }

  /* --- Remove notification after Caregiver terminated --- */
  if ($('#alertDialog').next().text() == '- Information has been saved.') {
    $('#btnAlertOK').click();
  }

  if ($('#alertDialog').next().text() == "- All future visits of the Caregiver are updated to 'Temp'.") {
    $('#btnAlertOK').click();
    location.reload();
    window.scrollTo(0, 0);
  }
}, 1000);

/* --- Remove notification Tags in menu ---*/
if ($('#notificationDiv').length === 1 && window.innerWidth < 1000) {
  $('#notificationDiv').remove();
}

/* =============== Styles =================== */
GM_addStyle(`
  /* --- Stylize top menu --- */
  li.fs-active-top-menu a {
      background-color: #d5dbe9 !important;
      color: black !important;
      border-top: 1px solid #3b6680;
  }


  /* === Remove Notification dialog on the all site === */
  #fs-message {
      position: absolute;
      left: 10px;
      top: 10px;
      border: 4px solid red;
      display: block;
      border-radius: 5px;
      padding: 10px;
      font-size: 12px;
      font-weight: bold;
      background-color: white;
  }

  /* --- Main menu style --- */
  ul#navigation > li a:hover {
      background-color: #5394bb;
  }

  /* --- table hover --- */
  #dvMedicalsOtherGrid table {
      border: 2px solid red !important;
  }
  #dvMedicalsOtherGrid table tr:hover {
      background-color: #8bc34a8f !important;
  }

`);
