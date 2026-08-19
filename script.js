document.addEventListener('DOMContentLoaded', () => {
    // 0. Preloader Logic
    const preloader = document.getElementById('preloader');
    const loadingBar = document.getElementById('loadingBar');
    const loadingText = document.getElementById('loadingText');
    let loadProgress = 0;
    
    // Simulate loading
    const loadInterval = setInterval(() => {
        if (loadProgress < 90) {
            loadProgress += Math.random() * 15;
            if (loadProgress > 90) loadProgress = 90;
            if (loadingBar) loadingBar.style.width = `${loadProgress}%`;
            if (loadingText) loadingText.innerHTML = `Đang chuẩn bị điều bất ngờ cho Xuân Thịnh... ${Math.floor(loadProgress)}%`;
        }
    }, 150);

    window.addEventListener('load', () => {
        clearInterval(loadInterval);
        if (loadingBar) loadingBar.style.width = `100%`;
        if (loadingText) loadingText.innerHTML = `Hoàn tất! 100%`;
        setTimeout(() => {
            if (preloader) preloader.classList.add('hidden');
        }, 800);
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
        const bufferSize = audioCtx.sampleRate * 0.2; // 0.2s
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

    // (moved to top with other nav buttons)
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
        initAudio(); // Initialize audio context on first interaction
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
            if (countdownAudio) {
                // Làm âm lượng nhỏ dần (fade out)
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
                }, 100); // Mỗi 100ms giảm âm lượng một chút
            }
            // Xóa chữ số nhưng giữ nguyên màn hình đếm ngược (nền đen)
            countdownNum.style.transition = "opacity 0.5s ease";
            countdownText.style.transition = "opacity 0.5s ease";
            countdownNum.style.opacity = "0";
            countdownText.style.opacity = "0";

            // Màn hình đen hoàn toàn trong 2.5 giây rồi mới bắt đầu
            setTimeout(() => {
                // Fade out nền đen của countdown screen
                countdownScreen.classList.add('hidden');
                
                // Play Grand Reveal Audio
                if (audio && audio.paused) {
                    audio.volume = 0.8;
                    audio.play().catch(e => console.log(e));
                }

                // Show the scene (elements inside will animate in)
                scene.classList.remove('hidden');
                
                // Pop confetti after the scene starts revealing
                setTimeout(() => {
                    firePremiumConfetti(1.5);
                }, 2000);

                // Type out the first wish instruction when the container fades in (5.5s)
                setTimeout(() => {
                    const initialWishText = document.querySelector('.wish-text');
                    if (initialWishText) {
                        typeWriterEffect(initialWishText, "Hãy nhắm mắt lại và ước một điều ước nhé... ✨", 40, () => {
                            // Chờ 3 giây để nhắm mắt ước rồi mới hiện nút Thổi Nến
                            setTimeout(() => {
                                if (blowCandleBtn) blowCandleBtn.classList.remove('hidden');
                            }, 3000);
                        });
                    }
                }, 5500);
            }, 3500); // Kéo dài thời gian bóng tối lên 3.5 giây
        }
    }

    // Candle Blowing Logic
    // Interactive Candle - via Button
    blowCandleBtn.addEventListener('click', () => {
        if (!candle.classList.contains('blown-out')) {
            candle.classList.add('blown-out');
            
            // Xuyên click qua bánh kem để bấm được bóng bay phía sau
            const centerpiece = document.querySelector('.centerpiece');
            if (centerpiece) centerpiece.style.pointerEvents = 'none';

            // Hide button and change text instead of hiding the whole container
            blowCandleBtn.classList.add('hidden'); 
            const wishText = document.querySelector('.wish-text');
            if (wishText) {
                wishText.style.opacity = '0';
                setTimeout(() => {
                    wishText.style.opacity = '1';
                    
                    // Hiệu ứng đánh chữ
                    typeWriterEffect(wishText, "Điều ước đó nhất định sẽ thành sự thật... ✨", 40, () => {
                        // Trì hoãn một lúc rồi mới hiện câu nhắc bóng bay
                        setTimeout(() => {
                            wishText.style.opacity = '0';
                            setTimeout(() => {
                                wishText.style.display = 'none'; // Ẩn hẳn để nhường chỗ
                                const catchHint = document.getElementById('catchBalloonHint');
                                if (catchHint) {
                                    catchHint.innerHTML = '';
                                    catchHint.classList.remove('hidden');
                                    typeWriterEffect(catchHint, "👆 Hãy chạm vào bóng bay để bắt lấy may mắn nhé!", 40);
                                    
                                    // Bật hiển thị bộ đếm bóng bay
                                    const balloonCounter = document.getElementById('balloonCounter');
                                    if (balloonCounter) balloonCounter.classList.remove('hidden');
                                }
                            }, 300);
                        }, 2500);
                    });
                }, 300);
            }
            
            // Wait a moment for fire to go out, then pop confetti and start balloon game
            setTimeout(() => {
                firePremiumConfetti(1);
                
                // Make balloons interactive (nhưng chưa hiện chữ nhắc ngay)
                document.querySelector('.balloons').classList.add('interactive');
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

    // Wish Tooltip & Pop Balloon logic
    const allBalloons = document.querySelectorAll('.balloon');
    
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
        "Chỉ mong cậu luôn được hạnh phúc trọn vẹn với những lựa chọn của mình! ❤️",
        "Mong cậu luôn giữ được ngọn lửa đam mê trong tim mình! 🔥",
        "Chúc cậu mỗi sáng thức dậy đều có một lý do để mỉm cười! 😊",
        "Hãy sống một cuộc đời rực rỡ như những đóa hoa hướng dương nhé! 🌻",
        "Mọi muộn phiền của tuổi cũ sẽ bay đi hết theo gió trời! 🌬️",
        "Tuổi mới gặp được nhiều người tốt, đi được nhiều nơi đẹp! 🗺️",
        "Chúc cậu sớm tìm được chân ái của đời mình nhé! 💘",
        "Ăn cả thế giới mà vẫn không béo lên lạng nào nha! 🍔🍰",
        "Tuổi 21 trưởng thành nhưng vẫn mãi là cô gái bé nhỏ vô tư nhé! 👧",
        "Chúc cho mọi nỗ lực của cậu đều sẽ được đền đáp xứng đáng! 🏆",
        "Hãy luôn yêu thương và trân trọng bản thân mình trước tiên nhé! 💖",
        "Mong cậu một đời vô âu vô lo, an nhiên tự tại! 🍃",
        "Gặp dữ hóa lành, đi đến đâu cũng được mọi người yêu mến! 🥰",
        "Chúc cậu mua sắm không cần nhìn giá! 🛍️",
        "Bớt chạy deadline lại, chăm sóc sức khỏe nhiều hơn nha! 🛌",
        "Tuổi 21 đầy những bất ngờ thú vị đang chờ cậu phía trước! 🎁"
    ];

    allBalloons.forEach(balloon => {
        const tag = balloon.querySelector('.paper-tag');
        const tooltip = balloon.querySelector('.balloon-tooltip');

        // "Nhận" button event
        const acceptWishBtn = document.getElementById('acceptWishBtn');
        if (acceptWishBtn) {
            acceptWishBtn.addEventListener('click', () => {
                const wishPaperNote = document.getElementById('wishPaperNote');
                if (wishPaperNote) wishPaperNote.classList.add('hidden');
                acceptWishBtn.classList.add('hidden');
                
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
                    
                    // Nâng z-index của container bóng bay lên cao nhất để đè lên bánh kem và chữ
                    document.querySelector('.balloons').style.zIndex = '999';
                    
                    const miniBook = document.createElement('div');
                    miniBook.className = 'mini-book-tie';
                    miniBook.innerHTML = '<div class="mini-book-icon"><div class="border-decor"></div><i class="fa-solid fa-cake-candles crown-icon"></i><div class="title">Nhật ký tuổi 21</div></div>';
                    bossBalloon.appendChild(miniBook);
                }
            }
        }

        function checkGameOver() {
            const totalBalloons = allBalloons.length;
            const clickedBalloons = document.querySelectorAll('.balloon.clicked, .balloon.popped').length;
            if (clickedBalloons === totalBalloons) {
                // Hiện ngay lập tức để có cảm giác quyển sổ rơi ra từ quả bóng cuối cùng
                setTimeout(() => {
                    const hint = document.getElementById('catchBalloonHint');
                    if (hint) hint.classList.add('hidden');
                    
                    const hud = document.getElementById('balloonCounter');
                    if (hud) hud.classList.add('hidden');
                    
                    firePremiumConfetti(1.5);
                    
                    // Quyển sổ bắt đầu ở giữa màn hình (như văng ra từ bóng)
                    bookWrapper.classList.remove('hidden');
                    bookWrapper.classList.remove('in-corner');
                    bookWrapper.classList.add('in-center');
                    
                    // Và ngay lập tức thu nhỏ bay về góc màn hình
                    setTimeout(() => {
                        bookWrapper.classList.remove('in-center');
                        bookWrapper.classList.add('in-corner');
                        
                        setTimeout(() => {
                            const bookHint = document.getElementById('clickBookHint');
                            if (bookHint) {
                                bookHint.innerHTML = '';
                                bookHint.classList.remove('hidden');
                                typeWriterEffect(bookHint, "Mở quyển nhật ký ở góc dưới nhé!", 40);
                            }
                        }, 800);
                    }, 50);
                    
                }, 400); // 400ms delay để quả bóng kịp nổ
            }
        }

        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            if (!document.querySelector('.balloons').classList.contains('interactive')) return;
            if (balloon.classList.contains('clicked')) return;
            
            if (tag && tooltip) {
                // Balloon WITH a tag -> Open Wish
                if (tag.classList.contains('opened')) return; // Already opened
                
                // Tạm dừng game
                document.querySelector('.balloons').classList.remove('interactive');
                
                // Pick a random wish
                const randomWish = randomWishes[Math.floor(Math.random() * randomWishes.length)];
                tooltip.innerHTML = randomWish;
                
                // Play paper crinkle sound
                playPaperSound();
                
                // Show tooltip and hide tag
                tooltip.classList.add('show');
                tag.classList.add('opened');
                balloon.classList.add('clicked');
                
                // Show static paper note on screen
                const wishPaperNote = document.getElementById('wishPaperNote');
                const wishPaperText = document.getElementById('wishPaperText');
                if (wishPaperNote && wishPaperText) {
                    wishPaperNote.classList.remove('hidden');
                    if (acceptWishBtn) acceptWishBtn.classList.add('hidden');
                    
                    // Typewriter effect cho nội dung
                    typeWriterEffect(wishPaperText, randomWish, 35, () => {
                        // Hiển thị nút Nhận sau khi viết xong
                        if (acceptWishBtn) acceptWishBtn.classList.remove('hidden');
                    });
                }
                
                // Confetti pop!
                myConfetti({ particleCount: 20, spread: 50, origin: { y: 0.8 }, colors: colors, zIndex: 3000 });
                
                // Cập nhật HUD
                updateHUD();
                
            } else {
                // Balloon WITHOUT a tag -> Pop!
                if (balloon.classList.contains('popped')) return;
                
                balloon.classList.add('popped');
                balloon.classList.add('clicked');
                
                // Play pop sound
                playPopSound();
                
                // Calculate position for confetti
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

                // Cập nhật HUD
                updateHUD();

                // Kiểm tra game over ngay lập tức
                checkGameOver();
            }
        });
    });
});
