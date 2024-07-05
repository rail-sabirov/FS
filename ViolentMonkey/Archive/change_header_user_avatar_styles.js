  // JS
  $(document).ready(function() {
    const newDiv = $('<div>', { class: 'user-photo' });

    $('.top-nav ul.top-menu > li > a').append(newDiv);
  });


  // --- Styles ------------------------------------
  GM_addStyle(`
    .top-nav ul.top-menu>li>a>img {
      display: none !important;
    }
    .top-nav ul.top-menu>li>a {
      margin-right: 0;
      border: 7px solid #e8f9ff !important;
      background: #e8f9ff !important;
      border-radius: 0 20px 20px 0 !important;
      padding: 0 10px;
    }

    .top-nav ul.top-menu>li>a:hover, .top-nav ul.top-menu>li>a:focus {
        background: #e8f9ff !important;
        border: 7px solid #e8f9ff !important;
        border-radius: 0 20px 20px 0 !important;
        padding-left: 10px;
    }


    .nav>li>a>div.user-photo {
        background-image: url(https://encrypted-tbn1.gstatic.com/images?q=tbn:ANd9GcR_S9LQR4VJPuZgV7EUv6OJsJLUw99cIrH_U9igKSBy6jbTg0N3);
        height: 50px;
        width: 50px;
        position: absolute;
        border: 7px solid #e8f9ff;
        left: -45px;
        top: -13px;
        border-radius: 50%;
        background-position-y: -12px;
        background-size: 65px;
        background-position-x: -14px;
    }

  `);
