const photoCategories = {
    portas: [4, 40, 61, 65],
    escadas: [8, 10, 12, 13, 18, 30, 31, 37, 38, 46, 47, 50, 52, 59, 60, 62, 68],
    cozinhas: [1, 3, 5, 19, 22, 25, 32, 36, 48, 58, 64],
    casabanho: [26, 34, 35, 53],
    armarios: [11, 14, 21, 23, 24, 27, 28, 29, 32, 42, 43, 44, 45, 51, 54, 63, 66],
    outros: [6, 7, 9, 15, 16, 17, 20, 33, 39, 41, 49, 55, 56, 57, 65, 67],
};

const catLabels = {
    portas: 'Portas',
    escadas: 'Escadas',
    cozinhas: 'Cozinhas',
    casabanho: 'Casa de Banho',
    armarios: 'Armários',
    outros: 'Outros Projetos',
};

const heroNums = [6, 36, 65, 10, 14, 22];

const heroSlides = document.getElementById('heroSlides');
const heroDots = document.getElementById('heroDots');
let heroIdx = 0;

heroNums.forEach((n, i) => {
    const s = document.createElement('div');
    s.className = 'hero-slide' + (i === 0 ? ' active' : '');
    s.style.backgroundImage = `url('fotos/foto (${n}).jpg')`;
    heroSlides.appendChild(s);

    const d = document.createElement('div');
    d.className = 'hero-dot' + (i === 0 ? ' active' : '');
    d.onclick = () => goHero(i);
    heroDots.appendChild(d);
});

function goHero(i) {
    heroSlides.children[heroIdx].classList.remove('active');
    heroDots.children[heroIdx].classList.remove('active');
    heroIdx = i;
    heroSlides.children[heroIdx].classList.add('active');
    heroDots.children[heroIdx].classList.add('active');
}
setInterval(() => goHero((heroIdx + 1) % heroNums.length), 5000);

const allItems = [];
Object.entries(photoCategories).forEach(([cat, nums]) => {
    nums.forEach(n => allItems.push({ n, cat, label: catLabels[cat] }));
});

const grid = document.getElementById('portfolioGrid');
let currentCat = 'all';

function buildGrid(filter) {
    grid.innerHTML = '';
    const visible = filter === 'all' ? allItems : allItems.filter(x => x.cat === filter);
    visible.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = 'portfolio-item';
        el.dataset.cat = item.cat;
        // CORREÇÃO: Adicionado "fotos/" na tag <img> da grelha de portfólio
        el.innerHTML = `
      <img src="fotos/foto (${item.n}).jpg" alt="${item.label}" loading="lazy"/>
      <div class="portfolio-overlay">
        <div>
          <span class="portfolio-cat">${item.label}</span>
          <p class="portfolio-label">Projeto #${item.n}</p>
        </div>
      </div>`;
        el.onclick = () => openLightbox(i, visible);
        grid.appendChild(el);
    });
}
buildGrid('all');

document.getElementById('portfolioTabs').addEventListener('click', e => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    buildGrid(btn.dataset.filter);
});

let lbItems = [], lbIdx = 0;
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbCap = document.getElementById('lbCaption');

function openLightbox(i, items) {
    lbItems = items; lbIdx = i;
    lbImg.src = `fotos/foto (${items[i].n}).jpg`;
    lbCap.textContent = items[i].label;
    lb.classList.add('open');
}
document.getElementById('lbClose').onclick = () => lb.classList.remove('open');
lb.onclick = e => { if (e.target === lb) lb.classList.remove('open'); };

document.getElementById('lbPrev').onclick = e => {
    e.stopPropagation();
    lbIdx = (lbIdx - 1 + lbItems.length) % lbItems.length;
    lbImg.src = `fotos/foto (${lbItems[lbIdx].n}).jpg`;
    lbCap.textContent = lbItems[lbIdx].label;
};

document.getElementById('lbNext').onclick = e => {
    e.stopPropagation();
    lbIdx = (lbIdx + 1) % lbItems.length;
    lbImg.src = `fotos/foto (${lbItems[lbIdx].n}).jpg`;
    lbCap.textContent = lbItems[lbIdx].label;
};

document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') lb.classList.remove('open');
    if (e.key === 'ArrowLeft') document.getElementById('lbPrev').click();
    if (e.key === 'ArrowRight') document.getElementById('lbNext').click();
});

const vgrid = document.getElementById('videosGrid');
for (let i = 1; i <= 3; i++) {
    const c = document.createElement('div');
    c.className = 'video-card';

    c.innerHTML = `<video autoplay loop muted playsinline preload="metadata" style="width: 100%; display: block;">
    <source src="videos/video (${i}).mp4" type="video/mp4"/>
  </video>`;
    vgrid.appendChild(c);
}

document.getElementById('sobreImg').onerror = function () {
    this.src = 'fotos/foto (5).jpg';
};

const nav = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 400);
});

const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));