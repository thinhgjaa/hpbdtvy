document.addEventListener('DOMContentLoaded', () => {
    // 0. Asset Preloader Tracking
    const preloader = document.getElementById('preloader');
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    let isPreloaderFinished = false;
    let progressTicker = null;

    const preloadImages = [
        'image/doremon/fumble.jpg',
        'image/doremon/hpbd.png',
        'image/doremon/Doraemon_character.png',
        'image/doremon/1.jpg',
        'image/doremon/2.jpg',
        'image/doremon/3.jpg',
        'image/doremon/4.jpg',
        'image/doremon/5.jpg',
        'image/doremon/6.jpg',
        'image/doremon/7.png',
        'image/tvy/1.jpg',
        'image/tvy/2.jpg',
        'image/tvy/3.jpg',
        'image/tvy/4.jpg',
        'image/tvy/5.jpg',
        'image/tvy/6.jpg',
        'image/tvy/7.jpg'
    ];
    const preloadAudio = [
        'music/countdown.mp3',
        'music/hpbd.mp3'
    ];

    const totalAssets = preloadImages.length + preloadAudio.length;
    let loadedAssetsCount = 0;

    function checkAssetLoaded() {
        loadedAssetsCount++;
    }

    preloadImages.forEach(src => {
        const img = new Image();
        img.onload = checkAssetLoaded;
        img.onerror = checkAssetLoaded;
        img.src = src;
        if (img.complete) {
            checkAssetLoaded();
        }
    });

    preloadAudio.forEach(src => {
        const aud = new Audio();
        aud.preload = 'auto';
        aud.oncanplaythrough = () => { checkAssetLoaded(); aud.oncanplaythrough = null; };
        aud.onerror = checkAssetLoaded;
        aud.src = src;
    });

    // Hàm bắt đầu màn hình Doraemon load lục túi sau khi nhập đúng mật mã
    function startPreloadScreen() {
        if (!preloader) return;
        preloader.classList.remove('hidden');
        preloader.classList.remove('preloader-found');
        
        const panicStage = document.querySelector('.doraemon-panic-stage');
        if (panicStage) panicStage.classList.remove('found-gadget');

        const loaderBadge = document.getElementById('loaderBadge') || document.querySelector('.doraemon-badge');
        const loaderBadgeText = document.getElementById('loaderBadgeText');
        if (loaderBadge) loaderBadge.classList.remove('badge-found');
        if (loaderBadgeText) loaderBadgeText.innerHTML = 'NÓ ĐOU RỒI... NÓ ĐOU RỒI TAAA? 🎒🎁';

        let visualProgress = 0;
        const startTime = Date.now();
        const MIN_PRELOAD_DURATION = 5000; // Tăng thời gian Doraemon lục túi lên 5 giây để người xem ngắm lâu hơn và thích thú

        progressTicker = setInterval(() => {
            const elapsed = Date.now() - startTime;
            const timeRatio = Math.min(1, elapsed / MIN_PRELOAD_DURATION);
            const realAssetRatio = totalAssets > 0 ? (loadedAssetsCount / totalAssets) : 1;
            const targetPercent = Math.floor(Math.min(99, Math.max(timeRatio * 90, realAssetRatio * 90)));

            if (visualProgress < targetPercent) {
                visualProgress += Math.ceil((targetPercent - visualProgress) * 0.25);
                if (visualProgress > targetPercent) visualProgress = targetPercent;
                if (loadingBar) loadingBar.style.width = `${visualProgress}%`;
                if (loadingText) loadingText.innerHTML = `Đang chuẩn bị bảo bối từ túi thần kỳ cho Thanh Vy... ${visualProgress}%`;
            }

            if (loadedAssetsCount >= totalAssets && elapsed >= MIN_PRELOAD_DURATION && !isPreloaderFinished) {
                clearInterval(progressTicker);
                completePreload();
            }
        }, 50);

        // Fallback an toàn (tối đa 7.5s)
        setTimeout(() => {
            if (!isPreloaderFinished) {
                if (progressTicker) clearInterval(progressTicker);
                completePreload();
            }
        }, 7500);
    }

    function completePreload() {
        if (isPreloaderFinished) return;
        isPreloaderFinished = true;
        if (progressTicker) clearInterval(progressTicker);
        if (loadingBar) loadingBar.style.width = `100%`;
        if (loadingText) loadingText.innerHTML = `Đang chuẩn bị bảo bối từ túi thần kỳ cho Thanh Vy... 100%`;

        // Dừng hoạt ảnh lục túi hoảng loạn và chuyển sang trạng thái tìm thấy bảo bối
        const loaderBadge = document.getElementById('loaderBadge') || document.querySelector('.doraemon-badge');
        const loaderBadgeText = document.getElementById('loaderBadgeText');
        const panicStage = document.querySelector('.doraemon-panic-stage');

        if (preloader) preloader.classList.add('preloader-found');
        if (panicStage) panicStage.classList.add('found-gadget');

        // Đổi chữ thông báo thành: "A... TÌM THẤY RỒI! ✨🚪🎁"
        if (loaderBadge) {
            loaderBadge.classList.add('badge-found');
            if (loaderBadgeText) {
                loaderBadgeText.innerHTML = 'A... TÌM THẤY RỒI! ✨🚪🎁';
            } else {
                loaderBadge.innerHTML = '<i class="fa-solid fa-sparkles"></i> A... TÌM THẤY RỒI! ✨🚪🎁';
            }
        }

        // Dừng lại và giữ màn hình 2.2 giây để người dùng đọc thoải mái
        setTimeout(() => {
            // Ẩn preloader, chuyển mượt sang Giao diện Chuẩn Bị (Mystery Gate)
            if (preloader) preloader.classList.add('hidden');
            if (mysteryGate) {
                mysteryGate.classList.remove('hidden');
            }

            // Sau 8 giây thả dây kéo xuống để người xem kịp đọc hướng dẫn
            setTimeout(() => {
                if (startBtn) startBtn.classList.add('drop-cord-active');
            }, 8000);
        }, 2200);
    }

    // Typewriter Utility Function
    function typeWriterEffect(element, text, speed = 35, callback = null, allowSkip = false) {
        if (!element) {
            if (callback) callback();
            return () => { };
        }

        if (element._typingTimeout) clearTimeout(element._typingTimeout);
        if (element._skipHandler) {
            element.removeEventListener('click', element._skipHandler);
            element._skipHandler = null;
        }

        element.innerHTML = '';
        let i = 0;
        let isDone = false;

        function finishImmediately() {
            if (isDone) return;
            isDone = true;
            if (element._typingTimeout) clearTimeout(element._typingTimeout);
            element.innerHTML = text;
            if (element._skipHandler) {
                element.removeEventListener('click', element._skipHandler);
                element._skipHandler = null;
            }
            if (callback) callback();
        }

        if (allowSkip) {
            element._skipHandler = (e) => {
                if (!isDone) finishImmediately();
            };
            element.addEventListener('click', element._skipHandler);
        }

        function type() {
            if (isDone) return;
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                element._typingTimeout = setTimeout(type, speed);
            } else {
                finishImmediately();
            }
        }
        type();

        return finishImmediately;
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

    // Page Elements (All Papers dynamically queried)
    let papers = Array.from(document.querySelectorAll('.book .paper'));
    let numOfPapers = papers.length;
    let maxLocation = numOfPapers + 1;
    let currentLocation = 1;

    function resetPaperZIndices() {
        papers = Array.from(document.querySelectorAll('.book .paper'));
        numOfPapers = papers.length;
        maxLocation = numOfPapers + 1;
        papers.forEach((p, idx) => {
            if (p) {
                p.classList.remove('flipped');
                p.style.zIndex = numOfPapers - idx;
            }
        });
    }
    resetPaperZIndices();

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
        const now = audioCtx.currentTime;
        const duration = 0.18;
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.95 * b0 + white * 0.1;
            b1 = 0.85 * b1 + white * 0.2;
            const progress = i / bufferSize;
            data[i] = (b0 + b1) * (1 - progress) * 0.25;
        }
        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;
        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1500, now);
        filter.Q.value = 1.0;
        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noise.start(now);
    }

    // 2. Âm thanh lật trang sách chân thực, êm ái (Soft Realistic Page Turn)
    function playPageFlipSound() {
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const duration = 0.25;
        const bufferSize = audioCtx.sampleRate * duration;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = Math.random() * 2 - 1;
            b0 = 0.99 * b0 + white * 0.05;
            b1 = 0.96 * b1 + white * 0.11;
            b2 = 0.86 * b2 + white * 0.25;
            const pink = b0 + b1 + b2;
            const progress = i / bufferSize;
            const env = progress < 0.2 ? progress / 0.2 : Math.pow(1 - (progress - 0.2) / 0.8, 2);
            data[i] = pink * env * 0.28;
        }

        const noise = audioCtx.createBufferSource();
        noise.buffer = buffer;

        const filter = audioCtx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1000, now);
        filter.frequency.exponentialRampToValueAtTime(2200, now + 0.08);
        filter.frequency.exponentialRampToValueAtTime(700, now + duration);
        filter.Q.value = 1.1;

        const gainNode = audioCtx.createGain();
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

        noise.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        noise.start(now);

        // Âm thanh gáy sách chạm nhẹ rất êm
        const clickOsc = audioCtx.createOscillator();
        const clickGain = audioCtx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(220, now + 0.03);
        clickOsc.frequency.exponentialRampToValueAtTime(70, now + 0.08);
        clickGain.gain.setValueAtTime(0.04, now + 0.03);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        clickOsc.connect(clickGain);
        clickGain.connect(audioCtx.destination);
        clickOsc.start(now + 0.03);
        clickOsc.stop(now + 0.09);
    }

    // --- AUDIO DUCKING (Smooth Volume Transition) ---
    let audioDuckInterval = null;
    function duckAudio(isDucked) {
        if (!audio || isMuted) return;
        if (audioDuckInterval) clearInterval(audioDuckInterval);
        const targetVolume = isDucked ? 0.15 : 0.8;
        const step = isDucked ? -0.05 : 0.05;

        audioDuckInterval = setInterval(() => {
            let currentVol = audio.volume;
            if ((isDucked && currentVol > targetVolume) || (!isDucked && currentVol < targetVolume)) {
                currentVol += step;
                if (currentVol < 0.12) currentVol = 0.12;
                if (currentVol > 0.8) currentVol = 0.8;
                audio.volume = currentVol;
            } else {
                audio.volume = targetVolume;
                clearInterval(audioDuckInterval);
            }
        }, 50);
    }


    // Sound Toggle Logic
    let isMuted = false;
    function updateSoundBtnUI() {
        if (!soundBtn) return;
        const icon = soundBtn.querySelector('.sound-icon-wrapper i');
        if (isMuted) {
            soundBtn.classList.add('muted');
            soundBtn.setAttribute('title', 'Bật Âm Nhạc');
            if (icon) icon.className = 'fa-solid fa-volume-xmark';
        } else {
            soundBtn.classList.remove('muted');
            soundBtn.setAttribute('title', 'Tắt Âm Nhạc');
            if (icon) icon.className = 'fa-solid fa-volume-high';
        }
    }

    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            initAudio();
            triggerHaptic(40);
            isMuted = !isMuted;
            if (audio) {
                audio.muted = isMuted;
                if (!isMuted && audio.paused && !scene.classList.contains('hidden')) {
                    audio.play().catch(e => console.log(e));
                }
            }
            if (countdownAudio) {
                countdownAudio.muted = isMuted;
                if (!isMuted && countdownAudio.paused && !countdownScreen.classList.contains('hidden')) {
                    countdownAudio.play().catch(e => console.log(e));
                }
            }
            updateSoundBtnUI();
        });
    }

    // --- PASSWORD SCREEN LOGIC (Doraemon 0309) ---
    const passwordScreen = document.getElementById('password-screen');
    const pinSlots = document.querySelectorAll('.pin-slot');
    const pinDisplay = document.getElementById('pinDisplay');
    const pinStatus = document.getElementById('pinStatus');
    const keyBtns = document.querySelectorAll('.pass-keypad .key-btn');
    const CORRECT_PIN = '0309';
    let enteredPin = '';
    let isPinValidating = false;

    function playKeySound() {
        if (!audioCtx) initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(520 + (enteredPin.length * 90), now);
        osc.frequency.exponentialRampToValueAtTime(750, now + 0.05);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
    }

    function playErrorSound() {
        if (!audioCtx) initAudio();
        if (!audioCtx) return;
        const now = audioCtx.currentTime;
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.linearRampToValueAtTime(120, now + 0.22);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
    }

    function playSuccessChime() {
        if (!audioCtx) initAudio();
        if (!audioCtx) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const startTime = audioCtx.currentTime + idx * 0.09;
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, startTime);
            gain.gain.setValueAtTime(0.3, startTime);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            osc.start(startTime);
            osc.stop(startTime + 0.35);
        });
    }

    function updatePinUI() {
        pinSlots.forEach((slot, idx) => {
            slot.className = 'pin-slot';
            if (idx < enteredPin.length) {
                slot.classList.add('filled');
            }
        });
    }

    function handlePinInput(key) {
        if (isPinValidating || !passwordScreen || passwordScreen.classList.contains('hidden')) return;
        initAudio();

        if (key === 'clear') {
            triggerHaptic(30);
            enteredPin = '';
            updatePinUI();
            if (pinStatus) {
                pinStatus.textContent = '';
                pinStatus.className = 'pin-status';
            }
            return;
        }

        if (key === 'backspace') {
            triggerHaptic(30);
            if (enteredPin.length > 0) {
                enteredPin = enteredPin.slice(0, -1);
                updatePinUI();
                if (pinStatus) {
                    pinStatus.textContent = '';
                    pinStatus.className = 'pin-status';
                }
            }
            return;
        }

        if (/^[0-9]$/.test(key) && enteredPin.length < 4) {
            enteredPin += key;
            playKeySound();
            triggerHaptic(25);
            updatePinUI();

            if (enteredPin.length === 4) {
                validatePin();
            }
        }
    }

    function validatePin() {
        isPinValidating = true;

        if (enteredPin === CORRECT_PIN) {
            // Correct PIN!
            pinSlots.forEach(s => {
                s.className = 'pin-slot success';
            });
            if (pinStatus) {
                pinStatus.textContent = 'Chính xác rùi! Đang tìm bảo bối trong túi thần kỳ... ✨';
                pinStatus.className = 'pin-status success';
            }
            playSuccessChime();
            triggerHaptic([40, 60, 80]);

            // Confetti mini burst
            if (typeof confetti === 'function') {
                confetti({
                    particleCount: 50,
                    spread: 60,
                    origin: { y: 0.6 }
                });
            }

            setTimeout(() => {
                // Ẩn màn hình mật mã, mở màn hình Doraemon load lục túi
                passwordScreen.classList.add('hidden');
                startPreloadScreen();
            }, 850);
        } else {
            // Wrong PIN
            pinSlots.forEach(s => {
                s.className = 'pin-slot error';
            });
            if (pinDisplay) pinDisplay.classList.add('shake');
            if (pinStatus) {
                pinStatus.textContent = 'Mật khẩu chưa đúng rùi nè! Thử lại nha 🥺';
                pinStatus.className = 'pin-status error';
            }
            playErrorSound();
            triggerHaptic([60, 60, 60]);

            setTimeout(() => {
                enteredPin = '';
                updatePinUI();
                if (pinDisplay) pinDisplay.classList.remove('shake');
                isPinValidating = false;
            }, 650);
        }
    }

    // Keypad Click Event Listeners
    keyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const key = btn.getAttribute('data-key');
            btn.classList.add('pressed');
            setTimeout(() => btn.classList.remove('pressed'), 150);
            handlePinInput(key);
        });
    });

    // Keyboard Support
    window.addEventListener('keydown', (e) => {
        if (!passwordScreen || passwordScreen.classList.contains('hidden')) return;

        if (e.key >= '0' && e.key <= '9') {
            const btn = document.querySelector(`.key-btn[data-key="${e.key}"]`);
            if (btn) {
                btn.classList.add('pressed');
                setTimeout(() => btn.classList.remove('pressed'), 150);
            }
            handlePinInput(e.key);
        } else if (e.key === 'Backspace') {
            const btn = document.querySelector(`.key-btn[data-key="backspace"]`);
            if (btn) {
                btn.classList.add('pressed');
                setTimeout(() => btn.classList.remove('pressed'), 150);
            }
            handlePinInput('backspace');
        } else if (e.key === 'Escape' || e.key === 'Delete') {
            const btn = document.querySelector(`.key-btn[data-key="clear"]`);
            if (btn) {
                btn.classList.add('pressed');
                setTimeout(() => btn.classList.remove('pressed'), 150);
            }
            handlePinInput('clear');
        }
    });



    // Cinematic Flow Elements
    const startBtn = document.getElementById('start-btn');
    const mysteryGate = document.getElementById('mystery-gate');
    const countdownScreen = document.getElementById('countdown-screen');
    const countdownNum = document.getElementById('countdown-number');
    const countdownText = document.getElementById('countdown-text');
    const clickBookHint = document.getElementById('clickBookHint') || document.querySelector('.book-hint-bubble');
    const candle = document.querySelector('.candle');
    const blowCandleBtn = document.getElementById('blowCandleBtn');
    const wishContainer = document.querySelector('.wish-container');

    const countdownMessages = [
        "Một ngày đặc biệt... ",
        "Một người đặc biệt... ",
        "Và một món quà đặc biệt... "
    ];

    let countdownValue = 3;

    function typeWriter(text, i, cb) {
        if (countdownText._typingTimeout) clearTimeout(countdownText._typingTimeout);
        let isDone = false;

        function finishCountdownStep() {
            if (isDone) return;
            isDone = true;
            if (countdownText._typingTimeout) clearTimeout(countdownText._typingTimeout);
            countdownText.innerHTML = text;
            if (countdownScreen._countdownSkip) {
                countdownScreen.removeEventListener('click', countdownScreen._countdownSkip);
                countdownScreen._countdownSkip = null;
            }
            setTimeout(cb, 400);
        }

        countdownScreen._countdownSkip = (e) => {
            if (!isDone) {
                e.stopPropagation();
                finishCountdownStep();
            }
        };
        countdownScreen.addEventListener('click', countdownScreen._countdownSkip, { once: true });

        function type() {
            if (isDone) return;
            if (i < text.length) {
                countdownText.innerHTML += text.charAt(i);
                i++;
                countdownText._typingTimeout = setTimeout(type, 45);
            } else {
                if (!isDone) {
                    isDone = true;
                    if (countdownScreen._countdownSkip) {
                        countdownScreen.removeEventListener('click', countdownScreen._countdownSkip);
                        countdownScreen._countdownSkip = null;
                    }
                    setTimeout(cb, 1200);
                }
            }
        }
        type();
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
                initDynamicSkyIcons();

                // Pop confetti as background fully bursts into view
                setTimeout(() => {
                    firePremiumConfetti(1.5);
                }, 3600);

                // Type out the birthday celebration & wish instruction after the wish note appears
                setTimeout(() => {
                    runBirthdayIntro();
                }, 5300);
            }, 3000);
        }
    }

    // Birthday intro sequence
    function runBirthdayIntro() {
        const wishText = document.getElementById('unifiedWishText') || document.querySelector('.wish-text');
        const wishContainer = document.getElementById('wishContainer') || document.querySelector('.wish-container');
        if (!wishText) return;

        let currentStep = 0;
        let stepTimer = null;

        function nextStep() {
            if (stepTimer) clearTimeout(stepTimer);
            currentStep++;
            if (currentStep === 1) {
                typeWriterEffect(wishText, "Chúccc mừnggg sinhhh nhậttt 21 tủiiii Thanh Vy nhannn !!!! 🎉✨", 40, () => {
                    stepTimer = setTimeout(nextStep, 2500);
                });
            } else if (currentStep === 2) {
                typeWriterEffect(wishText, "Nàooooooo!!! ✨", 45, () => {
                    stepTimer = setTimeout(nextStep, 1500);
                });
            } else if (currentStep === 3) {
                typeWriterEffect(wishText, "Hãy nhắm mắt lại và ước một điều ước đi nhé... ✨", 40, () => {
                    stepTimer = setTimeout(() => {
                        if (!candle.classList.contains('blown-out')) {
                            typeWriterEffect(wishText, "Ước xong rùi thì hãy Thổi Nến nha! 🎂✨", 35);
                            if (blowCandleBtn) {
                                blowCandleBtn.classList.remove('hidden');
                                blowCandleBtn.style.display = '';
                            }
                        }
                    }, 9500); // 9.5s lắng đọng để Thanh Vy có đủ thời gian nhắm mắt và gửi gắm điều ước sinh nhật
                });
            }
        }

        if (wishContainer) {
            wishContainer.style.cursor = 'default';
            wishContainer.removeAttribute('title');
        }

        nextStep();
    }

    // Interactive Sky Fireworks on Click in empty areas
    if (scene) {
        scene.addEventListener('click', (e) => {
            if (e.target.closest('.balloon') || e.target.closest('.candle') || e.target.closest('#blowCandleBtn') || e.target.closest('.book-wrapper') || e.target.closest('#wishBagBtn') || e.target.closest('.modal') || e.target.closest('.sound-btn')) return;
            
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            if (typeof myConfetti === 'function') {
                myConfetti({
                    particleCount: 30,
                    spread: 65,
                    origin: { x, y },
                    colors: ['#ffd700', '#ff9ff3', '#48dbfb', '#ff6b6b', '#1dd1a1', '#ffffff', '#fd79a8'],
                    zIndex: 20
                });
            }
            triggerHaptic(30);
        });
    }

    // Dynamic Ambient Background Icons (Xuất hiện ngẫu nhiên tự nhiên)
    let dynamicIconsInterval = null;
    function initDynamicSkyIcons() {
        const container = document.getElementById('dynamicSkyIcons');
        if (!container || dynamicIconsInterval) return;

        const iconList = [
            '🚪', '🥞', '🍞', '🔦', '🔔', '🎁', '🎂', '🍰',
            '🌸', '🪄', '💖', '🎵', '🎶', '✨', '⭐', '🌟', '🎈'
        ];

        function spawnAmbientIcon() {
            if (!scene || scene.classList.contains('hidden')) return;

            // Pick a random side (Left wing: 4% - 30%, Right wing: 70% - 96%)
            const isLeft = Math.random() < 0.5;
            const leftPercent = isLeft 
                ? (4 + Math.random() * 26) 
                : (70 + Math.random() * 26);

            const icon = iconList[Math.floor(Math.random() * iconList.length)];
            const duration = 10 + Math.random() * 8; // 10s đến 18s trôi êm ái
            const size = 18 + Math.random() * 16; // 18px đến 34px
            const targetOpacity = 0.45 + Math.random() * 0.4;
            const swayDistance = (Math.random() * 32 - 16) + 'px';

            const el = document.createElement('div');
            el.className = 'dynamic-floating-icon';
            el.textContent = icon;
            el.style.left = `${leftPercent}%`;
            el.style.fontSize = `${size}px`;
            el.style.animationDuration = `${duration}s`;
            el.style.setProperty('--target-opacity', targetOpacity);
            el.style.setProperty('--sway-distance', swayDistance);

            container.appendChild(el);

            el.addEventListener('animationend', () => {
                el.remove();
            });
        }

        // Tạo nhịp xuất hiện ngẫu nhiên mỗi 1.2s - 1.8s
        dynamicIconsInterval = setInterval(() => {
            if (document.visibilityState === 'visible') {
                spawnAmbientIcon();
            }
        }, 1400);

        // Khởi tạo một vài icon trôi nhẹ ban đầu
        for (let i = 0; i < 5; i++) {
            setTimeout(spawnAmbientIcon, i * 500);
        }
    }

    // Candle Extinguishing Function
    function extinguishCandle() {
        if (candle.classList.contains('blown-out')) return;
        candle.classList.add('blown-out');
        triggerHaptic([80, 50, 150]);

        // Hide blow button permanently
        if (blowCandleBtn) {
            blowCandleBtn.classList.add('hidden');
            blowCandleBtn.style.display = 'none';
        }

        if (wishContainer) {
            wishContainer.style.cursor = 'default';
            wishContainer.removeAttribute('title');
        }

        // Allow clicking through centerpiece to reach balloons behind
        const centerpiece = document.querySelector('.centerpiece');
        if (centerpiece) centerpiece.style.pointerEvents = 'none';
        if (wishContainer) wishContainer.style.pointerEvents = 'auto';

        const wishText = document.getElementById('unifiedWishText') || document.querySelector('.wish-text');
        if (wishText) {
            typeWriterEffect(wishText, "Điều ước của Thanh Vy nhất định sẽ thành sự thật... 💖", 40, () => {
                setTimeout(() => {
                    typeWriterEffect(wishText, "🎈 Hãy bắt lấy những quả bóng bay để bắt lấy nhìu may mắn nhé!", 35, () => {
                        const balloonCounter = document.getElementById('balloonCounter');
                        if (balloonCounter) {
                            balloonCounter.classList.remove('hidden');
                            updateHUD();
                        }

                        // Sau 3.5s đọc hướng dẫn, ẩn dòng chữ phía trên và chỉ giữ lại bộ đếm
                        setTimeout(() => {
                            wishText.style.transition = "opacity 0.6s ease, max-height 0.6s ease";
                            wishText.style.opacity = "0";
                            setTimeout(() => {
                                wishText.style.display = "none";
                                wishText.innerHTML = "";
                                wishText.style.opacity = "1";
                            }, 600);
                        }, 3500);
                    });
                }, 3500);
            });
        }

        setTimeout(() => {
            firePremiumConfetti(1.2);
            document.querySelector('.balloons').classList.add('interactive');
        }, 600);
    }

    // Candle Blowing Button Click & Candle Direct Click Fallback
    if (blowCandleBtn) {
        blowCandleBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            extinguishCandle();
        });
    }

    if (candle) {
        candle.style.cursor = 'pointer';
        candle.setAttribute('title', 'Thổi hoặc chạm vào nến để thổi tắt nến');
        candle.addEventListener('click', (e) => {
            e.stopPropagation();
            extinguishCandle();
        });
    }

    // Dynamic Pixel-Perfect Scaling for Book on Mobile Devices
    function updateBookScale() {
        const bookScaler = document.querySelector('.book-scaler');
        if (!bookScaler) return;
        const w = window.innerWidth;
        const h = window.innerHeight;

        if (w <= 768) {
            // Book spread is 760px wide, 520px high
            const scaleW = (w * 0.90) / 760;
            const scaleH = (h * 0.60) / 520;
            const finalScale = Math.min(scaleW, scaleH, 0.72);
            bookScaler.style.transform = `scale(${finalScale.toFixed(3)})`;
            bookScaler.style.transformOrigin = 'center center';
        } else {
            bookScaler.style.transform = '';
            bookScaler.style.transformOrigin = '';
        }
    }
    window.addEventListener('resize', updateBookScale);
    window.addEventListener('orientationchange', updateBookScale);
    updateBookScale();

    // 1. Open Book (Move from corner to center)
    bookWrapper.addEventListener('click', (e) => {
        if (bookWrapper.classList.contains('in-center')) return;

        triggerHaptic([60, 40, 100]);
        firePremiumConfetti(1);

        updateBookScale();
        bookWrapper.classList.remove('in-corner');
        bookWrapper.classList.add('in-center');
        scene.classList.add('blurred');
        if (clickBookHint) clickBookHint.classList.add('hidden');
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
            const currentPaper = papers[currentLocation - 1];
            if (currentPaper) {
                currentPaper.classList.add('flipped');
                currentPaper.style.zIndex = currentLocation;
            }
            if (currentLocation === numOfPapers) {
                setTimeout(() => celebration(), 400); // Fireworks at final page!
            }
            currentLocation++;
            updateNavButtons();
        }
    }

    function goPrevPage() {
        if (currentLocation > 1) {
            playPageFlipSound();
            triggerHaptic(40);
            const prevPaper = papers[currentLocation - 2];
            if (prevPaper) {
                prevPaper.classList.remove('flipped');
                prevPaper.style.zIndex = numOfPapers - (currentLocation - 2);
            }
            currentLocation--;
            updateNavButtons();
        }
    }

    // Event Listeners for Book Nav
    if (nextBtn) nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goNextPage(); });
    if (prevBtn) prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goPrevPage(); });

    // Keyboard navigation (Arrow keys & Escape)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const imgModal = document.getElementById('imageModal');
            const letModal = document.getElementById('letterModal');
            if (imgModal && !imgModal.classList.contains('hidden')) {
                imgModal.classList.add('hidden');
                return;
            }
            if (letModal && !letModal.classList.contains('hidden')) {
                letModal.classList.add('hidden');
                return;
            }
            if (bookWrapper && bookWrapper.classList.contains('in-center') && closeBookBtn) {
                closeBookBtn.click();
                return;
            }
        }

        if (!bookWrapper || !bookWrapper.classList.contains('in-center')) return;
        if (e.key === 'ArrowRight') {
            goNextPage();
        } else if (e.key === 'ArrowLeft') {
            goPrevPage();
        }
    });

    // Close Book function
    function closeBook() {
        triggerHaptic(40);

        currentLocation = 1;
        papers.forEach((p, idx) => {
            if (p) {
                p.classList.remove('flipped');
                p.style.zIndex = numOfPapers - idx;
            }
        });
        updateNavButtons();
        duckAudio(false); // Restore background volume

        setTimeout(() => {
            if (bookWrapper) {
                bookWrapper.classList.remove('in-center', 'book-grand-reveal');
                bookWrapper.classList.add('in-corner');
            }
            if (scene) scene.classList.remove('blurred');
            const hint = document.querySelector('.book-hint-bubble');
            if (hint) hint.classList.remove('hidden');

            const balloonsContainer = document.querySelector('.balloons');
            if (balloonsContainer) {
                balloonsContainer.classList.remove('boss-active');
                balloonsContainer.style.zIndex = '5';
            }
        }, 500);
    }

    // Attach to all close book buttons (floating close button & back cover buttons)
    document.querySelectorAll('.close-book-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeBook();
        });
    });

    // Close book when clicking outside book-container in center mode
    document.addEventListener('click', (e) => {
        if (!bookWrapper || !bookWrapper.classList.contains('in-center')) return;
        if (e.target.closest('#imageModal') || e.target.closest('#letterModal') || e.target.closest('#wishPaperNote')) return;
        const bookContainer = document.querySelector('.book-container');
        if (bookContainer && !bookContainer.contains(e.target) && !e.target.closest('.nav-btn')) {
            closeBook();
        }
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
        "🎒 Nhận được Chong Chóng Tre! Chúc Thanh Vy tuổi 21 tự do bay cao bay xa, nhẹ nhàng chạm đến mọi ước mơ và hoài bão! 🚀🌸",
        "🚪 Nhận được Cánh Cửa Thần Kỳ! Mở ra cánh cửa đưa Thanh Vy đến những chân trời du lịch mới, vi vu khám phá thế giới thật vui! ✈️🌍",
        "🍞 Nhận được Bánh Mì Chuyển Ngữ! Chúc Thanh Vy ăn nói duyên dáng, đi đến đâu cũng được vạn người mến, triệu người thương! 💬✨",
        "⏱️ Nhận được Cỗ Máy Thời Gian! Chúc Thanh Vy luôn lưu giữ trọn vẹn những khoảnh khắc thanh xuân rực rỡ và tươi đẹp nhất! ⏳💖",
        "🪄 Nhận được Đèn Pin Thu Nhỏ! Mọi khó khăn, áp lực hay chuyện buồn phiền đều sẽ thu bé lại xíu xiu rồi biến mất tăm! 🪄💫",
        "🏮 Nhận được Đèn Pin Phóng To! Chúc niềm vui, sự tự tin, nét đáng yêu và may mắn của Thanh Vy được phóng to gấp ngàn lần! 🌟📈",
        "🕰️ Nhận được Khăn Trùm Thời Gian! Tuổi mới luôn giữ mãi nét trẻ trung, làn da mịn màng trắng xinh và nụ cười rạng rỡ! 🌸💆‍♀️",
        "📚 Nhận được Bánh Mì Ghi Nhớ! Chúc Thanh Vy học siêu nhớ lâu, làm việc thăng hoa, thi cử hanh thông và ra trường đúng hạn xuất sắc! 🎓💯",
        "👗 Nhận được Máy Ảnh Tạo Mốt! Mỗi ngày bước ra đường đều xinh lung linh, ăn diện cực gu và luôn là phiên bản tỏa sáng nhất! 💄👠✨",
        "☁️ Nhận được Mây Đông Đặc! Chúc Thanh Vy mỗi tối đều có những giấc ngủ thật êm ái, bồng bềnh và không bao giờ bị mất ngủ! 🛌💤",
        "📞 Nhận được Điện Thoại Yêu Cầu! Bất cứ mong ước hay dự định nào Thanh Vy ấp ủ trong tuổi mới đều trở thành hiện thực mỹ mãn! 🍀📞",
        "🍰 Nhận được Bánh Rán Dorayaki Thượng Hạng! Thỏa sức thưởng thức cả thế giới đồ ăn ngon mê ly mà dáng vẫn luôn chuẩn đẹp! 🧁😋",
        "🎀 Nhận được Nơ Đổi Giọng! Chúc Thanh Vy nói lời nào cũng ngọt ngào, dễ thương và luôn mang lại tiếng cười cho mọi người! 🎤🎶",
        "🎯 Nhận được Vòng Xuyên Thấu! Chúc Thanh Vy dễ dàng vượt qua mọi rào cản và thử thách trong công việc lẫn cuộc sống một cách êm đẹp! 🔓✨",
        "🪞 Nhận được Gương Nhân Đôi! Chúc tài lộc, may mắn và số dư tài khoản của Thanh Vy cứ thế tự động nhân đôi liên tục! 💰💳",
        "🧥 Nhận được Áo Choàng Tàng Hình! Giúp Thanh Vy tránh xa mọi thị phi, drama, rắc rối và luôn được bình yên bảo bọc! 🛡️🍃",
        "✏️ Nhận được Bút Chì Máy Tính! Mọi bài toán hay quyết định trong cuộc sống đều được giải quyết nhanh gọn, sáng suốt và chuẩn xác! 🧠💡",
        "🌬️ Nhận được Pháo Không Khí! Thổi bay mọi cơn stress, áp lực mệt mỏi trong tích tắc, trả lại tâm trạng phơi phới yêu đời! 💨🔥",
        "🕰️ Nhận được Đồng Hồ Ngưng Đọng Thời Gian! Lưu giữ từng khoảnh khắc ấm áp, hạnh phúc bên gia đình, bạn bè và những người thân yêu! 💐👨‍👩‍👧‍👦",
        "✨ Nhận được Đèn Phục Hồi! Sức khỏe luôn dồi dào, hồi phục 100% năng lượng siêu tốc sau mỗi ngày học tập và làm việc chăm chỉ! ⚡💪",
        "👠 Nhận được Giày Đi Vào Tranh! Chúc cuộc đời của Thanh Vy luôn ngập tràn sắc màu ngọt ngào và lãng mạn như một câu chuyện cổ tích! 📖✨",
        "🎋 Nhận được Cây Điều Ước! Cầu được ước thấy, mọi tâm nguyện của Thanh Vy trong tuổi mới đều sẽ sớm đơm hoa kết trái ngọt ngào! 🎋🌠",
        "🤝 Nhận được Nam Châm Tình Bạn! Luôn được vây quanh bởi những người bạn chân thành, tri kỷ và luôn sẵn sàng ở bên sẻ chia! 🤝❤️",
        "🪶 Nhận được Lông Vũ Trọng Lượng! Chúc tâm hồn Thanh Vy luôn nhẹ tênh, thảnh thơi bước qua mọi thăng trầm bằng nụ cười tươi tắn! 🪶🕊️",
        "☂️ Nhận được Cây Dù Tình Yêu! Chúc Thanh Vy luôn nhận được sự yêu thương chân thành, được nâng niu, che chở và đồng hành ấm áp! 💖🥰",
        "🍵 Nhận được Trà Thấu Hiểu! Giữ cho nội tâm luôn an yên, sáng suốt và tìm thấy sự bình yên sâu lắng trong trẻo mỗi ngày! 🍵🧘‍♀️",
        "🚀 Nhận được Tàu Vũ Trụ Mini! Chúc con đường học vấn và sự nghiệp của Thanh Vy cất cánh bay vút lên những đỉnh cao rực rỡ! 🌌🏆",
        "💪 Nhận được Găng Tay Cổ Vũ! Tiếp thêm 1000% tự tin và động lực để Thanh Vy vượt qua mọi thử thách dễ như ăn kẹo! 🥊🌟",
        "🖌️ Nhận được Bút Vẽ Đồ Thật! Mọi ý tưởng sáng tạo tuyệt vời trong đầu Thanh Vy đều sẽ được hiện thực hóa một cách hoàn hảo! 🖌️🌈",
        "🫧 Nhận được Bong Bóng Bảo Vệ! Giữ cho cô gái nhỏ luôn vô tư, yêu đời, được yêu thương và nâng niu trong thế giới của riêng mình! 🫧👑",
        "🧭 Nhận được La Bàn Hạnh Phúc! Dù đi bất cứ đâu, la bàn cuộc đời cũng sẽ luôn chỉ đúng hướng dẫn lối Thanh Vy đến ngập tràn niềm vui! 🧭☀️",
        "🍀 Nhận được Đồng Xu May Mắn! Ra đường gặp quý nhân, làm việc gặp thời cơ thuận lợi, vạn sự hanh thông như ý! 🪙✨",
        "📻 Nhận được Chiếc Loa Cảm Hứng! Mỗi sớm mai thức dậy đều tràn đầy cảm hứng, năng lượng tích cực và nhiệt huyết tuổi 21! 📻🎉",
        "🎁 Nhận được Hộp Quà Thần Kỳ! Cuộc sống tuổi mới của Thanh Vy sẽ luôn ngập tràn những bất ngờ ngọt ngào và đáng yêu mỗi ngày! 🎁🎊",
        "🌟 Nhận được Ngôi Sao May Mắn & Túi Thần Kỳ! Vũ trụ gửi đến Thanh Vy tất cả những phước lành, tình yêu thương và nụ cười rạng rỡ nhất! 🌟🥰"
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
                const balloonsContainer = document.querySelector('.balloons');
                if (balloonsContainer) {
                    balloonsContainer.classList.add('boss-active');
                    balloonsContainer.style.zIndex = '50';
                }

                const miniBook = document.createElement('div');
                miniBook.className = 'mini-book-tie';
                miniBook.innerHTML = '<div class="mini-book-icon"><div class="border-decor"></div><i class="fa-solid fa-cake-candles crown-icon"></i><div class="title">Album<br>Nhỏ</div></div>';
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
                    wishText.style.display = "block";
                    wishText.style.opacity = "1";
                    typeWriterEffect(wishText, "Chúccc mừnggg sinhhh nhậttt 21 tủiiii Thanh Vy nhaaa !!!! 🎉✨", 40);
                }

                const hud = document.getElementById('balloonCounter');
                if (hud) hud.classList.add('hidden');

                const balloonsContainer = document.querySelector('.balloons');
                if (balloonsContainer) {
                    balloonsContainer.classList.remove('boss-active');
                    balloonsContainer.style.zIndex = '5';
                }

                triggerHaptic([100, 50, 100, 50, 200]);
                firePremiumConfetti(2.2);

                // Quyển sổ văng thẳng ra giữa màn hình với hào quang vàng lung linh
                updateBookScale();
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

                    const skipWishNote = typeWriterEffect(wishPaperText, randomWish, 30, () => {
                        if (acceptWishBtn) acceptWishBtn.classList.remove('hidden');
                    });

                    wishPaperNote.onclick = (event) => {
                        if (event.target !== acceptWishBtn) {
                            skipWishNote();
                        }
                    };
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

    // --- MAGICAL ENVELOPE & BIRTHDAY LETTER MODAL LOGIC ---
    const letterModal = document.getElementById('letterModal');
    const closeLetterBtn = document.getElementById('closeLetterBtn');

    function openBirthdayLetter(e) {
        if (e) e.stopPropagation();
        triggerHaptic([60, 40, 100]);
        playPaperSound();
        firePremiumConfetti(1.2);
        if (letterModal) letterModal.classList.remove('hidden');
    }

    const envelopeTriggers = document.querySelectorAll('#envelopeWrapper, .envelope-page, .envelope');
    envelopeTriggers.forEach(el => {
        el.addEventListener('click', openBirthdayLetter);
    });

    if (closeLetterBtn && letterModal) {
        closeLetterBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            triggerHaptic(40);
            letterModal.classList.add('hidden');
        });
    }

    if (letterModal) {
        letterModal.addEventListener('click', (e) => {
            if (e.target === letterModal) {
                letterModal.classList.add('hidden');
            }
        });
    }

    // Image Zoom / Lightbox Modal Logic
    const imageModal = document.getElementById('imageModal');
    const modalZoomImg = document.getElementById('modalZoomImg');
    const modalZoomEmoji = document.getElementById('modalZoomEmoji');
    const closeImageModalBtn = document.getElementById('closeImageModalBtn');

    function openImageModal(src, emoji) {
        if (!imageModal || !modalZoomImg) return;
        triggerHaptic(40);
        modalZoomImg.src = src;
        if (modalZoomEmoji) modalZoomEmoji.innerHTML = emoji || '✨';
        imageModal.classList.remove('hidden');
    }

    function closeImageModal() {
        if (!imageModal) return;
        triggerHaptic(30);
        imageModal.classList.add('hidden');
    }

    if (closeImageModalBtn) {
        closeImageModalBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeImageModal();
        });
    }

    if (imageModal) {
        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal || e.target.classList.contains('image-modal-backdrop') || e.target === modalZoomImg || e.target.closest('.image-modal-container')) {
                closeImageModal();
            }
        });
    }

    // Attach click to all polaroid cards inside the album
    document.querySelectorAll('.book .polaroid').forEach(polaroid => {
        polaroid.addEventListener('click', (e) => {
            e.stopPropagation();
            const img = polaroid.querySelector('img');
            const emojiEl = polaroid.querySelector('.polaroid-text');
            if (img && img.src) {
                openImageModal(img.src, emojiEl ? emojiEl.innerHTML : '✨');
            }
        });
    });
});
