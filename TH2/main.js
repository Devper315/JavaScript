$ = document.querySelector.bind(document)
$$ = document.querySelectorAll.bind(document)
let heading = $('header h2')
let cdThumb = $('.cd-thumb')
let audio = $('#audio')
let cd = $('.cd')
let playBtn = $('.btn.btn-toggle-play')
let player = $('.player')
let progressBar = $('#progress')
let prevBtn = $('.btn-prev')
let nextBtn = $('.btn-next')
let randomBtn = $('.btn-random')
let repeatBtn = $('.btn-repeat')
let playlist = $('.playlist')
let PLAYER_STORAGE_KEY = 'DEVPER315'

const app = {
    currentPosition: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songList: [
        {
            name: 'Buông tay',
            singer: 'La Thăng - Khởi My',
            path: './assets/music/Buông tay.mp3',
            image: './assets/img/Buông tay.png',
        },
        {
            name: 'Khúc hát mừng sinh nhật',
            singer: 'Phan Đinh Tùng',
            path: './assets/music/Khúc hát mừng sinh nhật.mp3',
            image: './assets/img/Khúc hát mừng sinh nhật.jpg',
        },
        {
            name: 'Buông tay 2',
            singer: 'La Thăng - Khởi My',
            path: './assets/music/Buông tay.mp3',
            image: './assets/img/Buông tay.png',
        },
        {
            name: 'Khúc hát mừng sinh nhật 2',
            singer: 'Phan Đinh Tùng',
            path: './assets/music/Khúc hát mừng sinh nhật.mp3',
            image: './assets/img/Khúc hát mừng sinh nhật.jpg',
        },
        {
            name: 'Buông tay 3',
            singer: 'La Thăng - Khởi My',
            path: './assets/music/Buông tay.mp3',
            image: './assets/img/Buông tay.png',
        },
        {
            name: 'Khúc hát mừng sinh nhật 3',
            singer: 'Phan Đinh Tùng',
            path: './assets/music/Khúc hát mừng sinh nhật.mp3',
            image: './assets/img/Khúc hát mừng sinh nhật.jpg',
        },
    ],

    render: function () {
        const songhtmls = this.songList.map((song, index) => {
            return `<div class="song ${index === this.currentPosition ? 'active' : ''}" data-index="${index}">
                        <div class="thumb" style="background-image: url('${song.image}')"></div>
                        <div class="body">
                            <h3 class="title">${song.name}</h3>
                            <p class="author">${song.singer}</p>
                        </div>
                        <div class="option">
                            <i class="fas fa-ellipsis-h"></i>
                        </div>
                    </div>`
        })
        $('.playlist').innerHTML = songhtmls.join('')
    },

    handleEvents: function () {
        let cdWidth = cd.offsetWidth
        let _this = this
        let cdThumbAnimation = cdThumb.animate([{ transform: 'rotate(360deg)' }], { 'duration': 10000, 'iterations': Infinity })
        cdThumbAnimation.pause()
        document.onscroll = function () {
            let scrollTop = window.scrollY
            let newCDWidth = cdWidth - scrollTop
            cd.style.width = newCDWidth > 0 ? newCDWidth + 'px' : 0
            cd.style.opacity = newCDWidth / cdWidth
        }
        playBtn.onclick = function () {
            if (!_this.isPlaying) {
                audio.play()
            }
            else {
                audio.pause()
            }
        }
        audio.onplay = function () {
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimation.play()
        }
        audio.onpause = function () {
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimation.pause()
        }
        audio.ontimeupdate = function () {
            if (audio.duration) {
                let progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progressBar.value = progressPercent
            }
        }
        progressBar.onchange = function (e) {
            let seekTime = audio.duration * (e.target.value / 100)
            audio.currentTime = seekTime
        }
        prevBtn.onclick = function () {
            if (_this.isRandom) _this.randomSong()

            else {
                _this.prevSong()

            }
            audio.play()
            _this.reRender()
        }
        audio.onended = nextBtn.onclick = function () {
            if (_this.isRandom) _this.randomSong()
            else if (_this.isRepeat){
                audio.play()
            }
            else {
                _this.nextSong()

            }
            audio.play()
            _this.reRender()
            _this.scrollToActiveSong()

        }
        randomBtn.onclick = function () {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active')
            _this.setConfig('isRandom', _this.isRandom)
        }
        repeatBtn.onclick = function () {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active')
            _this.setConfig('isRepeat', _this.isRepeat)
        }
        playlist.onclick = function (e){
            let songNode = e.target.closest('.song:not(.active)')
            if (songNode){
                _this.currentPosition = songNode.dataset.index
                _this.loadCurrentSong()
                audio.play()
                _this.reRender()
            }
            if (e.target.closest('.option')){

            }
        }

    },

    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songList[this.currentPosition]
            }
        })
    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function () {
        this.currentPosition = this.currentPosition != this.songList.length - 1 ? this.currentPosition += 1 : 0
        this.loadCurrentSong()
    },

    prevSong: function () {
        this.currentPosition = this.currentPosition != 0 ? this.currentPosition -= 1 : this.songList.length - 1
        this.loadCurrentSong()
    },

    randomSong: function () {
        let newIndex = Math.floor(Math.random() * this.songList.length)
        this.currentPosition = newIndex
        console.log('Random bài số: ', this.currentPosition)
        this.loadCurrentSong()
    },

    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        }, 300)
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeat = this.config.isRepeat
        randomBtn.classList.toggle('active', this.isRandom)
        repeatBtn.classList.toggle('active', this.isRepeat)
    },

    reRender: function(){
        let currentSong = $('.song.active')
        currentSong.classList.remove('active')
        let newSong = $(`.song[data-index="${this.currentPosition}"]`);
        newSong.classList.add('active')
        
    },


    start: function () {
        this.loadConfig()
        this.render()
        this.defineProperties()
        this.loadCurrentSong()
        this.handleEvents()
    },
}

app.start()