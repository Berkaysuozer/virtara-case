export default {
  mounted(el, binding) {
    const { hoverColor } = binding.value;
    
    el.addEventListener('mouseenter', () => {
      el.dataset.originalBg = getComputedStyle(el).backgroundColor;
      el.style.backgroundColor = hoverColor;
    });
    
    el.addEventListener('mouseleave', () => {
      el.style.backgroundColor = el.dataset.originalBg;
    });
  },
  
  unmounted(el) {
    el.removeEventListener('mouseenter', () => {});
    el.removeEventListener('mouseleave', () => {});
  }
};