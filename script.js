// ============================================
// CONFIGURATION - EDIT THESE SECTIONS
// ============================================

// Music Configuration
const MUSIC_CONFIG = {
  src: "edsheran.mp3",
  volume: 0.3,
}

// Photo Book Configuration
// Struktur data tetap sama, nanti kita pecah di Logic
const PHOTO_BOOK_DATA = [
  // Halaman 1 (Kiri & Kanan)
  {
    left: { 
      img: "images/first.jpg", // Pastikan folder 'images' ada
      caption: "Pertama Kali Kita Ketemu😆😆",
      desc: "(JUJUR AKU GROGI BGTTT, MAKANYA GAMAU BUKA HELM HEHEHHEHE)"
    },
    right: { 
      img: "images/second.jpg", 
      caption: "Pertama kali photobox yuhuuu📸",
      desc: "Ini pertama kalinya aku photobox dalams seumur hidup aku, bisa diliat dari muka aku kebanting banget sama kamu (cantik banget maksudnya)" 
    }
  },
  // Halaman 2 (Kiri & Kanan)
  {
    left: { 
      img: "images/bunga.jpg", 
      caption: "Bunga Pertama dari akuu🌹",
      desc: "Bunga pertama dari akuu, meskipun aku gabisa kasih secara langsung tapi aku seneng kamu sukaa. Next bunga ulang tahun aku kasih langsung aja ya😏😏" 
    },
    right: { 
      img: "images/fourth.jpg", 
      caption: "Photobox terkece kitaaa📸",
      desc: "Entah kenapa photobox di timezone malah lebih bagus jirrr, setuju ga kamu" 
    }
  },
  // Halaman 3 (Kiri & Kanan)
  {
    left: { 
      img: "images/fav.jpg", 
      caption: "SALAH SATU FOTO FAVORIT AKUU😍",
      desc: "Dari anglenya, warna kerudungnya, pencahayaan nya bagus banget...., eh tapi inima emang karena muka kamunya deh🫦🫦" 
    },
    right: { 
      // Karena gambar Anda cuma sampai img-5, kita pakai placeholder atau ulangi gambar
      img: "images/five.jpg", 
      caption: "Hyyy cewe kiw", 
      desc: "KENAPA BISA CANTIK TERUS SIH KASJDHAHUDHAWUAUIADSUBAA HAPPY BIRTHDAY BABEEEEEE🎉🎉🎉"
    }
  }
]

// ============================================
// MUSIC SYSTEM (Tidak berubah)
// ============================================
class MusicSystem {
  constructor() {
    this.audio = document.getElementById("bgMusic")
    this.toggle = document.getElementById("musicToggle")
    this.isPlaying = false
    this.hasUserInteracted = false

    this.audio.src = MUSIC_CONFIG.src
    this.audio.volume = MUSIC_CONFIG.volume

    this.toggle.addEventListener("click", () => this.toggleMusic())
    document.addEventListener("click", () => this.attemptAutoPlay())
    document.addEventListener("keydown", () => this.attemptAutoPlay())
  }

  attemptAutoPlay() {
    if (!this.hasUserInteracted) {
      this.hasUserInteracted = true
      this.play()
    }
  }

  play() {
    this.audio.play().catch((err) => { console.log("Autoplay prevented:", err) })
    this.isPlaying = true
    this.updateUI()
  }

  pause() {
    this.audio.pause()
    this.isPlaying = false
    this.updateUI()
  }

  toggleMusic() {
    if (this.isPlaying) { this.pause() } else { this.play() }
  }

  updateUI() {
    const status = this.toggle.querySelector(".music-status")
    if (this.isPlaying) {
      status.textContent = "Music On"
      this.toggle.style.background = "var(--primary-rose)"
    } else {
      status.textContent = "Music Off"
      this.toggle.style.background = "var(--neutral-warm-gray)"
    }
  }
}

// ============================================
// CANDLE SYSTEM (Tidak berubah)
// ============================================
class CandleSystem {
  constructor() {
    this.section = document.getElementById("candleSection")
    this.blowBtn = document.getElementById("blowBtn")
    this.closeBtn = document.getElementById("closeCandle")
    this.flames = document.querySelectorAll(".flame")
    this.allBlown = false
    this.audioContext = null
    this.analyser = null
    this.microphone = null
    this.isListening = false

    // Event Listeners
    document.getElementById("exploreBtn").addEventListener("click", () => this.open())
    this.blowBtn.addEventListener("click", () => this.animateBlowOut())
    this.closeBtn.addEventListener("click", () => this.close())
  }

  open() {
    this.section.classList.add("active")
    this.resetFlames()
    
    // Coba aktifkan mikrofon saat popup lilin muncul
    setTimeout(() => {
        this.setupMicrophoneDetection()
    }, 500)
  }

  close() {
    this.section.classList.remove("active")
    this.stopMicrophone()
  }

  resetFlames() {
    this.flames.forEach((flame) => flame.classList.remove("blown"))
    this.allBlown = false
  }

  animateBlowOut() {
    if (this.allBlown) return

    // Animate flames extinguishing
    this.flames.forEach((flame, index) => {
      setTimeout(() => {
        flame.classList.add("blown")
      }, index * 150)
    })

    this.allBlown = true
    this.showBlowMessage()
    
    // Matikan mic setelah lilin mati
    this.stopMicrophone()
  }

  showBlowMessage() {
    const messages = [
      "AAMIINNNN!",
      "SAMA AKU TERUS YAAA!"
    ]
    const msg = messages[Math.floor(Math.random() * messages.length)]
    
    const msgEl = document.createElement("div")
    msgEl.textContent = msg
    msgEl.style.cssText = `
            position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
            background: var(--primary-rose); color: white; padding: 1.5rem 2.5rem;
            border-radius: 50px; font-weight: 600; z-index: 300;
            animation: messageFloat 2s ease-out forwards; box-shadow: var(--shadow-lg);
        `
    document.body.appendChild(msgEl)
    setTimeout(() => msgEl.remove(), 2000)
  }

  async setupMicrophoneDetection() {
    if (this.allBlown || this.isListening) return

    try {
      // Minta izin user
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      
      this.isListening = true
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      this.analyser = this.audioContext.createAnalyser()
      this.microphone = this.audioContext.createMediaStreamSource(stream)
      
      this.microphone.connect(this.analyser)
      this.analyser.fftSize = 256
      
      this.detectBlow()
      
      console.log("Microphone connected! Blow to extinguish.")
      
    } catch (err) {
      console.log("Microphone access denied or error:", err)
      // Jika user menolak, ubah teks hint
      const hint = document.querySelector(".hint")
      if(hint) hint.textContent = "Microphone access denied. Please use the button."
    }
  }

  detectBlow() {
    if (!this.isListening || this.allBlown) return

    const bufferLength = this.analyser.frequencyBinCount
    const dataArray = new Uint8Array(bufferLength)
    this.analyser.getByteFrequencyData(dataArray)

    // Hitung rata-rata volume suara
    let sum = 0
    for(let i = 0; i < bufferLength; i++) {
        sum += dataArray[i]
    }
    const average = sum / bufferLength

    // THRESHOLD: Sesuaikan angka ini (50-80 biasanya oke)
    // Jika rata-rata volume suara di atas 60, dianggap meniup
    if (average > 60) {
        this.animateBlowOut()
    }

    // Loop pengecekan
    requestAnimationFrame(() => this.detectBlow())
  }

  stopMicrophone() {
    this.isListening = false
    if (this.audioContext) {
        this.audioContext.close()
        this.audioContext = null
    }
  }

}

// ============================================
// PHOTO BOOK SYSTEM (UPDATED FOR TURN.JS)
// ============================================
class PhotoBook {
  constructor() {
    this.flipbook = $("#flipbook"); // jQuery selector for Turn.js
    this.initBook();
    this.setupNavigation();
  }

  initBook() {
    const bookContainer = document.getElementById("flipbook");
    
    // 1. Buat Cover Depan (Hard Cover)
    const cover = document.createElement('div');
    cover.className = 'hard';
    cover.innerHTML = `<h2>Beberapa Foto-Foto yang Paling Berkesan<br><small style="font-size:1rem; opacity:0.8">PELAN PELAN YAA</small></h2>`;
    bookContainer.appendChild(cover);
    
    // 2. Buat Halaman Dalam (Normal Pages)
    // Turn.js membaca halaman berurutan. Karena struktur data kita {left, right},
    // kita perlu memecahnya menjadi div individu.
    PHOTO_BOOK_DATA.forEach(spread => {
        this.createPageElement(bookContainer, spread.left);
        this.createPageElement(bookContainer, spread.right);
    });

    // 3. Buat Cover Belakang (Hard Cover)
    const backCover = document.createElement('div');
    backCover.className = 'hard';
    backCover.innerHTML = `<h2>To Be Continued...<br><small>❤️</small></h2>`;
    bookContainer.appendChild(backCover);

    // 4. Initialize Turn.js
    this.flipbook.turn({
        width: 900,
        height: 600,
        autoCenter: true,
        duration: 1000, // Durasi animasi lebih lambat agar romantis
        acceleration: true,
        gradients: true,
        elevation: 50,
        when: {
            turning: function(e, page, view) {
                // Play sound effect here if you want (paper flip sound)
            }
        }
    });
  }

  createPageElement(container, data) {
      const page = document.createElement('div');
      page.className = 'page';

      // Cek apakah ada deskripsi tambahan?
      // Jika ada, buat elemen paragraf <p class="page-description">. Jika tidak, kosongkan.
      const descriptionHTML = data.desc ? `<p class="page-description">${data.desc}</p>` : '';

      // Masukkan gambar, caption utama, DAN deskripsi tambahan ke dalam HTML
      page.innerHTML = `
        <div class="page-content">
            <img src="${data.img}" alt="${data.caption}" />
            <div class="text-container">
                <h3 class="page-caption">${data.caption}</h3>
                ${descriptionHTML}
            </div>
        </div>
      `;
      container.appendChild(page);
  }

  setupNavigation() {
    // Gunakan jQuery event handler agar konsisten dengan Turn.js
    $("#prevBtn").click(() => {
        this.flipbook.turn("previous");
    });

    $("#nextBtn").click(() => {
        this.flipbook.turn("next");
    });

    // Keyboard navigation
    $(document).keydown((e) => {
        if (e.keyCode == 37) this.flipbook.turn("previous");
        if (e.keyCode == 39) this.flipbook.turn("next");
    });
  }
}

// ============================================
// FLOATING HEARTS BACKGROUND SYSTEM
// ============================================
class HeartBackground {
    constructor() {
        this.canvas = document.getElementById('heartCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.hearts = [];
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Warna hati (sesuai tema: Rose, Peach, Gold)
        this.colors = ['#c97d8a', '#d9a89f', '#d4a574', '#f0e5e0'];
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        // Interaksi Mouse
        window.addEventListener('mousemove', (e) => this.addHeart(e.clientX, e.clientY));
        window.addEventListener('touchmove', (e) => this.addHeart(e.touches[0].clientX, e.touches[0].clientY));

        // Mulai animasi
        this.init();
        this.animate();
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    init() {
        // Buat beberapa hati awal secara acak
        for (let i = 0; i < 15; i++) {
            this.addHeart(Math.random() * this.width, Math.random() * this.height, true);
        }
    }

    addHeart(x, y, random = false) {
        // Jika random (awal), size acak. Jika dari mouse, size lebih kecil/rapi.
        this.hearts.push({
            x: x,
            y: y,
            size: random ? Math.random() * 20 + 10 : Math.random() * 10 + 5,
            color: this.colors[Math.floor(Math.random() * this.colors.length)],
            speedY: Math.random() * 1 + 0.5, // Kecepatan naik
            speedX: Math.random() * 2 - 1,   // Goyang kiri kanan
            opacity: 1,
            fade: Math.random() * 0.01 + 0.005
        });
    }

    drawHeart(x, y, size, color, opacity) {
        this.ctx.globalAlpha = opacity;
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        // Rumus menggambar bentuk hati
        let topCurveHeight = size * 0.3;
        this.ctx.moveTo(x, y + topCurveHeight);
        this.ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x - size / 2, y + (size + topCurveHeight) / 2, x, y + (size * 1.5), x, y + (size * 1.5));
        this.ctx.bezierCurveTo(x, y + (size * 1.5), x + size / 2, y + (size + topCurveHeight) / 2, x + size / 2, y + topCurveHeight);
        this.ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + topCurveHeight);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.globalAlpha = 1;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        for (let i = 0; i < this.hearts.length; i++) {
            let h = this.hearts[i];
            
            // Update posisi
            h.y -= h.speedY; // Bergerak ke atas
            h.x += Math.sin(h.y * 0.01) * 0.5; // Efek melayang (sinewave)
            h.opacity -= h.fade; // Perlahan menghilang

            // Gambar
            this.drawHeart(h.x, h.y, h.size, h.color, h.opacity);

            // Hapus hati yang sudah pudar
            if (h.opacity <= 0) {
                this.hearts.splice(i, 1);
                i--;
            }
        }

        // Tambahkan hati otomatis sesekali agar tidak kosong
        if (this.hearts.length < 20) { 
             this.addHeart(Math.random() * this.width, this.height + 20, true);
        }

        requestAnimationFrame(() => this.animate());
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
class SmoothScroll {
  constructor() {
    document.getElementById("exploreBtn").addEventListener("click", () => {
      setTimeout(() => {
        document.getElementById("bookSection").scrollIntoView({
          behavior: "smooth",
        })
      }, 500)
    })
  }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener("DOMContentLoaded", () => {
  new MusicSystem()
  new CandleSystem()
  new PhotoBook() // Now uses Turn.js logic
  new SmoothScroll()
  new HeartBackground()

  const style = document.createElement("style")
  style.textContent = `
        @keyframes messageFloat {
            0% { opacity: 1; transform: translate(-50%, -50%) scale(0.8); }
            100% { opacity: 0; transform: translate(-50%, -150%) scale(1); }
        }
    `
  document.head.appendChild(style)
})