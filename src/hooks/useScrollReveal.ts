import { useEffect } from 'react';

export const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      }),
      { threshold: 0.08, rootMargin: '-40px 0px' }
    );
    document.querySelectorAll('.scroll-fade-up').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};
