export const attachDesktopNavigationHandlers = (scrollFactorMenuHide) => {
    let mouseoutTimer = null;

    const desktopNav = document.querySelector('.desktop-nav');

    if (desktopNav) desktopNav.addEventListener('mouseover', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        clearTimeout(mouseoutTimer);
        if (scrollTop > scrollFactorMenuHide) desktopNav.classList.add('hovered');
    });
    if (desktopNav) desktopNav.addEventListener('mouseout', (event) => {
        if (!desktopNav.contains(event.relatedTarget)) {
            clearTimeout(mouseoutTimer);
            mouseoutTimer = setTimeout(() => {
                desktopNav.classList.remove('hovered');
            }, 500);
        }
    });
}

export const attachMobileNavigationHandlers = () => {
    // Mobile menu toggle functionality
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const body = document.querySelector('body');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            console.log("toggling mobile menu");
            body.classList.toggle('mobile-menu-open');
        });
    }
}

export const toggleNav = (scrollFactorMenuHide = 0) => {
    const body = document.querySelector('body');
    const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    if (scrollTop > scrollFactorMenuHide) {
        body.classList.add('scrolled');
    }
    else if (scrollTop < scrollFactorMenuHide) {
        body.classList.remove('scrolled');
    }
};