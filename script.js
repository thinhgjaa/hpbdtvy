document.addEventListener('DOMContentLoaded', () => {
    const bookWrapper = document.getElementById('bookWrapper');
    const scene = document.getElementById('scene');
    const book = document.getElementById('book');
    const audio = document.getElementById('bgMusic');
    const countdownAudio = document.getElementById('countdownMusic');
    const soundBtn = document.getElementById('soundBtn');
    
    // Page Elements
    const paper1 = document.getElementById('p1');
    const paper2 = document.getElementById('p2');
    const paper3 = document.getElementById('p3');
    const papers = [paper1, paper2, paper3];
    
    // Nav Buttons
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const closeBookBtn = document.getElementById('closeBookBtn');

    let currentLocation = 1;
    let numOfPapers = 3;
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
        "Dành cho một người vô cùng đặc biệt...",
        "Tuổi 21 rực rỡ bắt đầu!"
    ];

    let countdownValue = 3;

    function typeWriter(text, i, cb) {
        if (i < text.length) {
            countdownText.innerHTML += text.charAt(i);
            setTimeout(() => typeWriter(text, i + 1, cb), 30);
        } else {
            setTimeout(cb, 500);
        }
    }

    startBtn.addEventListener('click', () => {
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
            countdownNum.innerText = countdownValue;
            countdownText.innerHTML = "";
            typeWriter(countdownMessages[3 - countdownValue], 0, () => {
                countdownValue--;
                setTimeout(runCountdown, 200);
            });
        } else {
            // Stop Countdown Audio
            if (countdownAudio) {
                countdownAudio.pause();
                countdownAudio.currentTime = 0;
            }
            // Play Grand Reveal Audio
            if (audio && audio.paused) {
                audio.volume = 0.8;
                audio.play().catch(e => console.log(e));
            }

            // Slow Gradual Reveal
            countdownScreen.style.transition = "opacity 3s ease";
            countdownScreen.classList.add('hidden');
            scene.classList.remove('hidden');
            
            // Pop confetti after the screen has partially faded in
            setTimeout(() => {
                firePremiumConfetti(1.5);
            }, 2000);
        }
    }

    // Candle Blowing Logic
    // Interactive Candle - via Button
    blowCandleBtn.addEventListener('click', () => {
        if (!candle.classList.contains('blown-out')) {
            candle.classList.add('blown-out');
            wishContainer.classList.add('hidden'); // Hide instructions
            
            // Wait a moment for fire to go out, then pop confetti again and show book
            setTimeout(() => {
                firePremiumConfetti(1);
                bookWrapper.classList.remove('hidden');
                
                // Show hint after book appears
                setTimeout(() => {
                    document.getElementById('clickBookHint').classList.remove('hidden');
                }, 1000);
            }, 800);
        }
    });

    // 1. Open Book (Move from corner to center)
    bookWrapper.addEventListener('click', (e) => {
        // Prevent opening again if already open
        if (bookWrapper.classList.contains('in-center')) return;

        // Fire Confetti on open
        firePremiumConfetti(1);

        // Transition states
        bookWrapper.classList.remove('in-corner');
        bookWrapper.classList.add('in-center');
        scene.classList.add('blurred');
        clickBookHint.classList.add('hidden');
        
        updateNavButtons();
    });

    // 2. Book Flipping Logic
    function updateNavButtons() {
        if(currentLocation === 1) {
            prevBtn.classList.add('disabled');
            nextBtn.classList.remove('disabled');
            book.classList.remove('open'); // Center the cover
        }
        else if(currentLocation === maxLocation) {
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
        if(currentLocation < maxLocation) {
            switch(currentLocation) {
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
                    setTimeout(() => celebration(), 500); // Fireworks at the end
                    break;
                default:
                    throw new Error("unknown state");
            }
            currentLocation++;
            updateNavButtons();
        }
    }

    function goPrevPage() {
        if(currentLocation > 1) {
            switch(currentLocation) {
                case 2:
                    paper1.classList.remove('flipped');
                    paper1.style.zIndex = 3;
                    break;
                case 3:
                    paper2.classList.remove('flipped');
                    paper2.style.zIndex = 2;
                    break;
                case 4:
                    paper3.classList.remove('flipped');
                    paper3.style.zIndex = 1;
                    break;
                default:
                    throw new Error("unknown state");
            }
            currentLocation--;
            updateNavButtons();
        }
    }

    // Event Listeners for Nav
    nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goNextPage(); });
    prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goPrevPage(); });
    
    // Close Book logic
    closeBookBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Ngăn chặn sự kiện click lan ra wrapper (sẽ làm sách mở lại)
        
        // Reset pages back to page 1
        currentLocation = 1;
        papers.forEach((p, idx) => {
            p.classList.remove('flipped');
            p.style.zIndex = 3 - idx;
        });
        updateNavButtons();

        // Move back to corner
        setTimeout(() => {
            bookWrapper.classList.remove('in-center');
            bookWrapper.classList.add('in-corner');
            scene.classList.remove('blurred');
            clickBookHint.classList.remove('hidden');
        }, 500);
    });

    // Premium Confetti
    const colors = ['#ff9ff3', '#feca57', '#48dbfb', '#ff6b81'];
    
    // Custom confetti instance without web workers to bypass file:// CORS
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
        const duration = 3 * 1000;
        const end = Date.now() + duration;

        (function frame() {
            myConfetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            myConfetti({
                particleCount: 5,
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

    // Wish Tooltip logic (Balloons)
    const paperTags = document.querySelectorAll('.paper-tag');
    
    const randomWishes = [
        "Tuổi mới vui vẻ, mãi xinh đẹp và rạng rỡ nha! 💖",
        "Chúc cậu luôn mạnh khỏe, hay ăn chóng lớn và lúc nào cũng vui vẻ! 🌸",
        "Hãy luôn tự tin vào bản thân nhé, cậu tuyệt vời lắm đó! ✨",
        "Chúc mọi dự định trong tuổi 21 của cậu đều trở thành hiện thực! 🌟",
        "Mong mỗi ngày của cậu đều tràn ngập niềm vui và tiếng cười! 🎉",
        "Chúc cậu một đời bình an, đi qua giông bão vẫn giữ được nụ cười! 🌈",
        "Tuổi 21 thật rực rỡ nhé, hãy làm những điều cậu thích và yêu những gì cậu làm! 🎨",
        "Tiền nhiều như nước, tình duyên phơi phới nhé cô gái! 💸",
        "Sớm thành đại gia để bao nuôi bạn bè nha! 😂",
        "Chúc cậu đi du lịch muôn nơi, ăn ngon mặc đẹp không lo nghĩ! ✈️",
        "Luôn giữ được năng lượng tích cực và truyền cảm hứng cho mọi người nhé! 🌻",
        "Gặp nhiều may mắn, vạn sự như ý trong tuổi mới! 🍀",
        "Tuổi 21 dáng xinh, da trắng bóc mịn màng nhé! 💅",
        "Công việc thuận lợi, học hành thi cử đều đỗ đạt điểm cao! 📚",
        "Chỉ mong cậu luôn được hạnh phúc trọn vẹn với những lựa chọn của mình! ❤️"
    ];

    paperTags.forEach(tag => {
        tag.addEventListener('click', (e) => {
            e.stopPropagation();
            if(tag.classList.contains('opened')) return; // Already opened
            
            // Find the tooltip in the same balloon
            const balloon = tag.closest('.balloon');
            const tooltip = balloon.querySelector('.balloon-tooltip');
            
            if (tooltip) {
                // Pick a random wish
                const randomWish = randomWishes[Math.floor(Math.random() * randomWishes.length)];
                tooltip.innerHTML = randomWish;
                
                // Show tooltip
                tooltip.classList.add('show');
                
                // Hide the tag
                tag.classList.add('opened');
                
                // Confetti pop!
                myConfetti({ particleCount: 20, spread: 50, origin: { y: 0.8 }, colors: colors, zIndex: 3000 });
            }
        });
    });
});
