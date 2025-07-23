import { attachDesktopNavigationHandlers, attachMobileNavigationHandlers, toggleNav } from './navigation.js';
document.addEventListener('DOMContentLoaded', () => {
    const scrollFactorMenuHide = 25;

    attachDesktopNavigationHandlers(scrollFactorMenuHide);
    attachMobileNavigationHandlers(scrollFactorMenuHide);
    
    window.addEventListener('scroll', () => {
        toggleNav(scrollFactorMenuHide);
    });
    toggleNav(scrollFactorMenuHide);

    body.classList.add('loaded');
});