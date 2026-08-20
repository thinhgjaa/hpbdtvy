document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader Logic
    const preloader = document.getElementById('preloader');
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    let loadProgress = 0;

    // Simulate loading
    const loadInterval = setInterval(() => {
        if (loadProgress < 90) {
            loadProgress += Math.random() * 8;
            if (loadProgress > 90) loadProgress = 90;
            if (loadingBar) loadingBar.style.width = `${loadProgress}%`;
            if (loadingText) loadingText.innerHTML = `Đang tải bảo bối từ túi thần kỳ cho Thanh Vy... ${Math.floor(loadProgress)}%`;
        }
    }, 250);

    window.addEventListener('load', () => {
        clearInterval(loadInterval);
        if (loadingBar) loadingBar.style.width = `100%`;
        if (loadingText) loadingText.innerHTML = `Đang tải bảo bối từ túi thần kỳ cho Thanh Vy... 100%`;
        setTimeout(() => {
            if (preloader) preloader.classList.add('hidden');
        }, 2000);
    });

    // Typewriter Utility Function
    function typeWriterEffect(element, text, speed, callback) {
        element.innerHTML = '';
        let i = 0;
        if (element.typingTimeout) clearTimeout(element.typingTimeout);

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                element.typingTimeout = setTimeout(type, speed);
            } else if (callback) {
                callback();
            }
        }
        type();
    }

    // --- HAPTIC FEEDBACK UTILITY ---
    function triggerHaptic(pattern = 50) {
        if (typeof navigator !== 'undefined' && navigator.vibrate) {
            try {
                navigator.vibrate(pattern);
            } catch (e) {
                // Ignore if browser policy restricts
            }
        }
    }

    const bookWrapper = document.getElementById('bookWrapper');
    const scene = document.getElementById('scene');
    const book = document.getElementById('book');
    const audio = document.getElementById('bgMusic');
    const countdownAudio = document.getElementById('countdownMusic');
    const soundBtn = document.getElementById('soundBtn');

    // Page Elements (4 Papers)
    const paper1 = document.getElementById('p1');
    const paper2 = document.getElementById('p2');
    const paper3 = document.getElementById('p3');
    const paper4 = document.getElementById('p4');
    const papers = [paper1, paper2, paper3, paper4];

    // Nav Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const closeBookBtn = document.getElementById('closeBookBtn');

    // --- WEB AUDIO API FOR SOUND EFFECTS ---
    let audioCtx;
    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') audioCtx.resume();
    }

    function playPopSound() {
        if (!audioCtx) return;
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.5, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    }

    function playPaperSound() {
        if (!audioCtx) return;
        const bufferSize = audioCtx.sampleRate * 0.2;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 3000;
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noise.start();
    }

    function playPageFlipSound() {
        if (!audioCtx) return;
        const duration = 0.22;
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(4000, audioCtx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + duration);
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.35, audioCtx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noise.start();
    }

    // --- AUDIO DUCKING (Smooth Volume Transition) ---
    let audioDuckInterval = null;
    function duckAudio(isDucked) {
        if (!audio || isMuted) return;
        if (audioDuckInterval) clearInterval(audioDuckInterval);
        const targetVolume = isDucked ? 0.28 : 0.8;
        const step = isDucked ? -0.05 : 0.05;

        audioDuckInterval = setInterval(() => {
            let currentVol = audio.volume;
            if ((isDucked && currentVol > targetVolume) || (!isDucked && currentVol < targetVolume)) {
                currentVol += step;
                if (currentVol < 0.25) currentVol = 0.25;
                if (currentVol > 0.8) currentVol = 0.8;
                audio.volume = currentVol;
            } else {
                audio.volume = targetVolume;
                clearInterval(audioDuckInterval);
            }
        }, 60);
    }

    let currentLocation = 1;
    let numOfPapers = 4;
    let maxLocation = numOfPapers + 1;

    // Sound Toggle Logic
    let isMuted = false;
    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            isMuted = !isMuted;
            if (audio) audio.muted = isMuted;
            if (countdownAudio) countdownAudio.muted = isMuted;
            soundBtn.innerHTML = isMuted ? '<i class="fa-solid fa-volume-xmark"></i>' : '<i class="fa-solid fa-volume-high"></i>';
        });
    }

    // Cinematic Flow Elements
    const startBtn = document.getElementById('start-btn');
    const mysteryGate = document.getElementById('mystery-gate');
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownNum = document.getElementById('countdown-number');
    const countdownText = document.getElementById('countdown-text');
    const clickBookHint = document.getElementById('clickBookHint');
    const candle = document.querySelector('.candle');
    const blowCandleBtn = document.getElementById('blowCandleBtn');
    const wishContainer = document.querySelector('.wish-container');

    const countdownMessages = [
        "Một ngày đặc biệt...",
        "Món quà thần kỳ dành cho Thanh Vy...",
        "Bắt đầu bữa tiệc nào!"
    ];

    let countdownValue = 3;

    function typeWriter(text, i, cb) {
        if (i < text.length) {
            countdownText.innerHTML += text.charAt(i);
            setTimeout(() => typeWriter(text, i + 1, cb), 50);
        } else {
            setTimeout(cb, 1500);
        }
    }

    startBtn.addEventListener('click', () => {
        initAudio();
        triggerHaptic([50, 40, 80]); // Haptic on pull cord

        // Start Countdown Audio
        if (countdownAudio && countdownAudio.paused) {
            countdownAudio.volume = 0.6;
            countdownAudio.play().catch(e => console.log(e));
        }

        // Hide Mystery Gate, Show Countdown
        mysteryGate.classList.add('hidden');
        countdownScreen.classList.remove('hidden');

        runCountdown();
    });

    function runCountdown() {
        if (countdownValue > 0) {
            triggerHaptic(60); // Haptic on each countdown second
            countdownNum.innerText = countdownValue;
            countdownText.innerHTML = "";
            typeWriter(countdownMessages[3 - countdownValue], 0, () => {
                countdownValue--;
                setTimeout(runCountdown, 200);
            });
        } else {
            if (countdownAudio) {
                // Fade out countdown audio
                let vol = countdownAudio.volume;
                const fadeAudio = setInterval(() => {
                    if (vol > 0.05) {
                        vol -= 0.05;
                        countdownAudio.volume = vol;
                    } else {
                        clearInterval(fadeAudio);
                        countdownAudio.pause();
                        countdownAudio.currentTime = 0;
                    }
                }, 100);
            }

            countdownNum.style.transition = "opacity 0.5s ease";
            countdownText.style.transition = "opacity 0.5s ease";
            countdownNum.style.opacity = "0";
            countdownText.style.opacity = "0";

            // 3.5s cinematic pause
            setTimeout(() => {
                countdownScreen.classList.add('hidden');

                // Play Grand Reveal Audio
                if (audio && audio.paused) {
                    audio.volume = 0.8;
                    audio.play().catch(e => console.log(e));
                }

                // Show the scene
                scene.classList.remove('hidden');

                // Pop confetti after reveal
                setTimeout(() => {
                    firePremiumConfetti(1.5);
                }, 2000);

                // Type out the wish instruction
                setTimeout(() => {
                    const wishText = document.getElementById('unifiedWishText') || document.querySelector('.wish-text');
                    if (wishText) {
                        typeWriterEffect(wishText, "Hãy nhắm mắt lại và ước một điều ước nhé... ✨", 40, () => {
                            setTimeout(() => {
                                if (blowCandleBtn) blowCandleBtn.classList.remove('hidden');
                            }, 1000);
                        });
                    }
                }, 5500);
            }, 3500);
        }
    }

    // Candle Blowing Logic
    blowCandleBtn.addEventListener('click', () => {
        if (!candle.classList.contains('blown-out')) {
            candle.classList.add('blown-out');
            triggerHaptic([80, 50, 150]); // Haptic when candle blown

            // Allow clicking through centerpiece to reach balloons behind
            const centerpiece = document.querySelector('.centerpiece');
            if (centerpiece) centerpiece.style.pointerEvents = 'none';

            blowCandleBtn.classList.add('hidden');
            const wishText = document.getElementById('unifiedWishText') || document.querySelector('.wish-text');
            if (wishText) {
                typeWriterEffect(wishText, "Điều ước của Thanh Vy nhất định sẽ thành sự thật... 💖", 40, () => {
                    setTimeout(() => {
                        typeWriterEffect(wishText, "🎈 Hãy chạm vào bóng bay để bắt lấy may mắn & bảo bối nhé!", 35, () => {
                            const balloonCounter = document.getElementById('balloonCounter');
                            if (balloonCounter) balloonCounter.classList.remove('hidden');
                        });
                    }, 2200);
                });
            }

            setTimeout(() => {
                firePremiumConfetti(1);
                document.querySelector('.balloons').classList.add('interactive');
            }, 800);
        }
    });

    // 1. Open Book (Move from corner to center)
    bookWrapper.addEventListener('click', (e) => {
        if (bookWrapper.classList.contains('in-center')) return;

        triggerHaptic([60, 40, 100]);
        firePremiumConfetti(1);

        bookWrapper.classList.remove('in-corner');
        bookWrapper.classList.add('in-center');
        scene.classList.add('blurred');
        clickBookHint.classList.add('hidden');
        duckAudio(true); // Soften bgMusic when opening book

        updateNavButtons();
    });

    // 2. Book Flipping Logic
    function updateNavButtons() {
        if (currentLocation === 1) {
            prevBtn.classList.add('disabled');
            nextBtn.classList.remove('disabled');
            book.classList.remove('open');
        }
        else if (currentLocation === maxLocation) {
            prevBtn.classList.remove('disabled');
            nextBtn.classList.add('disabled');
            book.classList.add('open');
        }
        else {
            prevBtn.classList.remove('disabled');
            nextBtn.classList.remove('disabled');
            book.classList.add('open');
        }
    }

    function goNextPage() {
        if (currentLocation < maxLocation) {
            playPageFlipSound();
            triggerHaptic(40);
            switch (currentLocation) {
                case 1:
                    paper1.classList.add('flipped');
                    paper1.style.zIndex = 1;
                    break;
                case 2:
                    paper2.classList.add('flipped');
                    paper2.style.zIndex = 2;
                    break;
                case 3:
                    paper3.classList.add('flipped');
                    paper3.style.zIndex = 3;
                    break;
                case 4:
                    paper4.classList.add('flipped');
                    paper4.style.zIndex = 4;
                    setTimeout(() => celebration(), 400); // Fireworks at final page!
                    break;
                default:
                    throw new Error("unknown state");
            }
            currentLocation++;
            updateNavButtons();
        }
    }

    function goPrevPage() {
        if (currentLocation > 1) {
            playPageFlipSound();
            triggerHaptic(40);
            switch (currentLocation) {
                case 2:
                    paper1.classList.remove('flipped');
                    paper1.style.zIndex = 4;
                    break;
                case 3:
                    paper2.classList.remove('flipped');
                    paper2.style.zIndex = 3;
                    break;
                case 4:
                    paper3.classList.remove('flipped');
                    paper3.style.zIndex = 2;
                    break;
                case 5:
                    paper4.classList.remove('flipped');
                    paper4.style.zIndex = 1;
                    break;
                default:
                    throw new Error("unknown state");
            }
            currentLocation--;
            updateNavButtons();
        }
    }

    // Event Listeners for Book Nav
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goNextPage(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goPrevPage(); });

    // Close Book logic
    closeBookBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerHaptic(40);

        currentLocation = 1;
        papers.forEach((p, idx) => {
            p.classList.remove('flipped');
            p.style.zIndex = 4 - idx;
        });
        updateNavButtons();
        duckAudio(false); // Restore background volume

        setTimeout(() => {
            bookWrapper.classList.remove('in-center', 'book-grand-reveal');
            bookWrapper.classList.add('in-corner');
            scene.classList.remove('blurred');
            clickBookHint.classList.remove('hidden');
        }, 500);
    });

    // --- TOUCH / SWIPE GESTURES FOR MOBILE ---
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    const bookContainer = document.querySelector('.book-container');
    if (bookContainer) {
        bookContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        bookContainer.addEventListener('touchend', (e) => {
            if (!bookWrapper.classList.contains('in-center')) return;
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipeGesture();
        }, { passive: true });
    }

    function handleSwipeGesture() {
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;
        // Prominent horizontal swipe
        if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 45) {
            if (diffX < 0) {
                // Swipe Left -> Next page
                goNextPage();
            } else {
                // Swipe Right -> Prev page
                goPrevPage();
            }
        }
    }

    // --- WISH BAG INVENTORY LOGIC ---
    const collectedWishes = [];
    let currentActiveWish = "";
    const wishBagBtn = document.getElementById('wishBagBtn');
    const wishBagCount = document.getElementById('wishBagCount');
    const wishBagModal = document.getElementById('wishBagModal');
    const wishBagList = document.getElementById('wishBagList');
    const closeWishBagBtn = document.getElementById('closeWishBagBtn');

    function addWishToBag(wishText) {
        if (!collectedWishes.includes(wishText)) {
            collectedWishes.push(wishText);
        }
        if (wishBagCount) wishBagCount.innerText = collectedWishes.length;
        if (wishBagBtn) {
            wishBagBtn.classList.remove('hidden');
            wishBagBtn.classList.remove('bounce');
            void wishBagBtn.offsetWidth; // trigger reflow
            wishBagBtn.classList.add('bounce');
        }
    }

    if (wishBagBtn) {
        wishBagBtn.addEventListener('click', () => {
            triggerHaptic(50);
            renderWishBagList();
            if (wishBagModal) wishBagModal.classList.remove('hidden');
        });
    }

    if (closeWishBagBtn) {
        closeWishBagBtn.addEventListener('click', () => {
            if (wishBagModal) wishBagModal.classList.add('hidden');
        });
    }

    if (wishBagModal) {
        wishBagModal.addEventListener('click', (e) => {
            if (e.target === wishBagModal) {
                wishBagModal.classList.add('hidden');
            }
        });
    }

    function renderWishBagList() {
        if (!wishBagList) return;
        if (collectedWishes.length === 0) {
            wishBagList.innerHTML = '<p style="text-align:center; color:#888; font-style:italic;">Chưa có món bảo bối nào. Hãy đập bóng bay để thu thập nhé!</p>';
            return;
        }
        wishBagList.innerHTML = collectedWishes.map((wish, index) => `
            <div class="wish-bag-item">
                <strong style="color:#ff4757;">#${index + 1}:</strong> ${wish}
            </div>
        `).join('');
    }

    // Premium Confetti
    const colors = ['#ff9ff3', '#feca57', '#48dbfb', '#ff6b81'];
    const confettiCanvas = document.getElementById('confetti');
    const myConfetti = confetti.create(confettiCanvas, {
        resize: true,
        useWorker: false
    });

    function firePremiumConfetti(ratio) {
        myConfetti({
            particleCount: Math.floor(150 * ratio),
            spread: 120,
            origin: { y: 0.6 },
            colors: colors,
            disableForReducedMotion: true
        });
    }

    function celebration() {
        const duration = 3.5 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            myConfetti({
                particleCount: 6,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            myConfetti({
                particleCount: 6,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());
    }

    // Wish Tooltip & Pop Balloon logic (35 Iconic Non-Overlapping Doraemon Gadgets & Wishes)
    const allBalloons = document.querySelectorAll('.balloon');
    const randomWishes = [
        "🎒 Nhận được Chong Chóng Tre! Chúc Thanh Vy tuổi mới tự do bay cao bay xa, chạm đến mọi ước mơ hoài bão! 🚀",
        "🚪 Nhận được Cánh Cửa Thần Kỳ! Mở ra cánh cửa dẫn lối đến những chân trời du lịch mới và trải nghiệm kỳ thú! ✈️🌍",
        // "🍞 Nhận được Bánh Mì Chuyển Ngữ! Chúc Thanh Vy giao tiếp khéo léo, kết nối vạn người thương và luôn được yêu quý! 💬✨",
        // "⏱️ Nhận được Cỗ Máy Thời Gian! Chúc Thanh Vy luôn trân trọng từng phút giây thanh xuân tươi đẹp và rạng ngời! ⏳💖",
        // "🔦 Nhận được Đèn Pin Thu Nhỏ! Mọi khó khăn, áp lực và muộn phiền trong cuộc sống đều sẽ thu bé lại xíu xiu rồi biến mất! 🪄💫",
        // "🏮 Nhận được Đèn Pin Phóng To! Chúc niềm vui, sự tự tin và may mắn của Thanh Vy được phóng to gấp ngàn lần! 🌟📈",
        // "🕰️ Nhận được Khăn Trùm Thời Gian! Tuổi mới luôn giữ mãi nét tươi trẻ, da dẻ mịn màng và thần thái rạng rỡ! 🌸💆‍♀️",
        // "💊 Nhận được Bánh Mì Ghi Nhớ! Học gì hiểu nấy, làm việc thăng hoa, thi cử hanh thông và luôn đứng đầu bảng vàng! 📚💯",
        // "📷 Nhận được Máy Ảnh Tạo Mốt! Chúc Thanh Vy mỗi ngày bước ra đường đều xinh đẹp ngút ngàn, ăn diện cực chất và sang chảnh! 👗👠",
        // "☁️ Nhận được Mây Đông Đặc! Chúc Thanh Vy luôn có những giấc ngủ thật êm ái, bồng bềnh và không bao giờ mất ngủ! 🛌💤",
        // "📞 Nhận được Điện Thoại Yêu Cầu! Bất cứ điều ước hay kế hoạch nào Thanh Vy ấp ủ đều sẽ trở thành hiện thực rực rỡ! 🍀📞",
        // "🍰 Nhận được Bánh Rán Dorayaki Thượng Hạng! Chúc Thanh Vy thỏa sức ăn ngon cả thế giới mà dáng vẫn luôn chuẩn đẹp! 🧁😋",
        // "🎀 Nhận được Nơ Đổi Giọng! Chúc Thanh Vy nói lời nào cũng ngọt ngào, truyền cảm hứng và mang lại tiếng cười cho mọi người! 🎤🎶",
        // "💍 Nhận được Vòng Xuyên Thấu! Chúc Thanh Vy dễ dàng vượt qua mọi rào cản và thử thách trong công việc lẫn cuộc sống! 🎯🔓",
        // "🪞 Nhận được Gương Nhân Đôi! Chúc tài lộc, may mắn và số dư tài khoản của Thanh Vy cứ thế tự động nhân đôi liên tục! 💰💳",
        // "🧥 Nhận được Áo Choàng Tàng Hình! Chúc Thanh Vy luôn được bảo bọc an toàn, tránh xa mọi thị phi, rắc rối và năng lượng tiêu cực! 🛡️🍃",
        // "✏️ Nhận được Bút Chì Máy Tính! Mọi bài toán hay quyết định trong cuộc sống đều được giải quyết nhanh gọn, sáng suốt và chính xác! 🧠💡",
        // "🌬️ Nhận được Pháo Không Khí! Thổi bay mọi cơn stress, mệt mỏi trong tích tắc, trả lại tâm hồn sảng khoái và tràn đầy năng lượng! 💨🔥",
        // "⏳ Nhận được Đồng Hồ Ngưng Đọng Thời Gian! Những khoảnh khắc hạnh phúc bên gia đình và người thân yêu sẽ mãi đọng lại ngọt ngào! 🕰️💐",
        // "🍄 Nhận được Đèn Phục Hồi! Chúc sức khỏe của Thanh Vy luôn dồi dào, hồi phục năng lượng siêu tốc sau mỗi ngày bận rộn! ⚡💪",
        // "👟 Nhận được Giày Đi Vào Tranh! Chúc cuộc đời của Thanh Vy rực rỡ và lãng mạn như bước ra từ câu chuyện cổ tích đẹp nhất! 📖✨",
        // "🎋 Nhận được Cây Điều Ước! Cầu được ước thấy, mọi tâm nguyện của Thanh Vy trong tuổi mới đều sẽ sớm đơm hoa kết trái! 🎋🌠",
        // "🧲 Nhận được Nam Châm Tình Bạn! Luôn được bao quanh bởi những người bạn chân thành, tri kỷ và luôn sẵn sàng sẻ chia! 🤝❤️",
        // "🪶 Nhận được Lông Vũ Trọng Lượng! Chúc tâm hồn Thanh Vy luôn nhẹ tênh, thong dong bước qua giông bão với nụ cười trên môi! 🪶🕊️",
        // "🌧️ Nhận được Cây Dù Tình Yêu! Chúc Thanh Vy luôn được yêu thương, có một tình cảm thật dịu dàng che chở và đồng hành! ☂️💑",
        // "🍵 Nhận được Trà Thấu Hiểu! Luôn có một nội tâm an yên, sáng suốt và tìm thấy sự bình yên sâu lắng trong tâm hồn! 🍵🧘‍♀️",
        // "🚀 Nhận được Tàu Vũ Trụ Mini! Chúc sự nghiệp và học tập của Thanh Vy cất cánh bay vút lên những đỉnh cao mới! 🌌🏆",
        // "🥊 Nhận được Găng Tay Siêu Nhân! Trao cho Thanh Vy sức mạnh kiên cường để tự tay gặt hái những thành công rực rỡ nhất! 🥊🔥",
        // "🖌️ Nhận được Bút Vẽ Đồ Thật! Mọi ý tưởng sáng tạo trong đầu Thanh Vy đều sẽ được hiện thực hóa một cách hoàn hảo! 🖌️🌈",
        // "🫧 Nhận được Bong Bóng Bảo Vệ! Giữ cho Thanh Vy luôn vô ưu vô lo, được yêu thương và nâng niu trong thế giới của riêng mình! 🫧👑",
        // "🧭 Nhận được La Bàn Hạnh Phúc! Dù đi bất cứ đâu, la bàn cuộc đời cũng sẽ luôn chỉ đúng hướng dẫn lối Thanh Vy đến niềm vui ngập tràn! 🧭☀️",
        // "🪙 Nhận được Đồng Xu May Mắn! Ra đường gặp quý nhân, làm việc gặp thời cơ, vạn sự hanh thông như ý! 🍀✨",
        // "📻 Nhận được Chiếc Loa Cảm Hứng! Mỗi ngày thức dậy đều tràn đầy cảm hứng, năng lượng tích cực và nhiệt huyết tuổi trẻ! 📻🎉",
        // "🎁 Nhận được Hộp Quà Thần Kỳ! Cuộc sống tuổi mới của Thanh Vy sẽ luôn ngập tràn những món quà bất ngờ đáng yêu mỗi ngày! 🎁🎊",
        "🌟 Nhận được Ngôi Sao May Mắn & Túi Thần Kỳ! Toàn bộ vũ trụ gửi đến Thanh Vy muôn vàn phước lành, tình yêu thương và nụ cười rạng rỡ nhất! 🌟🥰"
    ];

    let availableWishes = [...randomWishes];

    // "Nhận 💌" button event
    const acceptWishBtn = document.getElementById('acceptWishBtn');
    if (acceptWishBtn) {
        acceptWishBtn.addEventListener('click', () => {
            triggerHaptic(50);
            const wishPaperNote = document.getElementById('wishPaperNote');
            if (wishPaperNote) wishPaperNote.classList.add('hidden');
            acceptWishBtn.classList.add('hidden');

            // Add current wish to Bag
            if (currentActiveWish) {
                addWishToBag(currentActiveWish);
            }

            // Resume game
            document.querySelector('.balloons').classList.add('interactive');

            // Check game over
            checkGameOver();
        });
    }

    function updateHUD() {
        const totalBalloons = allBalloons.length;
        const clickedBalloons = document.querySelectorAll('.balloon.clicked, .balloon.popped').length;
        const counterEl = document.getElementById('balloonCounterText');
        if (counterEl) {
            counterEl.innerText = `${clickedBalloons}/${totalBalloons}`;
            const hud = document.getElementById('balloonCounter');
            if (hud) {
                hud.classList.remove('hidden');
                hud.style.transform = 'scale(1.15)';
                setTimeout(() => hud.style.transform = '', 250);
            }
        }

        // Quả bóng thứ 12 sẽ xuất hiện từ dưới lên khi 11 quả kia đã bị đập
        if (totalBalloons - clickedBalloons === 1) {
            const bossBalloon = document.getElementById('bossBalloon');
            if (bossBalloon && bossBalloon.style.display === 'none') {
                bossBalloon.style.display = 'block';
                bossBalloon.classList.add('is-last-balloon');
                document.querySelector('.balloons').style.zIndex = '999';

                const miniBook = document.createElement('div');
                miniBook.className = 'mini-book-tie';
                miniBook.innerHTML = '<div class="mini-book-icon"><div class="border-decor"></div><i class="fa-solid fa-cake-candles crown-icon"></i><div class="title">Những Lời<br>Muốn Nói</div></div>';
                bossBalloon.appendChild(miniBook);
            }
        }
    }

    // Grand Finale: Auto-reveal and auto-open book
    function checkGameOver() {
        const totalBalloons = allBalloons.length;
        const clickedBalloons = document.querySelectorAll('.balloon.clicked, .balloon.popped').length;
        if (clickedBalloons === totalBalloons) {
            setTimeout(() => {
                const wishText = document.getElementById('unifiedWishText') || document.querySelector('.wish-text');
                if (wishText) {
                    typeWriterEffect(wishText, "🎉 Tuyệt vời! Hãy mở quyển nhật ký ở góc dưới nhé! 📖", 40);
                }

                const hud = document.getElementById('balloonCounter');
                if (hud) hud.classList.add('hidden');

                triggerHaptic([100, 50, 100, 50, 200]);
                firePremiumConfetti(2.2);

                // Quyển sổ văng thẳng ra giữa màn hình với hào quang vàng lung linh
                bookWrapper.classList.remove('hidden', 'in-corner');
                bookWrapper.classList.add('in-center', 'book-grand-reveal');
                scene.classList.add('blurred');
                duckAudio(true);
                updateNavButtons();

                // Tự động lật mở trang 1 sau 900ms để Thanh Vy chiêm ngưỡng bìa rồi thấy ngay lời chúc & ảnh
                setTimeout(() => {
                    if (currentLocation === 1) {
                        goNextPage();
                    }
                }, 900);

            }, 350);
        }
    }

    allBalloons.forEach(balloon => {
        const tag = balloon.querySelector('.paper-tag');
        const tooltip = balloon.querySelector('.balloon-tooltip');

        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!document.querySelector('.balloons').classList.contains('interactive')) return;
            if (balloon.classList.contains('clicked')) return;

            if (tag && tooltip) {
                // Balloon WITH a tag -> Open Wish
                if (tag.classList.contains('opened')) return;

                triggerHaptic(50);
                document.querySelector('.balloons').classList.remove('interactive');

                if (availableWishes.length === 0) {
                    availableWishes = [...randomWishes];
                }
                const randomIndex = Math.floor(Math.random() * availableWishes.length);
                const randomWish = availableWishes.splice(randomIndex, 1)[0];
                currentActiveWish = randomWish;

                tooltip.innerHTML = randomWish;
                playPaperSound();

                tooltip.classList.add('show');
                tag.classList.add('opened');
                balloon.classList.add('clicked');

                const wishPaperNote = document.getElementById('wishPaperNote');
                const wishPaperText = document.getElementById('wishPaperText');
                if (wishPaperNote && wishPaperText) {
                    wishPaperNote.classList.remove('hidden');
                    if (acceptWishBtn) acceptWishBtn.classList.add('hidden');

                    typeWriterEffect(wishPaperText, randomWish, 35, () => {
                        if (acceptWishBtn) acceptWishBtn.classList.remove('hidden');
                    });
                }

                myConfetti({ particleCount: 25, spread: 55, origin: { y: 0.8 }, colors: colors, zIndex: 3000 });
                updateHUD();

            } else {
                // Balloon WITHOUT a tag -> Pop!
                if (balloon.classList.contains('popped')) return;

                triggerHaptic(70);
                balloon.classList.add('popped');
                balloon.classList.add('clicked');

                playPopSound();

                const rect = balloon.getBoundingClientRect();
                const x = (rect.left + rect.width / 2) / window.innerWidth;
                const y = (rect.top + rect.height / 2) / window.innerHeight;

                myConfetti({
                    particleCount: 40,
                    spread: 70,
                    origin: { x: x, y: y },
                    colors: colors,
                    zIndex: 3000
                });

                updateHUD();
                checkGameOver();
            }
        });
    });
});
