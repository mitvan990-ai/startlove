const music = document.getElementById("bg-music");

const playMusicOnce = () => {
    music.play().catch(e => console.log("Music play blocked:", e));
    window.removeEventListener("click", playMusicOnce);
};

window.addEventListener("click", playMusicOnce);

const messages = [
    "Em là vũ trụ của anh", "Tình yêu bất tận giữa các vì sao",
    "Em là ngôi sao sáng nhất", "Anh tỏa sáng là vì em",
    "Em thật tỏa sáng trên bầu trời của anh"
];
const fallingTexts = [];
const explosionParticles = [];
const mouseTrail = [];
const stars = [];
const heartStars = [];
const meteors = [];

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

let heartColorOffset = 0;
let mouseX = width / 2;
let mouseY = height / 2;
let heartBeat = 1;
let heartScale = Math.min(width, height) * 0.015;

const bgCanvas = document.createElement('canvas');
const bgCtx = bgCanvas.getContext('2d');
bgCanvas.width = width;
bgCanvas.height = height;

function heartShape(t, scale = 1) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    return { x: x * scale, y: y * scale };
}

function createHeartStars(count = 2200) {
    heartStars.length = 0;
    const centerX = width / 2;
    const centerY = height / 2 + 20;
    for (let i = 0; i < count; i++) {
        const t = (i / count) * Math.PI * 2;
        const heart = heartShape(t, heartScale);
        const offsetX = (Math.random() - 0.5) * 15;
        const offsetY = (Math.random() - 0.5) * 15;
        const targetX = centerX + heart.x + offsetX;
        const targetY = centerY + heart.y + offsetY;
        const angle = Math.random() * Math.PI * 2;
        const force = Math.random() * 8 + 5;
        heartStars.push({
            x: centerX,
            y: centerY,
            velocityX: Math.cos(angle) * force,
            velocityY: Math.sin(angle) * force,
            targetX,
            targetY,
            originalX: targetX,
            originalY: targetY,
            size: Math.random() * 3 + 1,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.02 + 0.01,
            brightness: Math.random() * 0.5 + 0.5,
            mode: 'exploding'
        });
    }
}

function createBackgroundStars() {
    bgCtx.clearRect(0, 0, width, height);
    stars.length = 0;
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            twinkle: Math.random() * Math.PI * 2,
            twinkleSpeed: Math.random() * 0.01 + 0.005,
            brightness: Math.random() * 0.3 + 0.2
        });
    }
    stars.forEach(star => {
        bgCtx.save();
        bgCtx.globalAlpha = star.brightness;
        bgCtx.fillStyle = '#ffffff';
        bgCtx.beginPath();
        bgCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        bgCtx.fill();
        bgCtx.restore();
    });
}

function createMeteor() {
    const isSuperMeteor = Math.random() < 0.5; // 50% cơ hội
    meteors.push({
        x: Math.random() * width,
        y: -50,
        length: Math.random() * 80 + 70,
        speed: Math.random() * 8 + 8,
        angle: Math.PI / 4 + (Math.random() - 0.5) * 0.2,
        alpha: 1,
        isSuper: isSuperMeteor,
        lineWidth: isSuperMeteor ? 4 : 2,
        shadowBlur: isSuperMeteor ? 15 : 0,
        color: '255, 255, 255'
    });
}

function createFallingText() {
    const text = messages[Math.floor(Math.random() * messages.length)];
    const fontSize = Math.random() * 10 + 10;
    ctx.font = `bold ${fontSize}px Pacifico`;
    const textWidth = ctx.measureText(text).width;
    const x = Math.random() * (width - textWidth);
    fallingTexts.push({
        text, x, y: -20, speed: Math.random() * 2 + 2,
        alpha: 1, fontSize, hue: Math.random() * 360
    });
}

setInterval(() => { if (Math.random() < 0.9) createMeteor(); }, 1500);
setInterval(() => { if (Math.random() < 0.8) createFallingText(); }, 2000);

function animate() {
    ctx.clearRect(0, 0, width, height);
    ctx.drawImage(bgCanvas, 0, 0);

    heartColorOffset += 0.01;
    heartBeat += 0.07;

    meteors.forEach((m, i) => {
        const dx = Math.cos(m.angle) * m.length;
        const dy = Math.sin(m.angle) * m.length;
        ctx.save();
        ctx.globalAlpha = m.alpha;
        ctx.strokeStyle = `rgba(${m.color}, 0.8)`;
        ctx.lineWidth = m.lineWidth;
        if (m.isSuper) {
            ctx.shadowBlur = m.shadowBlur;
            ctx.shadowColor = `rgba(${m.color}, 1)`;
        }
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(m.x - dx, m.y - dy);
        ctx.stroke();
        ctx.restore();
        m.x += Math.cos(m.angle) * m.speed;
        m.y += Math.sin(m.angle) * m.speed;
        m.alpha -= 0.005;
        if (m.alpha <= 0) meteors.splice(i, 1);
    });

    fallingTexts.forEach((t, i) => {
        ctx.save();
        ctx.font = `bold ${t.fontSize}px Pacifico`;
        ctx.fillStyle = `hsla(${t.hue}, 100%, 85%, ${t.alpha})`;
        ctx.shadowBlur = 5;
        ctx.shadowColor = `hsla(${t.hue}, 100%, 70%, ${t.alpha})`;
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
        t.y += t.speed;
        t.alpha -= 0.002;
        if (t.y > height + 30 || t.alpha <= 0) fallingTexts.splice(i, 1);
    });

    mouseTrail.forEach((p, i) => {
        p.alpha -= 0.08;
        p.size *= 0.95;
        if (p.alpha <= 0) {
            mouseTrail.splice(i, 1);
        } else {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = `hsl(${p.hue}, 100%, 80%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });

    explosionParticles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.04;
        if (p.alpha <= 0) {
            explosionParticles.splice(i, 1);
        } else {
            ctx.save();
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = `hsl(${p.hue}, 100%, 85%)`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    });

    heartStars.forEach((star) => {
        if (star.mode === 'exploding') {
            star.x += star.velocityX;
            star.y += star.velocityY;
            star.velocityX *= 0.96;
            star.velocityY *= 0.96;
            if (Math.abs(star.velocityX) < 0.1 && Math.abs(star.velocityY) < 0.1) {
                star.mode = 'flying';
            }
        } else if (star.mode === 'flying') {
            const dx = star.targetX - star.x;
            const dy = star.targetY - star.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const speed = 0.07;
            if (dist > 1) {
                star.x += dx * speed;
                star.y += dy * speed;
            } else {
                star.mode = 'heart';
            }
        } else { // mode === 'heart'
            const centerX = width / 2;
            const centerY = height / 2 + 20;
            const deltaX = star.originalX - centerX;
            const deltaY = star.originalY - centerY;
            const beatScale = 1 + Math.sin(heartBeat) * 0.1;
            star.x = centerX + deltaX * beatScale;
            star.y = centerY + deltaY * beatScale;

            const distanceToMouse = Math.hypot(mouseX - star.x, mouseY - star.y);
            if (distanceToMouse < 100) {
                const interactionForce = (100 - distanceToMouse) / 100;
                const angle = Math.atan2(star.y - mouseY, star.x - mouseX);
                star.x += Math.cos(angle) * interactionForce * 10;
                star.y += Math.sin(angle) * interactionForce * 10;
            }
        }

        star.twinkle += star.twinkleSpeed;
        const twinkleOpacity = star.brightness * (0.3 + 0.7 * Math.sin(star.twinkle));
        const finalHue = 330 + Math.sin(heartColorOffset + star.originalX * 0.01) * 30;

        ctx.save();
        ctx.globalAlpha = twinkleOpacity;
        ctx.fillStyle = `hsl(${finalHue}, 90%, 85%)`;
        ctx.shadowBlur = 12;
        ctx.shadowColor = `hsl(${finalHue}, 90%, 70%)`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    });

    requestAnimationFrame(animate);
}

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    for (let i = 0; i < 3; i++) {
        mouseTrail.push({
            x: e.clientX + (Math.random() - 0.5) * 15,
            y: e.clientY + (Math.random() - 0.5) * 15,
            size: Math.random() * 2 + 1.5,
            alpha: 1,
            hue: Math.random() * 360
        });
    }
});

canvas.addEventListener('click', (e) => {
    const particleCount = 100;
    const angleIncrement = (Math.PI * 2) / particleCount;
    for (let i = 0; i < particleCount; i++) {
        const angle = i * angleIncrement;
        const speed = Math.random() * 5 + 2;
        explosionParticles.push({
            x: e.clientX,
            y: e.clientY,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            size: Math.random() * 3 + 1,
            alpha: 1,
            hue: Math.random() * 360
        });
    }
});

window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

    bgCanvas.width = width;
    bgCanvas.height = height;

    heartScale = Math.min(width, height) * 0.015;
    
    // Xóa và tạo lại tất cả khi resize
    meteors.length = 0;
    fallingTexts.length = 0;
    mouseTrail.length = 0;
    explosionParticles.length = 0;
    
    createHeartStars();
    createBackgroundStars();
});

createHeartStars();
createBackgroundStars();
animate();