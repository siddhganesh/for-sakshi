/* ============================================================
   script.js — Sakshi ke liye
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

    // ─── STARS ──────────────────────────────────────────────
    const starsBg = document.getElementById('starsBg');
    for (let i = 0; i < 120; i++) {
        const s = document.createElement('div');
        s.className = 'star';
        const size = Math.random() * 2.5 + 0.5;
        s.style.cssText = `
            width:${size}px; height:${size}px;
            top:${Math.random()*100}%;
            left:${Math.random()*100}%;
            --tw-dur:${(Math.random()*3+2).toFixed(1)}s;
            --tw-delay:${(Math.random()*4).toFixed(1)}s;
        `;
        starsBg.appendChild(s);
    }

    // ─── PETAL CANVAS ───────────────────────────────────────
    const canvas = document.getElementById('petalCanvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    const petals = [];
    const PETAL_SYMBOLS = ['✦', '·', '✧', '⋆', '*'];
    const PETAL_COLORS  = ['rgba(107,140,255,0.35)', 'rgba(160,107,255,0.3)', 'rgba(255,123,168,0.25)', 'rgba(184,212,255,0.2)'];

    function spawnPetal() {
        petals.push({
            x: Math.random() * canvas.width,
            y: -10,
            s: PETAL_SYMBOLS[Math.floor(Math.random() * PETAL_SYMBOLS.length)],
            c: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
            sz: Math.random() * 12 + 8,
            vx: (Math.random() - 0.5) * 0.6,
            vy: Math.random() * 0.8 + 0.3,
            alpha: Math.random() * 0.5 + 0.3,
            rot: Math.random() * Math.PI * 2,
            rotV: (Math.random() - 0.5) * 0.02,
        });
    }

    let spawnTimer = 0;
    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        spawnTimer++;
        if (spawnTimer % 18 === 0) spawnPetal();

        for (let i = petals.length - 1; i >= 0; i--) {
            const p = petals[i];
            p.x += p.vx; p.y += p.vy; p.rot += p.rotV;
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.c;
            ctx.font = `${p.sz}px sans-serif`;
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillText(p.s, 0, 0);
            ctx.restore();
            if (p.y > canvas.height + 20) petals.splice(i, 1);
        }
        requestAnimationFrame(animatePetals);
    }
    animatePetals();

    // ─── PAGE TRANSITIONS ───────────────────────────────────
    function showPage(fromId, toId, delay = 0) {
        const from = document.getElementById(fromId);
        const to   = document.getElementById(toId);
        setTimeout(() => {
            from.classList.remove('active');
            from.classList.add('hidden');
            to.classList.remove('hidden');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    to.classList.add('active');
                });
            });
        }, delay);
    }

    // ─── PAGE 1 → 2: Open Letter ─────────────────────────────
    document.getElementById('openBtn').addEventListener('click', () => {
        floatHearts(5);
        showPage('lockScreen', 'sorryPage', 300);

        // Show "next" button after scroll/delay
        setTimeout(() => {
            document.getElementById('toShayriBtn').classList.remove('hidden');
            document.getElementById('scrollCue').classList.add('hidden');
        }, 5000);
    });

    // ─── PAGE 2 → 3 ──────────────────────────────────────────
    document.getElementById('toShayriBtn').addEventListener('click', () => {
        showPage('sorryPage', 'shayriPage');
    });

    // ─── PAGE 3 → 4 ──────────────────────────────────────────
    document.getElementById('toPromisesBtn').addEventListener('click', () => {
        showPage('shayriPage', 'promisePage');
        buildJar();
    });

    // ─── PAGE 4 → 5 ──────────────────────────────────────────
    document.getElementById('toFinalBtn').addEventListener('click', () => {
        showPage('promisePage', 'finalPage');
        revealFinalWords();
    });

    // ─── SHAYRI CAROUSEL ────────────────────────────────────
    const cards = document.querySelectorAll('.shayri-card');
    const dots  = document.querySelectorAll('.dot');
    let current = 0;

    function goTo(n) {
        cards[current].classList.remove('active');
        dots[current].classList.remove('active');
        current = (n + cards.length) % cards.length;
        cards[current].classList.add('active');
        dots[current].classList.add('active');
    }

    document.getElementById('prevShayri').addEventListener('click', () => goTo(current - 1));
    document.getElementById('nextShayri').addEventListener('click', () => goTo(current + 1));
    dots.forEach(d => d.addEventListener('click', () => goTo(+d.dataset.i)));

    // Touch swipe on carousel
    let touchStartX = 0;
    const carousel = document.getElementById('shayriCarousel');
    carousel.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    carousel.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) goTo(dx < 0 ? current + 1 : current - 1);
    });

    // ─── PROMISE JAR ────────────────────────────────────────
    const promiseData = [
        { label: '🌙 Raat wala vaada', detail: 'Raat ko agli baar gussa nahi aunga. Tera wait karunga, force nahi.' },
        { label: '🤐 Khamoshi ka haq', detail: 'Agar tujhe bolna nahi hai kuch — yeh tera haq hai. Main manunga.' },
        { label: '☕ Woh wala sukoon', detail: 'Sirf dost ki tarah baat karna, bina kisi expectation ke — yeh wapas laana chahta hoon.' },
        { label: '🚫 Pressure nahi', detail: 'Koi bhi faisla tera apna hoga. Main kabhi force nahi karunga.' },
        { label: '💬 Pehle sunta hoon', detail: 'Agle baar pehle sunuunga — phir bolunga. Promise.' },
        { label: '🙏 Galti maanunga', detail: 'Jab galat hounga, toh maanunga bhi — bina "tu bhi galat tha" wali excuse ke.' },
        { label: '🌸 Bas dost rehna', detail: 'Teri dosti mujhe sab se zyada chahiye. Baki sab uske baad.' },
    ];

    function buildJar() {
        const container = document.getElementById('jarNotes');
        container.innerHTML = '';
        promiseData.forEach((p, i) => {
            const note = document.createElement('div');
            note.className = 'jar-note';
            note.textContent = p.label;
            note.style.animationDelay = `${i * 0.1}s`;
            note.addEventListener('click', () => showPromiseDetail(p.detail));
            container.appendChild(note);
        });
    }

    function showPromiseDetail(text) {
        document.getElementById('promiseDetailText').textContent = text;
        document.getElementById('promiseDetail').classList.remove('hidden');
    }

    document.getElementById('closeDetail').addEventListener('click', () => {
        document.getElementById('promiseDetail').classList.add('hidden');
    });

    // ─── FINAL WORDS REVEAL ─────────────────────────────────
    function revealFinalWords() {
        const words = ['fw1','fw2','fw3','fw4','fw5'];
        const finalOptions = document.getElementById('finalOptions');

        words.forEach((id, i) => {
            setTimeout(() => {
                const el = document.getElementById(id);
                el.classList.remove('hidden');
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => el.classList.add('visible'));
                });

                // After last word, show buttons
                if (i === words.length - 1) {
                    setTimeout(() => {
                        finalOptions.classList.remove('hidden');
                    }, 900);
                }
            }, 700 + i * 900);
        });
    }

    // ─── FINAL RESPONSE BUTTONS ─────────────────────────────
    document.getElementById('yesFinalBtn').addEventListener('click', () => {
        floatHearts(12);
        document.getElementById('finalOptions').classList.add('hidden');
        const resp = document.getElementById('responseMsg');
        resp.innerHTML = 'Shukriya Sakshi 💙<br/><span style="font-size:1.1rem;color:#8888AA">Main bahut khush hoon aur bahut sharminda bhi.<br/>Wada rahe — yeh baar alag hoga.</span>';
        resp.classList.remove('hidden');
    });

    document.getElementById('timeFinalBtn').addEventListener('click', () => {
        document.getElementById('finalOptions').classList.add('hidden');
        const resp = document.getElementById('responseMsg');
        resp.style.color = '#8888AA';
        resp.innerHTML = 'Theek hai.<br/><span style="font-size:1.05rem">Main yahaan hoon — jab bhi zaroorat ho. ❤️</span>';
        resp.classList.remove('hidden');
    });

    // ─── FLOATING HEARTS EFFECT ─────────────────────────────
    function floatHearts(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const h = document.createElement('div');
                h.className = 'float-heart';
                h.textContent = ['💙','💜','🩵','✨','🌸'][Math.floor(Math.random()*5)];
                h.style.left = `${20 + Math.random() * 60}%`;
                h.style.bottom = `${10 + Math.random() * 30}%`;
                h.style.animationDuration = `${2 + Math.random()}s`;
                document.body.appendChild(h);
                setTimeout(() => h.remove(), 3500);
            }, i * 160);
        }
    }

});
