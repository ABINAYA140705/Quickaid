(function(){
  "use strict";

  // ---------- Navigation ----------
  var pages = document.querySelectorAll('.page');
  var navButtons = document.querySelectorAll('nav.links button');
  var navLinks = document.getElementById('navLinks');
  var menuToggle = document.getElementById('menuToggle');

  function goTo(pageId){
    pages.forEach(function(p){ p.classList.remove('active'); });
    var target = document.getElementById('page-' + pageId);
    if(target) target.classList.add('active');
    navButtons.forEach(function(b){
      b.classList.toggle('active', b.dataset.page === pageId);
    });
    navLinks.classList.remove('open');
    window.scrollTo({top:0, behavior:'smooth'});
    if(pageId === 'find') renderDonors();
    if(pageId === 'home') updateStats();
  }

  navButtons.forEach(function(btn){
    btn.addEventListener('click', function(){ goTo(btn.dataset.page); });
  });
  document.querySelectorAll('[data-goto]').forEach(function(btn){
    btn.addEventListener('click', function(){ goTo(btn.dataset.goto); });
  });
  menuToggle.addEventListener('click', function(){
    navLinks.classList.toggle('open');
  });

  // ---------- Theme toggle ----------
  var themeToggle = document.getElementById('themeToggle');
  function applyTheme(mode){
    if(mode === 'dark'){
      document.documentElement.setAttribute('data-theme','dark');
      themeToggle.textContent = '☀️';
    } else {
      document.documentElement.setAttribute('data-theme','light');
      themeToggle.textContent = '🌙';
    }
  }
  var savedTheme = 'light';
  try { savedTheme = localStorage.getItem('quickaid_theme') || 'light'; } catch(e) {}
  applyTheme(savedTheme);
  themeToggle.addEventListener('click', function(){
    var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('quickaid_theme', next); } catch(e) {}
  });

  // ---------- Donor storage ----------
  function loadDonors(){
    try {
      var raw = localStorage.getItem('quickaid_donors');
      return raw ? JSON.parse(raw) : [];
    } catch(e) { return []; }
  }
  function saveDonors(list){
    try { localStorage.setItem('quickaid_donors', JSON.stringify(list)); } catch(e) {}
  }

  function updateStats(){
    var donors = loadDonors();
    document.getElementById('statDonors').textContent = donors.length;
    var cities = new Set(donors.map(function(d){ return d.city.toLowerCase(); }));
    document.getElementById('statCities').textContent = cities.size;
  }

  // ---------- Registration form ----------
  var form = document.getElementById('donorForm');
  var successBanner = document.getElementById('regSuccess');

  function setError(id, msg){
    document.getElementById('err-' + id).textContent = msg || '';
  }

  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('dName').value.trim();
    var blood = document.getElementById('dBlood').value;
    var city = document.getElementById('dCity').value.trim();
    var phone = document.getElementById('dPhone').value.trim();
    var valid = true;

    setError('dName',''); setError('dBlood',''); setError('dCity',''); setError('dPhone','');

    if(name.length < 2){ setError('dName','Please enter your full name.'); valid = false; }
    if(!blood){ setError('dBlood','Please select a blood group.'); valid = false; }
    if(city.length < 2){ setError('dCity','Please enter your city.'); valid = false; }
    if(!/^[6-9]\d{9}$/.test(phone)){ setError('dPhone','Enter a valid 10-digit mobile number.'); valid = false; }

    if(!valid) return;

    var donors = loadDonors();
    donors.push({ name: name, blood: blood, city: city, phone: phone });
    saveDonors(donors);

    form.reset();
    successBanner.style.display = 'block';
    setTimeout(function(){ successBanner.style.display = 'none'; }, 3500);
    updateStats();
  });

  // ---------- Find donors ----------
  var fBlood = document.getElementById('fBlood');
  var fCity = document.getElementById('fCity');
  var tbody = document.getElementById('donorTableBody');
  var emptyState = document.getElementById('emptyState');

  function renderDonors(){
    var donors = loadDonors();
    var bloodFilter = fBlood.value;
    var cityFilter = fCity.value.trim().toLowerCase();

    var filtered = donors.filter(function(d){
      var matchBlood = !bloodFilter || d.blood === bloodFilter;
      var matchCity = !cityFilter || d.city.toLowerCase().indexOf(cityFilter) !== -1;
      return matchBlood && matchCity;
    });

    tbody.innerHTML = '';
    if(filtered.length === 0){
      emptyState.style.display = 'block';
    } else {
      emptyState.style.display = 'none';
      filtered.forEach(function(d){
        var tr = document.createElement('tr');
        tr.innerHTML =
          '<td>' + escapeHtml(d.name) + '</td>' +
          '<td><span class="badge">' + escapeHtml(d.blood) + '</span></td>' +
          '<td>' + escapeHtml(d.city) + '</td>' +
          '<td>' + escapeHtml(d.phone) + '</td>';
        tbody.appendChild(tr);
      });
    }
  }
  function escapeHtml(str){
    var div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
  fBlood.addEventListener('change', renderDonors);
  fCity.addEventListener('input', renderDonors);

  // ---------- About accordion ----------
  var faqs = [
    { q: "Who can donate blood?", a: "Most healthy adults aged 18–65, weighing over 50kg, can donate. A quick health check is done before every donation." },
    { q: "How often can I donate?", a: "Men can donate every 3 months, women every 4 months, as per general guidelines. Always confirm with your local blood bank." },
    { q: "Does donating blood weaken you?", a: "Myth. A healthy donor recovers within 24–48 hours. The body replenishes the donated volume quickly." },
    { q: "Is donating blood painful?", a: "You'll feel a quick pinch from the needle, similar to a routine blood test — the process itself is painless." }
  ];
  var accordion = document.getElementById('accordion');
  faqs.forEach(function(item, idx){
    var el = document.createElement('div');
    el.className = 'accordion-item';
    el.innerHTML =
      '<div class="accordion-head">' + item.q + '<span class="chevron">▾</span></div>' +
      '<div class="accordion-body">' + item.a + '</div>';
    el.querySelector('.accordion-head').addEventListener('click', function(){
      el.classList.toggle('open');
    });
    accordion.appendChild(el);
  });

  // ---------- Init ----------
  updateStats();
  renderDonors();
})();
