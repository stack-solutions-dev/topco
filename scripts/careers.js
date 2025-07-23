import { createScrollAnimation, createAnimationFunction } from './utils.js';
import { attachDesktopNavigationHandlers, attachMobileNavigationHandlers, toggleNav } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    const scrollFactorMenuHide = 25;

    attachDesktopNavigationHandlers(scrollFactorMenuHide);
    attachMobileNavigationHandlers(scrollFactorMenuHide);
    

    createScrollAnimation({
        scrollingElementSelector: '.hero .scroll-container',
        animatedElementSelector: '.hero .stuck-content.first h1',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    transform: 'scale(1)',
                    filter: 'blur(0px)',
                    opacity: 1,
                    offset: 0
                },
                {
                    transform: 'scale(2)',
                    filter: 'blur(10px)',
                    opacity: 1,
                    offset: 0.45
                },
                {
                    transform: 'scale(2)',
                    filter: 'blur(10px)',
                    opacity: 0,
                    offset: 0.5
                },
                {
                    transform: 'scale(2)',
                    filter: 'blur(10px)',
                    opacity: 0,
                    offset: 1
                }
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: '.hero .scroll-container',
        animatedElementSelector: '.hero .stuck-content.first',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    opacity: 1,
                    offset: 0
                },
                {
                    opacity: 1,
                    offset: 0.5
                },
                {
                    opacity: 0,
                    offset: 0.6
                },
                {
                    opacity: 0,
                    offset: 1
                },
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: '.hero .scroll-container',
        animatedElementSelector: '.hero .stuck-content.second p',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    opacity: 0,
                    transform: 'translateY(100px)',
                    offset: 0
                },
                {
                    opacity: 0,
                    transform: 'translateY(100px)',
                    offset: 0.6
                },
                {
                    opacity: 1,
                    transform: 'translateY(0)',
                    offset: 0.9
                },
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: '.fullscreen-video-section .scroll-container',
        animatedElementSelector: '.fullscreen-video-section h1',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        debug: true,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    opacity: 1,
                    transform: 'translateY(0)',
                    offset: 0
                },
                {
                    opacity: 0,
                    transform: 'translateY(-300px)',
                    offset:1
                },
            ]);
        }
    });

        // Carousel navigation buttons
    const carouselPrevBtn = document.querySelector('.carousel-prev');
    const carouselNextBtn = document.querySelector('.carousel-next');
    const carouselElement = document.querySelector('.carousel');
    const carouselWrapper = document.querySelector('.carousel-wrapper');

    if (carouselPrevBtn && carouselNextBtn && carouselElement && carouselWrapper) {
        let currentPosition = 0; // Track current position index
        const timelineItems = carouselElement.querySelectorAll('li');
        const maxPosition = timelineItems.length - 1; // Maximum position (0-indexed)

        // Detect iOS Safari for special handling
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isIOSSafari = isIOS && isSafari;

        const updateTransform = () => {
            // Get the computed styles to find the gap value
            const carouselStyles = window.getComputedStyle(carouselElement);
            const gap = parseFloat(carouselStyles.gap) || parseFloat(carouselStyles.columnGap) || 0;
            
            // Calculate the width of each individual item
            const firstItem = timelineItems[0];
            if (!firstItem) return;
            
            // Get the actual width of one item (without gap)
            const itemRect = firstItem.getBoundingClientRect();
            const itemWidth = itemRect.width;
            
            // Calculate the total width to move for each position (item width + gap)
            const moveWidth = itemWidth + gap;
            
            // Simple movement: move by one item width + gap per position
            const translateValue = -(currentPosition * moveWidth);

            if (isIOSSafari) {
                // For iOS Safari, use more aggressive transform application
                // and force a reflow to prevent transform reset during scroll
                carouselElement.style.webkitTransform = `translateX(${translateValue}px) translateZ(0)`;
                carouselElement.style.transform = `translateX(${translateValue}px) translateZ(0)`;

                // Force reflow to ensure transform is applied
                carouselElement.offsetHeight;

                // Add a small delay to ensure iOS Safari processes the transform
                requestAnimationFrame(() => {
                    carouselElement.style.webkitTransform = `translateX(${translateValue}px) translateZ(0)`;
                    carouselElement.style.transform = `translateX(${translateValue}px) translateZ(0)`;
                });
            } else {
                carouselElement.style.transform = `translateX(${translateValue}px)`;
            }
        };

        const moveToPosition = (position) => {
            if (position >= 0 && position <= maxPosition) {
                currentPosition = position;
                updateTransform();
            }

            if (currentPosition === 0) {
                carouselWrapper.classList.toggle('start-position', true);
            } else if (currentPosition === maxPosition) {
                carouselWrapper.classList.toggle('end-position', true);
            } else {
                carouselWrapper.classList.remove('start-position');
                carouselWrapper.classList.remove('end-position');
            }

            updateTransform();
        };

        carouselPrevBtn.addEventListener('click', () => {
            if (currentPosition > 0) {
                moveToPosition(currentPosition - 1);

            }
        });

        carouselNextBtn.addEventListener('click', () => {
            if (currentPosition < maxPosition) {
                moveToPosition(currentPosition + 1);
            }
        });

        // iOS Safari fix: Re-apply transform on scroll events to prevent reset
        if (isIOSSafari) {
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                // Clear previous timeout
                clearTimeout(scrollTimeout);

                // Re-apply transform after scroll settles
                scrollTimeout = setTimeout(() => {
                    if (currentPosition !== 0) {
                        updateTransform();
                    }
                }, 50);
            }, { passive: true });

            // Also handle touchmove events which can trigger similar issues
            window.addEventListener('touchmove', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    if (currentPosition !== 0) {
                        updateTransform();
                    }
                }, 50);
            }, { passive: true });
        }
    } else {
        console.warn('Carousel navigation buttons or elements not found.');
    }

    window.addEventListener('scroll', () => {
        toggleNav(scrollFactorMenuHide);
    });
    toggleNav(scrollFactorMenuHide);
});