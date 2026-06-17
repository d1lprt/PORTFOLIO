// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  
  // 1. Initialize Lenis Smooth Scrolling
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Sync Lenis with GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      lenis.scrollTo(this.getAttribute('href'));
    });
  });

  // 2. Custom Cursor
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorOutline = document.querySelector('.cursor-outline');
  
  // Hide cursor on touch devices
  if(window.matchMedia("(pointer: coarse)").matches) {
    cursorDot.style.display = 'none';
    cursorOutline.style.display = 'none';
  } else {
    window.addEventListener('mousemove', (e) => {
      const posX = e.clientX;
      const posY = e.clientY;

      // Dot follows instantly
      cursorDot.style.left = `${posX}px`;
      cursorDot.style.top = `${posY}px`;

      // Outline follows with slight delay via GSAP
      gsap.to(cursorOutline, {
        x: posX,
        y: posY,
        duration: 0.15,
        ease: "power2.out"
      });
    });

    // Hover effect for links
    const links = document.querySelectorAll('a');
    links.forEach(link => {
      link.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hover');
      });
      link.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hover');
      });
    });
  }

  // 3. Hero Initial Animation
  const heroTimeline = gsap.timeline();
  
  heroTimeline.fromTo('.hero-title', 
    { y: 200, opacity: 0, skewY: 10 },
    { y: 0, opacity: 1, skewY: 0, duration: 1.2, stagger: 0.15, ease: "power4.out", delay: 0.2 }
  )
  .fromTo('.hero-bottom',
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
    "-=0.5"
  );


  // 4. About Text Reveal Animation
  // Use SplitType to split the text into words
  const aboutText = new SplitType('.about-text', { types: 'lines, words' });
  
  gsap.to(aboutText.words, {
    opacity: 1,
    stagger: 0.05,
    scrollTrigger: {
      trigger: '.about',
      start: "top 60%",
      end: "bottom 70%",
      scrub: true,
      // markers: false
    }
  });


  // 5. Projects Reveal
  const projects = document.querySelectorAll('.project-item');
  
  projects.forEach((project, index) => {
    gsap.fromTo(project, 
      { opacity: 0, y: 50 },
      { 
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: project,
          start: "top 85%",
          toggleActions: "play none none reverse"
        }
      }
    );
  });

  // 6. Magnetic Effect for Social Links
  const magneticItems = document.querySelectorAll('.magnetic');
  
  magneticItems.forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const position = item.getBoundingClientRect();
      const currentX = gsap.getProperty(item, "x") || 0;
      const currentY = gsap.getProperty(item, "y") || 0;
      
      // Calculate original center by ignoring current translation
      const origLeft = position.left - currentX;
      const origTop = position.top - currentY;

      const x = e.clientX - origLeft - position.width / 2;
      const y = e.clientY - origTop - position.height / 2;
      
      gsap.to(item, {
        x: x * 0.3,
        y: y * 0.3,
        duration: 0.5,
        ease: "power3.out"
      });
    });

    item.addEventListener('mouseleave', () => {
      gsap.to(item, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "elastic.out(1, 0.3)"
      });
    });
  });

});
