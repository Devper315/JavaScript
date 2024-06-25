function toast(notification) {
    let main = document.getElementById('toast')
    let toast = document.createElement('div')
    toast.classList.add('toast', `toast--${notification['type']}`)
    toast.style.animation = `slideInLeft ease .3s, fadeOut linear 1s ${notification['duration']}s forwards`
    let iconDict = {
        success: 'fas fa-check-circle',
        info: 'fas fa-info-circle',
        warning: 'fas fa-exclamation-circle',
        error: 'fas fa-exclamation-circle'
    }
    let icon = iconDict[notification['type']]
    let autoRemoveId = setTimeout(function(){
        main.removeChild(toast);
    }, (notification['duration'] + 1) * 1000)
    toast.onclick = function(e){
        if (e.target.closest('.toast__close')){
            main.removeChild(toast)
            clearTimeout(autoRemoveId)
        }
    }
    toast.innerHTML = `
            <div class="toast__icon">
                <i class="${icon}"></i>
            </div>
            <div class="toast__body">
                <h3 class="toast__title">${notification['title']}</h3>
                <p class="toast__msg">${notification['message']}</p>
            </div>
            <div class="toast__close">
                <i class="fas fa-times"></i>
            </div>`
    main.appendChild(toast)
    
}

showSuccessToast = function(){
    toast({
        title: 'Success',
        message: 'Thông báo thành công',
        type: 'success',
        duration: 2
    })
}

showErrorToast = function(){
    toast({
        title: 'Error',
        message: 'Thông báo lỗi',
        type: 'error',
        duration: 2
    })
}


