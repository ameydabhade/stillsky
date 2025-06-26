import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Animation timeline for page load
export const pageLoadAnimation = () => {
  const tl = gsap.timeline();
  
  // Set initial states
  gsap.set('.header-element', { y: -50, opacity: 0 });
  gsap.set('.weather-card', { scale: 0.8, opacity: 0, rotationY: -15 });
  gsap.set('.forecast-card', { y: 100, opacity: 0 });
  gsap.set('.weather-detail', { x: -30, opacity: 0 });
  gsap.set('.floating-particle', { scale: 0, opacity: 0 });
  
  // Animate header
  tl.to('.header-element', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    stagger: 0.1,
    ease: 'back.out(1.7)'
  })
  
  // Animate main weather card with 3D effect
  .to('.weather-card', {
    scale: 1,
    opacity: 1,
    rotationY: 0,
    duration: 1.2,
    ease: 'power3.out'
  }, '-=0.4')
  
  // Animate weather details
  .to('.weather-detail', {
    x: 0,
    opacity: 1,
    duration: 0.6,
    stagger: 0.1,
    ease: 'power2.out'
  }, '-=0.8')
  
  // Animate forecast card
  .to('.forecast-card', {
    y: 0,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.out'
  }, '-=0.6')
  
  // Animate floating particles
  .to('.floating-particle', {
    scale: 1,
    opacity: 1,
    duration: 0.4,
    stagger: 0.05,
    ease: 'back.out(1.7)'
  }, '-=0.4');

  return tl;
};

// Animated counter for temperature and other numbers
export const animateCounter = (element: HTMLElement, from: number, to: number, duration: number = 1) => {
  const obj = { value: from };
  
  gsap.to(obj, {
    value: to,
    duration,
    ease: 'power2.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toString();
    }
  });
};

// Floating animation for weather icons
export const floatingAnimation = (element: HTMLElement | string) => {
  gsap.to(element, {
    y: -15,
    duration: 2,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
  
  gsap.to(element, {
    rotation: 5,
    duration: 4,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1
  });
};

// Weather card hover effect
export const weatherCardHover = {
  enter: (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1.02,
      y: -5,
      rotationY: 2,
      duration: 0.3,
      ease: 'power2.out'
    });
    
    gsap.to(element.querySelector('.card-glow'), {
      opacity: 0.3,
      duration: 0.3
    });
  },
  
  leave: (element: HTMLElement) => {
    gsap.to(element, {
      scale: 1,
      y: 0,
      rotationY: 0,
      duration: 0.3,
      ease: 'power2.out'
    });
    
    gsap.to(element.querySelector('.card-glow'), {
      opacity: 0,
      duration: 0.3
    });
  }
};

// Refresh animation
export const refreshAnimation = (element: HTMLElement) => {
  gsap.to(element, {
    rotation: 360,
    duration: 0.6,
    ease: 'power2.inOut'
  });
};

// Weather transition effect
export const weatherTransition = (newWeather: string) => {
  const tl = gsap.timeline();
  
  // Fade out current content
  tl.to('.weather-content', {
    opacity: 0,
    scale: 0.95,
    duration: 0.4,
    ease: 'power2.in'
  })
  
  // Change weather state (callback can be added here)
  .call(() => {
    // Weather data update would happen here
  })
  
  // Fade in new content
  .to('.weather-content', {
    opacity: 1,
    scale: 1,
    duration: 0.6,
    ease: 'power2.out'
  });
  
  return tl;
};

// Particle system for background
export const createParticleSystem = (container: HTMLElement, weatherType: string) => {
  const particleCount = weatherType === 'Rain' ? 50 : weatherType === 'Snow' ? 30 : 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = `floating-particle particle-${weatherType.toLowerCase()}`;
    
    // Style based on weather type
    if (weatherType === 'Rain') {
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 10px;
        background: linear-gradient(to bottom, rgba(59, 130, 246, 0.8), rgba(59, 130, 246, 0.2));
        border-radius: 1px;
      `;
    } else if (weatherType === 'Snow') {
      particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
      `;
    } else {
      particle.style.cssText = `
        position: absolute;
        width: 3px;
        height: 3px;
        background: rgba(255, 255, 255, 0.4);
        border-radius: 50%;
      `;
    }
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    container.appendChild(particle);
    
    // Animate particle
    const duration = 3 + Math.random() * 4;
    const delay = Math.random() * 2;
    
    if (weatherType === 'Rain') {
      gsap.to(particle, {
        y: window.innerHeight + 100,
        rotation: 15,
        duration: duration,
        delay: delay,
        repeat: -1,
        ease: 'none'
      });
    } else {
      gsap.to(particle, {
        y: window.innerHeight + 100,
        x: `+=${50 + Math.random() * 100}`,
        rotation: 360,
        duration: duration,
        delay: delay,
        repeat: -1,
        ease: 'none'
      });
    }
  }
};

// Background gradient animation
export const animateBackgroundGradient = (element: HTMLElement, colors: string[]) => {
  gsap.to(element, {
    background: `linear-gradient(135deg, ${colors.join(', ')})`,
    duration: 2,
    ease: 'power2.inOut'
  });
};

// Loading animation
export const loadingAnimation = (element: HTMLElement) => {
  const tl = gsap.timeline({ repeat: -1 });
  
  tl.to(element, {
    scale: 1.1,
    opacity: 0.7,
    duration: 0.8,
    ease: 'power2.inOut'
  })
  .to(element, {
    scale: 1,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.inOut'
  });
  
  return tl;
};

// Stagger animation for weather details
export const staggerWeatherDetails = () => {
  gsap.fromTo('.weather-detail-item', 
    {
      y: 30,
      opacity: 0,
      scale: 0.9
    },
    {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }
  );
};

// Button press animation
export const buttonPressAnimation = (element: HTMLElement) => {
  gsap.to(element, {
    scale: 0.95,
    duration: 0.1,
    yoyo: true,
    repeat: 1,
    ease: 'power2.inOut'
  });
};

// Parallax effect for background elements
export const parallaxScroll = () => {
  const elements = document.querySelectorAll('.parallax-element');
  
  elements.forEach((element, index) => {
    const speed = (index + 1) * 0.3;
    gsap.to(element, {
      yPercent: -50 * speed,
      ease: 'none',
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  });
};

// Advanced scroll animations for page sections
export const initScrollAnimations = () => {
  // Fade in weather cards on scroll
  gsap.utils.toArray('.weather-card, .forecast-card').forEach((card) => {
    gsap.fromTo(card as HTMLElement, 
      {
        opacity: 0,
        y: 50,
        scale: 0.9
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card as HTMLElement,
          start: 'top 85%',
          end: 'top 60%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });

  // Parallax background gradient
  gsap.to('.bg-gradient', {
    backgroundPosition: '50% 100%',
    ease: 'none',
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
};

// Magnetic effect for interactive elements
export const magneticEffect = (element: HTMLElement) => {
  const bounds = element.getBoundingClientRect();
  
  element.addEventListener('mousemove', (e) => {
    const x = e.clientX - bounds.left - bounds.width / 2;
    const y = e.clientY - bounds.top - bounds.height / 2;
    
    gsap.to(element, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out'
    });
  });
  
  element.addEventListener('mouseleave', () => {
    gsap.to(element, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)'
    });
  });
};

// Text reveal animation
export const textRevealAnimation = (element: HTMLElement, delay: number = 0) => {
  const chars = element.textContent?.split('') || [];
  element.innerHTML = chars.map(char => `<span class="char">${char}</span>`).join('');
  
  gsap.fromTo(element.querySelectorAll('.char'), 
    {
      opacity: 0,
      y: 50,
      rotationX: -90
    },
    {
      opacity: 1,
      y: 0,
      rotationX: 0,
      duration: 0.6,
      stagger: 0.02,
      delay,
      ease: 'back.out(1.7)'
    }
  );
}; 