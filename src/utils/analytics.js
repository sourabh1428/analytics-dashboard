export const trackPageView = (page) => {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('config', 'G-H54PC2W756', {
      page_path: page,
      page_title: document.title
    });
  }
};