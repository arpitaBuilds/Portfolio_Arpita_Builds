(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  // Original-template interactive hanging ID card.
  const originalCard = $('#originalIdCard');
  const originalFlip = $('#originalIdFlip');
  if (originalCard && originalFlip) {
    const flipOriginalCard = () => originalFlip.classList.toggle('back');
    originalCard.addEventListener('click', flipOriginalCard);
    originalCard.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); flipOriginalCard(); }
    });
  }
  const originalTyping = $('#originalTyping');
  if (originalTyping) {
    const phrases = ['Building, testing, learning', 'AI/ML · Research · Development', 'Curiosity into code'];
    if (reduceMotion) originalTyping.textContent = phrases[0];
    else { let phrase = 0, char = 0, deleting = false; const type = () => {
      const current = phrases[phrase]; char += deleting ? -1 : 1; originalTyping.textContent = current.slice(0, char);
      let delay = deleting ? 25 : 48;
      if (!deleting && char === current.length) { deleting = true; delay = 1250; }
      else if (deleting && char === 0) { deleting = false; phrase = (phrase + 1) % phrases.length; delay = 260; }
      window.setTimeout(type, delay);
    }; type(); }
  }

  // Update the year and reading progress.
  $('#currentYear').textContent = new Date().getFullYear();
  const progress = $('#scrollProgress');
  const header = $('#siteHeader');
  const updateScroll = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
    header.classList.toggle('scrolled', window.scrollY > 18);
  };
  window.addEventListener('scroll', updateScroll, { passive: true });
  updateScroll();

  // Mobile navigation.
  const menuToggle = $('#menuToggle');
  const navLinks = $('#navLinks');
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  $$('#navLinks a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  // Theme toggle, kept client-side only (no storage requirement).
  $('#themeToggle').addEventListener('click', () => {
    document.body.classList.toggle('soft-theme');
    const light = document.body.classList.contains('soft-theme');
    $('#themeToggle').textContent = light ? '☾' : '◐';
    $('#themeToggle').setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
  });

  // Small role rotator in the hero.
  const roles = ['Artificial Intelligence', 'Machine Learning', 'Data Science', 'AI-powered applications', 'Research & experiments'];
  const roleEl = $('#rotatingRole');
  if (!reduceMotion) {
    let index = 0;
    window.setInterval(() => {
      index = (index + 1) % roles.length;
      roleEl.animate([{ opacity: 0, transform: 'translateY(5px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 350, easing: 'ease-out' });
      roleEl.textContent = roles[index];
    }, 2600);
  }

  // Reveal elements as they enter the viewport.
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    $$('.reveal').forEach(el => observer.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in-view'));
  }

  // Filter projects by topic.
  const filterButtons = $$('.filter-btn');
  const projectCards = $$('.project-card');
  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.toggle('active', btn === button));
    const filter = button.dataset.filter;
    projectCards.forEach((card, index) => {
      const show = filter === 'all' || card.dataset.category === filter;
      card.hidden = !show;
      if (show && !reduceMotion) {
        card.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 280, delay: index * 35, easing: 'ease-out' });
      }
    });
  }));

  // Certificate and patent image lightbox.
  const lightbox = $('#lightbox');
  const lightboxImage = $('#lightboxImage');
  const lightboxTitle = $('#lightboxTitle');
  const lightboxOpen = $('#lightboxOpen');
  $$('[data-image]').forEach(button => button.addEventListener('click', () => {
    const image = button.dataset.image;
    const title = button.dataset.title || 'Preview';
    lightboxImage.src = image;
    lightboxImage.alt = title;
    lightboxTitle.textContent = title;
    lightboxOpen.href = image;
    lightbox.showModal();
  }));
  $('#modalClose').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

  // Project detail modals keep the card descriptions short while adding useful context.
  const projectNotes = {
    documind: {
      title: 'DocuMind — Intelligent Document Organization Assistant',
      body: `<p><strong>Goal:</strong> turn uploaded PDFs into structured, useful learning material.</p><ul><li>Document text extraction and analysis workflow.</li><li>Context-aware quiz generation using an LLM-powered pipeline.</li><li>Gradio interface with Langflow/LangGraph orchestration and Groq integration.</li><li>Redis and RabbitMQ/Celery were explored for caching and background processing; describe them as implemented only where your final code confirms it.</li></ul><p><strong>Next improvement:</strong> add a live demo, a system architecture diagram, and a repository link for the exact project.</p>`
    },
    parkinson: {
      title: "Parkinson's Disease Prediction Using Voice Data",
      body: `<p><strong>Goal:</strong> explore prediction from voice-related features while making model behavior more interpretable.</p><ul><li>Fuzzy K-Nearest Neighbors as a modeling approach.</li><li>SHAP-based feature interpretation and investigation of influential inputs.</li><li>Exploration of Digital Twin concepts for continuous patient-state monitoring.</li></ul><p>This is an experimental research model, not a clinically validated diagnostic system. Add the exact repository, dataset citation, evaluation results, and limitations before publication.</p>`
    },
    climate: {
      title: 'Hybrid ANN–Random Forest Climate Forecasting',
      body: `<p><strong>Goal:</strong> explore hybrid forecasting by combining Artificial Neural Networks and Random Forest.</p><ul><li>Feature engineering and temporal data splitting.</li><li>Model evaluation using appropriate regression metrics.</li><li>Seasonal bias correction to study forecasting reliability.</li></ul><p>When presenting results, include the target variable, data period, held-out test performance, baseline comparison, and limitations.</p>`
    },
    api: {
      title: 'Todo List REST API — Native Node.js',
      body: `<p><strong>Goal:</strong> understand how HTTP servers and REST endpoints work without relying on Express.</p><ul><li>Request handling and routing using native Node.js.</li><li>Task priorities, due dates, overdue detection, and sorting.</li><li>In-memory task data and structured setup/API documentation.</li></ul><p><strong>Next improvement:</strong> add automated tests, persistent storage, validation, and a clear API reference.</p>`
    },
    forensicai: {
      title: 'ForensicAI — Suspect Visualization using Latent Diffusion Models',
      body: `<p><strong>Overview:</strong> ForensicAI is an experimental end-to-end research system that accepts natural-language witness descriptions and generates two outputs: a photorealistic mugshot and a forensic pencil sketch.</p><ul><li><strong>Generation:</strong> Stable Diffusion v1.5 with CLIP ViT-L/14 text conditioning.</li><li><strong>Latent pipeline:</strong> VAE-compressed latent diffusion; the project write-up reports a 48× computational reduction versus a pixel-space comparison.</li><li><strong>Face matching:</strong> DeepFace ensemble using FaceNet512 and VGG-Face embeddings with cosine similarity against a persistent database.</li><li><strong>Reported experimental results:</strong> FID 5.2 (mugshot), CLIP Score 0.31, human realism 4.1/5, and 100% classification accuracy at a calibrated 0.60 cosine-similarity threshold on the experimental dataset.</li><li><strong>Conference:</strong> reported as accepted for presentation at ICACS 2026 (International Conference on Artificial Intelligence, Communication Technologies and Smart Cities).</li></ul><p><strong>Important limitation:</strong> these are project-reported experimental results, not evidence of real-world forensic validity. Generated images and similarity scores should be treated as investigative research aids only, not as proof of identity or a basis for criminal decisions.</p><p><strong>Tech stack:</strong> Python, Stable Diffusion v1.5, CLIP ViT-L/14, DeepFace, PyTorch, Gradio, Hugging Face Diffusers, latent diffusion, computer vision, and NLP.</p>`
    }
  };
  const projectModal = $('#projectModal');
  $$('.details-button').forEach(button => button.addEventListener('click', () => {
    const note = projectNotes[button.dataset.project];
    if (!note) return;
    $('#projectModalTitle').textContent = note.title;
    $('#projectModalBody').innerHTML = note.body;
    projectModal.showModal();
  }));
  $('#projectModalClose').addEventListener('click', () => projectModal.close());
  $('#projectModalDone').addEventListener('click', () => projectModal.close());
  projectModal.addEventListener('click', event => { if (event.target === projectModal) projectModal.close(); });

  // LinkedIn profile is linked directly in the hero and contact section.
  const LINKEDIN_URL = 'https://www.linkedin.com/in/arpita-waghmare-33a5a6314';
  if (LINKEDIN_URL && $('#linkedinLink')) {
    $('#linkedinLink').href = LINKEDIN_URL;
    if ($('#linkedinRow')) $('#linkedinRow').hidden = false;
  }
})();
