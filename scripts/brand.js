// window.onbeforeunload = function () {
//     window.scrollTo(0, 0);
// };
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const body = document.querySelector('body');
    const navContainer = document.querySelector('.nav-container');
    let mouseoutTimer = null;
    navContainer.addEventListener('mouseover', () => {
        clearTimeout(mouseoutTimer);
        navContainer.classList.add('hovered');
    });
    navContainer.addEventListener('mouseout', (event) => {
        if (!navContainer.contains(event.relatedTarget)) {
            clearTimeout(mouseoutTimer);
            mouseoutTimer = setTimeout(() => {
                navContainer.classList.remove('hovered');
            }, 500);
        }
    });
    const toggleNav = () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollFactorMenuHide = 25;
        if (scrollTop > scrollFactorMenuHide) {
            body.classList.add('scrolled');
        }
        else if (scrollTop < scrollFactorMenuHide) {
            body.classList.remove('scrolled');
        }
    };
    toggleNav();
    window.addEventListener('scroll', () => {
        toggleNav();
    });
});
