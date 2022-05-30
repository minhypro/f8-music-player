/***
 * 1 Render song
 * 2 Scroll top
 * 3 Play / pause / seek 
 * 4 CD rotate 
 * 5 Next / Prev
 * 6 Random
 * 7 Repeat 
 * 8 Active song
 * 9 Scroll active song into view
 * 10 Play song when click
 */

const PLAYER_STORAGE_KEY = 'minhy-player'

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const mainTitle = $('#title')
const cdThumb = $('.cd-thumb img')
const audio = $('#audio')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('.slider')
const nextBtn = $('.btn.next')
const prevBtn = $('.btn.prev')
const randomBtn =$('.btn.shuffle')
const repeatBtn =$('.btn.repeat')
const playlist = $('#playlist')

const app = {
    currentIndex: 0,
    isPlaying: false,
    isShuffle: false,
    isRepeat: false,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
            name: 'Chỉ còn một đêm1',
            author: 'Quang Hưng MasterD',
            path: './assets/music/song1.mp3',
            img: './assets/img/img1.jpg'
        },
        {
            name: 'Một người nhẹ nhàng hơn2',
            author: 'Trang, Tiên Tiên',
            path: './assets/music/song2.mp3',
            img: './assets/img/img2.jpg'
        },
        {
            name: 'Đoạn Tuyệt Nàng Đi (Lofi)3',
            author: 'Phát Huy',
            path: './assets/music/song3.mp3',
            img: './assets/img/img3.jpg'
        },
        {
            name: 'ĐỘng Phòng Hoa Chúc4',
            author: 'Lâm Chấn Khang, Jombie',
            path: './assets/music/song4.mp3',
            img: './assets/img/img4.jpg'
        },
        {
            name: 'Chỉ còn một đêm5',
            author: 'Quang Hưng MasterD2',
            path: './assets/music/song1.mp3',
            img: './assets/img/img1.jpg'
        },
        {
            name: 'Một người nhẹ nhàng hơn6',
            author: 'Trang, Tiên Tiên',
            path: './assets/music/song2.mp3',
            img: './assets/img/img2.jpg'
        },
        {
            name: 'Đoạn Tuyệt Nàng Đi (Lofi)7',
            author: 'Phát Huy',
            path: './assets/music/song3.mp3',
            img: './assets/img/img3.jpg'
        },
        {
            name: 'ĐỘng Phòng Hoa Chúc8',
            author: 'Lâm Chấn Khang, Jombie',
            path: './assets/music/song4.mp3',
            img: './assets/img/img4.jpg'
        },
        {
            name: 'Chỉ còn một đêm9',
            author: 'Quang Hưng MasterD2',
            path: './assets/music/song1.mp3',
            img: './assets/img/img1.jpg'
        },
        {
            name: 'Một người nhẹ nhàng hơn10',
            author: 'Trang, Tiên Tiên',
            path: './assets/music/song2.mp3',
            img: './assets/img/img2.jpg'
        },
        {
            name: 'Đoạn Tuyệt Nàng Đi (Lofi)11',
            author: 'Phát Huy',
            path: './assets/music/song3.mp3',
            img: './assets/img/img3.jpg'
        },
        {
            name: 'ĐỘng Phòng Hoa Chúc12',
            author: 'Lâm Chấn Khang, Jombie',
            path: './assets/music/song4.mp3',
            img: './assets/img/img4.jpg'
        }
    ],
    setConfig: function(key, value) {
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : '' }" data-index=${index}>
                    <div class="song-thumb">
                        <img src="${song.img}" alt="">
                    </div>
                    <div class="song-info">
                        <h4 class="song-title">${song.name}</h4>
                        <div class="song-singer">${song.author}</div>
                    </div>
                    <div class="song-setting">
                        <i class="fa-solid fa-ellipsis"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = htmls.join('')
    },
    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },
    handleEvents: function(e) {
        const cdWidth = cdThumb.offsetWidth
        const cdHeight = cdThumb.offsetHeight
        const _this = this

        // Handle scroll CD
        var scrollCD = cdThumb.animate(
            [{transform: 'rotate(360deg)'}],
            { duration: 50000,
            iterations: Infinity}
        )
        scrollCD.pause()
        
        // Handle scroll and zoom in/out CD thumbnail
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            const newCdHeight = cdHeight - scrollTop

            cdThumb.style.width = newCdWidth > 0 ? newCdWidth +'px' : 0
            cdThumb.style.height = newCdHeight > 0 ? newCdHeight +'px' : 0
            cdThumb.style.opacity = newCdHeight / cdHeight
        }

        // Handle play audio
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause()
            } else {
                audio.play()
            }
        }

        audio.onplay = function() {
            _this.isPlaying = true
            player.classList.add('playing')
            scrollCD.play()
        }

        audio.onpause = function() {
            _this.isPlaying = false
            player.classList.remove('playing')
            scrollCD.pause()
        }

        audio.ontimeupdate = function() {
            const progressPercent = audio.duration? (audio.currentTime / audio.duration *100) : 0
            progress.value = progressPercent
        }

        audio.onended = function() {
            if (_this.isRepeat) {
            }
            else if (_this.isShuffle) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
        }

        // Handle audio seeking
        progress.onchange = function(e) {
            const seekTime = e.target.value / 100 * audio.duration
            audio.currentTime = seekTime
        }

        // Handle next song 
        nextBtn.onclick = function() {
            if (_this.isShuffle) {
                _this.randomSong()
            } else {
                _this.nextSong()
            }   
            audio.play()
            _this.render()
            _this.scrollToActive()
        }

        // Handle prev song
        prevBtn.onclick = function() {
            _this.prevSong()
            audio.play()
            _this.render()
            _this.scrollToActive()
        }

        // Handle shuffle song
        randomBtn.onclick = function() {
            _this.isShuffle = !_this.isShuffle
            _this.setConfig('isShuffle', _this.isShuffle)
            randomBtn.classList.toggle('active', _this.isShuffle)
        }

        // Handle repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            _this.setConfig('isRepeat', _this.isRepeat)
            repeatBtn.classList.toggle('active', _this.isRepeat)
        }

        // Handle click on Playlist
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if ( songNode || e.target.closest('.song-setting') ) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                    console.log(songNode.dataset.index)
                }
            }
        }
        

    },
    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    randomSong: function() {
        var newIndex = Math.floor(Math.random()*this.songs.length)

        while (this.currentIndex == newIndex) {
            newIndex = Math.floor(Math.random()*this.songs.length)
        }
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActive: function() {
        setTimeout(function() {
            $('.song.active').scrollIntoView({
                behavior: "smooth", 
                block: "center"})
        }, 100)
    },
    loadConfig: function() {
        this.isRepeat = this.config.isRepeat
        this.isShuffle = this.config.isShuffle
    },
    loadCurrentSong: function() {
        cdThumb.src = this.currentSong.img
        mainTitle.textContent = this.currentSong.name
        audio.src = this.currentSong.path
    },
    start: function() {
        this.loadConfig()

        this.defineProperties()
        
        this.handleEvents()

        this.loadCurrentSong()

        this.render()

        this.scrollToActive()
        
        randomBtn.classList.toggle('active', this.isShuffle)
        repeatBtn.classList.toggle('active', this.isRepeat)
    }
}

app.start()