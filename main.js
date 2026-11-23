(function () {
  // ---------- 헤더 스크롤 상태 ----------
  const header = document.getElementById('header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- 모바일 메뉴 ----------
  const menuBtn = document.getElementById('menuBtn');
  menuBtn.addEventListener('click', () => document.body.classList.toggle('menu-open'));
  document.querySelectorAll('#gnb a').forEach(a =>
    a.addEventListener('click', () => document.body.classList.remove('menu-open'))
  );

  // ---------- 메뉴 활성화 (스크롤 위치 기준) ----------
  const navLinks = [...document.querySelectorAll('#gnb a')];
  const targets = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  function spy() {
    const y = window.scrollY + window.innerHeight * 0.4;
    let idx = -1;
    targets.forEach((t, i) => { if (t.getBoundingClientRect().top + window.scrollY <= y) idx = i; });
    navLinks.forEach((a, i) => a.classList.toggle('active', i === idx));
  }
  window.addEventListener('scroll', spy, { passive: true });
  spy();

  // ---------- 메인 롤링배너 ----------
  const slides = [...document.querySelectorAll('.hero-slide')];
  const dotsWrap = document.querySelector('.hero-dots');
  let cur = 0, timer;
  slides.forEach((_, i) => {
    const b = document.createElement('button');
    b.setAttribute('aria-label', (i + 1) + '번 배너');
    b.addEventListener('click', () => { go(i); restart(); });
    dotsWrap.appendChild(b);
  });
  const dots = [...dotsWrap.children];
  function go(n) {
    cur = (n + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === cur));
    dots.forEach((d, i) => d.classList.toggle('active', i === cur));
  }
  function restart() { clearInterval(timer); timer = setInterval(() => go(cur + 1), 6000); }
  document.querySelector('.hero-arrow.prev').addEventListener('click', () => { go(cur - 1); restart(); });
  document.querySelector('.hero-arrow.next').addEventListener('click', () => { go(cur + 1); restart(); });
  go(0); restart();
  // 배너 위에 마우스가 있으면 자동 넘김 일시정지
  const hero = document.getElementById('hero');
  hero.addEventListener('mouseenter', () => clearInterval(timer));
  hero.addEventListener('mouseleave', restart);

  // ---------- 스크롤 등장 애니메이션 ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---------- 진료과목 이미지 메뉴 ----------
  const deptTabs = [...document.querySelectorAll('.dept-tab')];
  const depts = deptTabs.map(t => document.querySelector(t.getAttribute('href')));
  function deptSpy() {
    const y = window.innerHeight * 0.45;
    let idx = -1;
    depts.forEach((d, i) => { if (d && d.getBoundingClientRect().top <= y) idx = i; });
    deptTabs.forEach((t, i) => t.classList.toggle('active', i === idx));
  }
  window.addEventListener('scroll', deptSpy, { passive: true });
  deptSpy();

  // ---------- 둘러보기 썸네일 ----------
  const cap = document.getElementById('tourCap');
  document.querySelectorAll('#tourThumbs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#tourThumbs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      cap.textContent = btn.textContent;
    });
  });

  // ---------- 퀵바 ----------
  document.getElementById('toTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  const modal = document.getElementById('hoursModal');
  document.getElementById('openHours').addEventListener('click', e => { e.preventDefault(); modal.classList.add('open'); });
  modal.addEventListener('click', e => {
    if (e.target === modal || e.target.closest('.modal-close')) modal.classList.remove('open');
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') modal.classList.remove('open'); });
})();
