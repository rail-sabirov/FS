try {
    let waitNotification = 10;
    const closeNotification = setInterval(()=>{
        const messageDialog = document.querySelector('#btnRead[value="Mark as Read and Close"]');

        try {
            if (!!messageDialog) {
                messageDialog.click();
            } else {
                waitNotification--;

                if (waitNotification == 0) {
                    clearInterval(closeNotification);
                }
            }
       } catch {}
    }, 100);

} catch {}