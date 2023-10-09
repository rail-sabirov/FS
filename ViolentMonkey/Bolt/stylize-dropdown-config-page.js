
// Add a helper class
$('#demographic_data table .template_demographic_type')
    .closest('tr')
    .addClass('fs-dropdown-item')

// Add separator
$('<tr class="fs-tr-separator"><td colspan=10><span></span></td></tr>')
    .insertBefore($('.fs-dropdown-item'))

// Styles
GM_addStyle(`
  #demographic_data {
    --header-background: #009fff;
    --header-border-color: white;

    --text-color: #fff;
    --border-color: #1e88e5;
    --element-header-background: beige;
  }

  #demographic_data table th {
    background: var(--header-background);
    color: var(--text-color);
    border: 2px solid var(--header-border-color);
    text-align: center;
    vertical-align: middle;
  }

  #demographic_data table tr:not(.fs-tr-separator) {
    border-left: 2px solid var(--border-color);
    border-right: 2px solid var(--border-color);
  }

  tr.fs-dropdown-item td {
      background-color: var(--element-header-background);
      font-weight: bold;
  }

  tr.fs-dropdown-item {
      border-top: 3px solid var(--border-color);
      border-bottom: 2px solid var(--border-color);
  }

  tr.fs-dropdown-item td {
      border: 1px solid var(--border-color);
      vertical-align: middle;
  }

  .table-striped tbody tr:nth-of-type(odd) {
      background: none;
  }
  tr.fs-tr-separator {
    border-top: 2px solid var(--border-color);
  }

  tr.fs-tr-separator td span {
      padding: 10px 0;
      display: inline-block;
  }

  div#add_new_input_dim {
      border: 2px solid var(--border-color);
      padding: 20px;
  }
`);