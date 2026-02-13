// TYPOGRAPHY CANVAS - Kinetic type background
const canvas = document.getElementById('typeCanvas');
const ctx = canvas.getContext('2d');
let width, height;
let time = 0;
let letters = [];

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Floating letter system
class Letter {
    constructor() {
        this.chars = ['I', 'N', 'T', 'E', 'R', 'A', 'C', 'T', 'I', 'O', 'N'];
        this.char = this.chars[Math.floor(Math.random() * this.chars.length)];
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = 80 + Math.random() * 200;
        this.rotation = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.001;
        this.opacity = 0.03 + Math.random() * 0.05;
        this.drift = {
            x: (Math.random() - 0.5) * 0.1,
            y: (Math.random() - 0.5) * 0.1
        };
    }

    update() {
        if (prefersReducedMotion) return;
        
        this.x += this.drift.x;
        this.y += this.drift.y;
        this.rotation += this.rotationSpeed;

        // Wrap around screen
        if (this.x < -this.size) this.x = width + this.size;
        if (this.x > width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = height + this.size;
        if (this.y > height + this.size) this.y = -this.size;
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.font = `${this.size}px 'Playfair Display', serif`;
        ctx.fillStyle = `rgba(13, 13, 13, ${this.opacity})`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.char, 0, 0);
        ctx.restore();
    }
}

function initLetters() {
    letters = [];
    const count = Math.floor((width * height) / 100000);
    for (let i = 0; i < count; i++) {
        letters.push(new Letter());
    }
}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
    
    if (letters.length === 0) {
        initLetters();
    }
}

function animate() {
    time++;
    
    ctx.clearRect(0, 0, width, height);
    
    letters.forEach(letter => {
        letter.update();
        letter.draw();
    });
    
    requestAnimationFrame(animate);
}

// Timer
let startTime = Date.now();

function updateTimer() {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = Math.floor(elapsed / 60);
    const seconds = elapsed % 60;
    
    const timeValue = document.querySelector('.time-value');
    timeValue.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    
    requestAnimationFrame(updateTimer);
}

// Progress bar
function updateProgress() {
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = (scrolled / scrollHeight) * 100;
    
    document.querySelector('.progress-bar').style.width = `${progress}%`;
}

window.addEventListener('scroll', updateProgress);

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.2,
    rootMargin: '-50px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animate statements
            const statements = entry.target.querySelectorAll('.statement');
            statements.forEach((statement, i) => {
                setTimeout(() => {
                    statement.classList.add('visible');
                }, i * 200);
            });
            
            // Animate traits
            const traits = entry.target.querySelectorAll('.trait-group');
            traits.forEach((trait, i) => {
                setTimeout(() => {
                    trait.classList.add('visible');
                }, i * 250);
            });
            
            // Animate signature
            const signature = entry.target.querySelector('.signature-section');
            if (signature) {
                setTimeout(() => {
                    signature.classList.add('visible');
                }, 800);
            }
        }
    });
}, observerOptions);

// Observe all chapters
document.querySelectorAll('.chapter').forEach(chapter => {
    observer.observe(chapter);
});

// Replay button
document.querySelector('.replay-button').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reset timer
    startTime = Date.now();
    
    // Reset animations
    setTimeout(() => {
        document.querySelectorAll('.chapter, .statement, .trait-group, .signature-section').forEach(el => {
            el.classList.remove('visible');
        });
    }, 600);
});

// Parallax effect on display title
let ticking = false;

function handleScroll() {
    if (!ticking && !prefersReducedMotion) {
        window.requestAnimationFrame(() => {
            const scrolled = window.scrollY;
            const displayLines = document.querySelectorAll('.display-line');
            
            displayLines.forEach((line, i) => {
                const speed = 1 - (i * 0.15);
                const offset = scrolled * speed * 0.3;
                line.style.transform = `translateY(${offset}px)`;
            });
            
            ticking = false;
        });
        
        ticking = true;
    }
}

window.addEventListener('scroll', handleScroll);

// Initialize
resize();
window.addEventListener('resize', resize);
animate();
updateTimer();
updateProgress();