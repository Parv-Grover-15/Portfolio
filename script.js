// 1. MOVING BAND: copy the item many times so the band never has a gap.
//    The CSS animation moves the track left by half its width, then repeats.
const track = document.getElementById('track');
const item = track.firstElementChild;
for (let i = 0; i < 7; i++) track.appendChild(item.cloneNode(true));   // 8 copies in total (an even number)

// 2. FOLDER TILT: the folder turns slightly toward your mouse (3D effect)
const folder = document.getElementById('folder');
document.querySelector('.hero').addEventListener('mousemove', (e) => {
  const x = e.clientX / window.innerWidth - 0.5;    // -0.5 (left) to 0.5 (right)
  const y = e.clientY / window.innerHeight - 0.5;   // -0.5 (top)  to 0.5 (bottom)
  folder.style.setProperty('--ry', (-10 + x * 20) + 'deg');
  folder.style.setProperty('--rx', (6 - y * 16) + 'deg');
});

// 3. CARD TILT: skills and project cards tilt toward the mouse on hover
document.querySelectorAll('.tilt').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--ty', ((e.clientX - r.left) / r.width - 0.5) * 14 + 'deg');
    card.style.setProperty('--tx', (0.5 - (e.clientY - r.top) / r.height) * 14 + 'deg');
  });
  card.addEventListener('mouseleave', () => {          // reset when the mouse leaves
    card.style.setProperty('--tx', '0deg');
    card.style.setProperty('--ty', '0deg');
  });
});

// 4. SCROLL REVEAL: elements with class "reveal" fade in once when they appear
const io = new IntersectionObserver((entries) => {
  entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// 5. MENU: appears after you scroll past most of the front page
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('show', window.scrollY > window.innerHeight * 0.7);
});

// 6. CONTACT FORM: opens the visitor's email app with the message filled in
document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault();
  const d = new FormData(e.target);
  const subject = encodeURIComponent('Project enquiry from ' + d.get('name'));
  const body = encodeURIComponent(d.get('message') + '\n\nReply to: ' + d.get('email'));
  window.location.href = `mailto:you@example.com?subject=${subject}&body=${body}`;   // change the email
});

// 7. FOOTER YEAR
document.getElementById('year').textContent = new Date().getFullYear();
