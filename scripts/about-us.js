import { createScrollAnimation, createAnimationFunction } from './utils.js';
import { attachDesktopNavigationHandlers, attachMobileNavigationHandlers, toggleNav } from './navigation.js';


const clipStart = 0.1;
const clipEnd = 0.3;
const translateStart = clipEnd;
let hasRunTimelineAnimation = false;
let transitionR = 0;
let translateX = 0;
let targetRect = null;
const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'];

const getRelativeBoundingRect = (target, container) => {
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    return {
        top: targetRect.top - containerRect.top,
        left: targetRect.left - containerRect.left,
        bottom: targetRect.bottom - containerRect.top,
        right: targetRect.right - containerRect.left,
        width: targetRect.width,
        height: targetRect.height
    };
};

const translateElement = (element, maxTranslationX, transitionRatio) => {

    const translateRatio = (transitionRatio - translateStart) / (1 - translateStart);

    if (transitionRatio < translateStart) {
        translateX = 0;
    }
    else if (transitionRatio >= translateStart && transitionRatio < 1) {
        translateX = Math.round(translateRatio * maxTranslationX);
    }
    else {
        translateX = maxTranslationX;
    }

    console.log('Translating', transitionRatio, translateX, maxTranslationX);

    element.style.transform = `translateX(-${translateX}px)`;
}

const clipElement = (element, targetRect, transitionRatio) => {
    const maxRadius = 10;
    // const maxTranslationX = 6160;
    let top, right, bottom, left, radius;
    const clipRatio = (transitionRatio - clipStart) / (clipEnd - clipStart);


    //Clip
    if (transitionRatio < clipStart) {
        top = 0;
        right = 0;
        bottom = 0;
        left = 0;
        radius = 0;
    }
    else if (transitionRatio <= clipEnd) {
        top = targetRect.top * clipRatio;
        right = (window.innerWidth - targetRect.right) * clipRatio;
        bottom = (window.innerHeight - targetRect.top - targetRect.height) * clipRatio;
        left = targetRect.left * clipRatio;
        radius = maxRadius * (clipRatio * 2);
    }
    else {
        top = targetRect.top;
        right = window.innerWidth - (targetRect.right);
        bottom = window.innerHeight - targetRect.top - targetRect.height;
        left = targetRect.left;
        radius = maxRadius;
    }
    if (radius > maxRadius)
        radius = maxRadius;
    // clipElement.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
    element.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
    //console.log(`transitionRatio ${transitionRatio} translateX ${translateX}`);
    // console.log(`transitionRatio ${transitionRatio} inset(${top}px ${right}px ${bottom}px ${left}px round 10px)`);
};

document.addEventListener('DOMContentLoaded', () => {
    const scrollFactorMenuHide = 25;

    console.log('DOM fully loaded and parsed');
    const body = document.querySelector('body')

    const timelineWrapper = document.querySelector('.timeline-wrapper');
    const lastTimelineItem = document.querySelector('.timeline li:last-child');
    const timelineSection = document.querySelector('.timeline-section');

    createScrollAnimation({
        calculateElementPosition: true,
        scrollingElementSelector: 'body',
        animatedElementSelector: '.mobile-animate',
        boundaryStart: 'bottom',
        boundaryEnd: 'bottom',
        maxScreenWidth: 768,
        debug: false,
        animationFunction: (element, index, elements) => {
            return (transitionRatio) => {
                if (transitionRatio >= 0) {
                    element.classList.add('animated');
                } else if (transitionRatio <= 0) {
                    element.classList.remove('animated');
                }
            }
        }
    });

    createScrollAnimation({
        scrollingElementSelector: 'section.hero',
        animatedElementSelector: '.hero .content p',
        boundaryStart: 'top',
        boundaryEnd: 'top',
        minScreenWidth: 768,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    opacity: 1,
                    offset: 0
                },
                {
                    opacity: 1,
                    offset: 0.25
                },
                {
                    opacity: 0,
                    offset: 0.35
                },
                {
                    opacity: 0,
                    offset: 1
                }
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: 'section.hero',
        animatedElementSelector: '.team-image',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        minScreenWidth: 768,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    opacity: 1,
                    offset: 0
                },
                {
                    opacity: 0,
                    offset: 0.8
                },
                {
                    opacity: 0,
                    offset: 1
                }
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: 'section.brand-values',
        animatedElementSelector: '.brand-values h1',
        boundaryStart: 'bottom',
        boundaryEnd: 'bottom',
        minScreenWidth: 768,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    transform: 'scale(1.75) translateY(10vh)',
                    opacity: 0,
                    offset: 0
                },
                {
                    transform: 'scale(1.75) translateY(10vh)',
                    opacity: 0,
                    offset: 0.5
                },
                {
                    transform: 'scale(1) translateY(0)',
                    opacity: 1,
                    offset: 1
                },
                {
                    transform: 'scale(1) translateY(0)',
                    offset: 1
                }
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: 'section.brand-values',
        animatedElementSelector: '.brand-values .two-column-grid > div',
        boundaryStart: 'bottom',
        boundaryEnd: 'bottom',
        minScreenWidth: 768,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    transform: 'scale(1) translateY(0)',
                    opacity: 0,
                    offset: 0
                },
                {
                    transform: 'scale(1) translateY(40vh)',
                    opacity: 0,
                    offset: 0.6
                },
                {
                    transform: 'scale(1) translateY(0)',
                    opacity: 1,
                    offset: 1
                },
                {
                    transform: 'scale(1) translateY(0)',
                    opacity: 1,
                    offset: 1
                }
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: '.horizontal-scroll-container',
        animatedElementSelector: '.timeline-wrapper',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        minScreenWidth: 768,
        debug: true,
        animationFunction: (animatedElement) => {
            const year = document.querySelector('.year');
            const progress = document.querySelector('.progress');
            const mainImageWrapper = document.querySelector('.main-image-wrapper');
            const fullScreenImg = document.querySelector('.full-screen-image');

            return (transitionRatio) => {
                const maxTranslationX = timelineWrapper.clientWidth - (window.innerWidth / 2) - (lastTimelineItem.clientWidth / 2);

                if (transitionRatio >= 0 && transitionRatio <= 1 || hasRunTimelineAnimation === false) {
                    const adjustedTransitionRatio = (transitionRatio - clipEnd) / (1 - clipEnd);

                    const yearIndex = Math.min(Math.floor(adjustedTransitionRatio * years.length), years.length - 1);
                    year.innerHTML = years[yearIndex >= 0 ? yearIndex : 0];

                    progress.style.width = `${100 * adjustedTransitionRatio}%`;

                    translateElement(animatedElement, maxTranslationX, transitionRatio);

                    clipElement(fullScreenImg, getRelativeBoundingRect(mainImageWrapper, fullScreenImg), transitionRatio);
                } else if (transitionRatio > 1) {
                    translateElement(animatedElement, maxTranslationX, 1);
                    year.innerHTML = years[years.length - 1];
                }

                hasRunTimelineAnimation = true;
            };
        }
    });

    createScrollAnimation({
        scrollingElementSelector: '.horizontal-scroll-container',
        animatedElementSelector: '.image-wrapper, .caption, .timeline-carousel',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        minScreenWidth: 768,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    opacity: 0,
                },
                {
                    opacity: 0,
                    offset: clipEnd - 0.025
                },
                {
                    opacity: 1,
                    offset: clipEnd
                },
                {
                    opacity: 1,
                    offset: 1
                }
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: '.horizontal-scroll-container',
        animatedElementSelector: '.full-screen-image h1',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        minScreenWidth: 768,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    opacity: 1,
                },
                {
                    opacity: 1,
                    offset: 0.2
                },
                {
                    opacity: 0,
                    offset: 0.25
                },
                {
                    opacity: 0,
                    offset: 1
                }
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: '.horizontal-scroll-container',
        animatedElementSelector: '.hero-video-1',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        minScreenWidth: 768,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    transform: "scale(1.5)",
                    offset: 0
                },
                {
                    transform: "scale(1)",
                    offset: clipEnd / 2
                },
                {
                    transform: "scale(1)",
                    offset: clipEnd
                },
                {
                    transform: "scale(0.85)",
                    offset: 1
                }
            ]);
        }
    });

    // Carousel navigation buttons
    const carouselPrevBtn = document.querySelector('.carousel-prev');
    const carouselNextBtn = document.querySelector('.carousel-next');
    const timelineWrapperElement = document.querySelector('.timeline-wrapper');

    if (carouselPrevBtn && carouselNextBtn && timelineWrapperElement) {
        let currentPosition = 0; // Track current position in vw units
        const timelineItems = timelineWrapperElement.querySelectorAll('li');
        const maxPosition = timelineItems.length - 1; // Maximum position (0-indexed)

        // Detect iOS Safari for special handling
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        const isIOSSafari = isIOS && isSafari;

        const updateTransform = () => {
            const translateValue = currentPosition * -100; // Convert to negative vw

            if (isIOSSafari) {
                // For iOS Safari, use more aggressive transform application
                // and force a reflow to prevent transform reset during scroll
                timelineWrapperElement.style.webkitTransform = `translateX(${translateValue}vw) translateZ(0)`;
                timelineWrapperElement.style.transform = `translateX(${translateValue}vw) translateZ(0)`;

                // Force reflow to ensure transform is applied
                timelineWrapperElement.offsetHeight;

                // Add a small delay to ensure iOS Safari processes the transform
                requestAnimationFrame(() => {
                    timelineWrapperElement.style.webkitTransform = `translateX(${translateValue}vw) translateZ(0)`;
                    timelineWrapperElement.style.transform = `translateX(${translateValue}vw) translateZ(0)`;
                });
            } else {
                timelineWrapperElement.style.transform = `translateX(${translateValue}vw)`;
            }
        };

        const moveToPosition = (position) => {
            if (position >= 0 && position <= maxPosition) {
                currentPosition = position;
                updateTransform();
            }

            if (currentPosition === 0) {
                timelineSection.classList.toggle('start-position', true);
            } else if (currentPosition === maxPosition) {
                timelineSection.classList.toggle('end-position', true);
            } else {
                timelineSection.classList.remove('start-position');
                timelineSection.classList.remove('end-position');
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
    }

    attachDesktopNavigationHandlers(scrollFactorMenuHide);
    attachMobileNavigationHandlers(scrollFactorMenuHide);
    
    window.addEventListener('scroll', () => {
        toggleNav(scrollFactorMenuHide);
    });
    toggleNav(scrollFactorMenuHide);

    body.classList.add('loaded');
});
