/* Ultramarins Tarambana — persiana que s'obre, prestatgeria de llaunes i cistella del menú de 18,90 € */
gsap.registerPlugin(ScrollTrigger);
const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

const ICON = {
  fish: 'M2 9c4-6 12-6 16 0-4 6-12 6-16 0zm16 0l6-4v8z',
  tomato: 'M13 5a6 6 0 1 1 0 12a6 6 0 0 1 0-12zm-2-4h4l-2 3z',
  oval: 'M4 9a9 5 0 1 0 18 0a9 5 0 1 0-18 0z',
  drop: 'M13 1c3 5 6 8 6 11a6 6 0 0 1-12 0c0-3 3-6 6-11z',
  ring: 'M13 3a6 6 0 1 1 0 12a6 6 0 0 1 0-12zm0 3a3 3 0 1 0 0 6a3 3 0 0 0 0-6z',
  leaf: 'M3 15C3 6 12 2 23 3c-1 11-8 14-20 12z',
  cube: 'M6 4h14v11H6z',
  bread: 'M3 12c0-6 20-6 20 0v3H3z'
};
const TINS = [
  ['Tomàquet de Barbastro', 'jar', '#d6452f', 'tomato', 'Amanida de tomàquet de Barbastro, tonyina, taperes i olives d\'Aragó'],
  ['Tomàquet, burrata i pesto', 'jar', '#6d7a3a', 'leaf', 'Amanida de tomàquet ratllat, burrata i pesto'],
  ['Patates braves', 'round', '#e0a82e', 'cube', 'Les braves de tota la vida'],
  ['Ensaladilla russa', 'round', '#d99a86', 'oval', 'Ensaladilla russa de la casa'],
  ['Sobrassada amb mel', 'round', '#e07a2f', 'drop', 'Sobrassada a la planxa amb mel'],
  ['Bunyols de bacallà', 'round', '#1b2a44', 'oval', 'Bunyols de bacallà'],
  ['Sardina fumada', 'flat', '#5b7b99', 'fish', 'Torrada de sardina fumada'],
  ['Anxova 00', 'flat', '#a8231c', 'fish', 'Anxova 00 sobre brioix de mantega fumada'],
  ['Pinxo de truita', 'round', '#d9a520', 'oval', 'Pinxo de truita de patates'],
  ['Croquetes d\'ibèric', 'round', '#7a2231', 'oval', 'Croquetes d\'ibèric'],
  ['Croquetes de gamba', 'round', '#e8604c', 'oval', 'Croquetes de gamba vermella'],
  ['Croquetes de pollastre', 'round', '#9a6a3a', 'oval', 'Croquetes de pollastre a l\'ast'],
  ['Calamars a l\'andalusa', 'flat', '#1f7a7a', 'ring', 'Calamars a l\'andalusa'],
  ['Roast beef de pastrami', 'jar', '#2f4a33', 'leaf', 'Roast beef de pastrami amb salsa vitello tonnato']
];
const SEGONS = [['Brioix de cochinita pibil', 'bread'], ['Brioix de calamars', 'ring'], ['Callos cap i pota', 'drop'], ['Bikini trufat', 'bread'], ['Bikini menorquí', 'bread'], ['Bikini clàssic', 'bread']];
const tinHTML = (t, i, seg) => {
  const [name, type, c1, icon, desc] = t;
  return `<button class="tin tin--${seg ? 'seg' : type}" type="button" data-i="${i}" ${seg ? 'data-seg="1"' : ''} style="--c1:${seg ? '#1b2a44' : c1}">
    <div class="tin__body"><div class="tin__label"><em>${seg ? 'SEGON' : 'Nº ' + String(i + 1).padStart(2, '0')}</em><svg viewBox="0 0 26 18" aria-hidden="true"><path fill-rule="evenodd" d="${ICON[icon]}"/></svg><b>${name}</b></div></div>
    ${desc ? `<span class="tin__tip">${desc}</span>` : ''}</button>`;
};
const shelves = $$('.shelf[data-shelf]');
[[0, 5], [5, 10], [10, 14]].forEach(([a, b], s) => shelves[s].innerHTML = TINS.slice(a, b).map((t, k) => tinHTML(t, a + k)).join(''));
$('#segons').innerHTML = SEGONS.map((s, i) => tinHTML([s[0], 'seg', '', s[1], ''], i, true)).join('');

/* ---------- cistella ---------- */
let picks = [], seg = null;
const basket = $('#basket');
function renderBasket() {
  const slots = [0, 1, 2].map(k => {
    const i = picks[k];
    return i === undefined ? '<span class="slot"></span>' : `<span class="slot is-full" style="--c1:${TINS[i][2]}">Nº${i + 1}</span>`;
  }).join('') + (seg === null ? '<span class="slot slot--seg">2n</span>' : '<span class="slot slot--seg is-full" style="--c1:#caa97a">2n ✓</span>');
  $('#slots').innerHTML = slots;
  const left = 3 - picks.length;
  $('#basketTxt').textContent = left ? `${left > 1 ? 'Et falten ' + left + ' llaunes' : 'Et falta 1 llauna'}${seg === null ? ' i el segon' : ''}` : seg === null ? 'Ara tria el segon' : 'Llest! 4 platillos + postre + beguda';
  $$('.tin[data-i]:not([data-seg])').forEach(t => t.classList.toggle('is-in', picks.includes(+t.dataset.i)));
  $$('.tin[data-seg]').forEach(t => t.classList.toggle('is-in', +t.dataset.i === seg));
}
function fly(tin) {
  const r = tin.querySelector('.tin__body').getBoundingClientRect(), b = basket.getBoundingClientRect();
  const c = tin.querySelector('.tin__body').cloneNode(true);
  Object.assign(c.style, { position: 'fixed', left: r.left + 'px', top: r.top + 'px', width: r.width + 'px', height: r.height + 'px', zIndex: 90, margin: 0, pointerEvents: 'none', '--c1': getComputedStyle(tin).getPropertyValue('--c1') });
  document.body.appendChild(c);
  gsap.to(c, { left: b.left + 30, top: b.top + 6, scale: .25, rotation: 20, duration: .7, ease: 'power2.in', onComplete: () => c.remove() });
}
document.addEventListener('click', e => {
  const t = e.target.closest('.tin'); if (!t) return;
  const i = +t.dataset.i;
  if (t.dataset.seg) { seg = seg === i ? null : i; if (seg !== null) fly(t); }
  else if (picks.includes(i)) picks = picks.filter(x => x !== i);
  else { picks.push(i); if (picks.length > 3) picks.shift(); fly(t); }
  basket.classList.add('is-on');
  renderBasket();
});
renderBasket();
ScrollTrigger.create({ trigger: '#colmado', start: 'top 60%', end: 'bottom 40%', onToggle: s => { if (s.isActive || picks.length) basket.classList.add('is-on'); else basket.classList.remove('is-on'); } });

/* ---------- persiana ---------- */
document.documentElement.style.overflow = 'hidden';
gsap.timeline({ delay: .5 })
  .to('#shutter span', { rotation: 4, duration: .25, yoyo: true, repeat: 1 })
  .to('#shutter', { yPercent: -100, duration: 1.1, ease: 'power3.inOut', onComplete: () => { $('#shutter').remove(); document.documentElement.style.overflow = ''; } })
  .from('.hero__title', { y: 60, opacity: 0, duration: 1, ease: 'expo.out' }, '-=.5')
  .from(['.enamel', '.hero__lead', '.hero__row'], { y: 30, opacity: 0, duration: .8, stagger: .08 }, '<.1')
  .from('.hero__pics img', { y: 80, opacity: 0, duration: 1, stagger: .12, ease: 'expo.out', clearProps: 'opacity' }, '<')
  .from('.price-tag', { scale: 0, rotation: -40, duration: .8, ease: 'back.out(2)' }, '-=.4');

/* ---------- cinta ---------- */
$('#ribbon').innerHTML = ('Terrassa ✦ Barra ✦ Cuina ✦ Dolç ✦ Vins ✦ Platillos per compartir ✦ Davant del mar ✦ ').repeat(6).split('✦').map(w => `<span>${w.trim()}</span><span>✦</span>`).join('');
gsap.to('#ribbon', { xPercent: -50, ease: 'none', duration: 40, repeat: -1 });

/* ---------- llaunes obertes: la tapa es pela ---------- */
const CANS = [['maps/g05', 'Burrata i tomàquet'], ['maps/g07', 'Croquetes de la casa'], ['ig/p12', 'Bacallà'], ['maps/g04', 'Braves i platillos'], ['ig/p10', 'Coca davant del mar'], ['ig/p03', 'Peix del dia']];
$('#cans').innerHTML = CANS.map(([s, t], i) => `<figure><div class="can"><div class="can__in"><img src="assets/${s}.jpg" alt="${t}" loading="lazy"></div><div class="can__lid"><span>Nº ${i + 1}</span></div></div><figcaption>${t}</figcaption></figure>`).join('');
$$('.can__lid').forEach((l, i) => gsap.to(l, { rotationX: -108, y: -30, opacity: 0, duration: 1.2, ease: 'power3.inOut', delay: (i % 3) * .12, transformPerspective: 800, scrollTrigger: { trigger: l, start: 'top 80%', once: true } }));

/* ---------- apariciones ---------- */
$$('.head, .sub, .sign, .reviews blockquote, .ticket, .visita__img').forEach(n => gsap.from(n, { y: 50, opacity: 0, duration: 1, ease: 'expo.out', clearProps: 'opacity', scrollTrigger: { trigger: n, start: 'top 88%', once: true } }));
$$('.shelf').forEach(s => gsap.from(s.children, { y: -40, opacity: 0, duration: .7, ease: 'bounce.out', stagger: .06, clearProps: 'transform,opacity', scrollTrigger: { trigger: s, start: 'top 85%', once: true } }));
