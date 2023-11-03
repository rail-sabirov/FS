try {
    let waitNotification = 10;
    const closeNotification = setInterval(()=>{
        const messageDialog = $('#btnRead[value="Save as read"]');

        if (messageDialog.length) {
            messageDialog.trigger('click');
        } else {
            waitNotification--;

            if (waitNotification == 0) {
                clearInterval(closeNotification);
            }
        }
    }, 100);
} catch {}