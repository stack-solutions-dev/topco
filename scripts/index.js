import { createScrollAnimation, createAnimationFunction, fadeInCharacters, Animations } from './utils.js';
import { attachDesktopNavigationHandlers, attachMobileNavigationHandlers, toggleNav } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
    const scrollFactorMenuHide = 25;

    const body = document.querySelector('body');
    const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

    const hero1Title = document.querySelector('.hero-1-title');
    if (hero1Title) {
        fadeInCharacters(document.querySelectorAll('.hero-1-title .fade-in-word'), 0.5, 0.03);
    }

    createScrollAnimation({
        scrollingElementSelector: '.hero.scroll-container',
        animatedElementSelector: '.hero-title-wrapper',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        debug: false,
        animationFunction: (element, index, elements) => {
            const finalMatrix = screenWidth < 768 ? "matrix(1.15, 0, 0, 1.15, 0, 0)" : "matrix(1.3, 0, 0, 1.3, 0, 0)";
            return createAnimationFunction(element, [
                {
                    opacity: 1,
                    transform: "matrix(1, 0, 0, 1, 0, 0)",
                },
                {
                    opacity: 1,
                    transform: finalMatrix,
                    offset: 0.8
                },
                {
                    opacity: 0,
                    transform: finalMatrix,
                    offset: 0.9
                },
                {
                    opacity: 0,
                    transform: finalMatrix,
                    offset: 1
                }
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: '.hero-copy-paragraph',
        animatedElementSelector: '.hero-copy-paragraph .hero-copy',
        animationFunction: Animations.highlightInOutHold,
        boundaryStart: 'bottom',
        useSegments: true,
        start: 0.1,
        end: 0.8
    });

    createScrollAnimation({
        scrollingElementSelector: '.hero.scroll-container',
        animatedElementSelector: '.hero-video-1-wrapper',
        boundaryEnd: 'bottom',
        debug: false,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    opacity: 1,
                },
                {
                    opacity: 1,
                    offset: 0.9
                },
                {
                    opacity: 0,
                    offset: 1
                }
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: '.copy.scroll-container',
        animatedElementSelector: '.hero-text-2 .highlight.glow',
        boundaryEnd: 'bottom',
        animationFunction: (element, index, elements) => {
            const finalMatrix = screenWidth < 768 ? "matrix(1.15, 0, 0, 1.15, 0, 0)" : "matrix(1.3, 0, 0, 1.3, 0, 0)";

            return createAnimationFunction(element, [
                {
                    opacity: 0,
                    offset: 0
                },
                {
                    opacity: 0,
                    offset: 0.1
                },
                {
                    opacity: 1,
                    offset: 0.15
                },
                {
                    opacity: 1,
                    offset: 1
                }
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: '.copy.scroll-container',
        animatedElementSelector: '.copy-title-wrapper',
        boundaryEnd: 'bottom',
        debug: false,
        animationFunction: (element, index, elements) => {
            const finalMatrix = screenWidth < 768 ? "matrix(1.15, 0, 0, 1.15, 0, 0)" : "matrix(1.3, 0, 0, 1.3, 0, 0)";

            return createAnimationFunction(element, [
                {
                    opacity: 0,
                    transform: "matrix(1, 0, 0, 1, 0, 0)",
                },
                {
                    opacity: 1,
                    offset: 0.1
                },
                {
                    opacity: 1,
                    transform: finalMatrix,
                    offset: screenWidth < 768 ? 0.2 : 0.3
                },
                {
                    opacity: 0,
                    transform: finalMatrix,
                    offset: screenWidth < 768 ? 0.25 : 0.35
                }
            ]);
        }
    });

    createScrollAnimation({
        scrollingElementSelector: '.copy.scroll-container',
        animatedElementSelector: '.hero-video-2-wrapper',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        debug: false,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    opacity: 1,
                },
                {
                    opacity: 1,
                    offset: 0.5
                },
                {
                    opacity: 0,
                    offset: 1
                }
            ]);
        }
    });

    const startColor = 'rgb(146 142 138)';
    const endColor = 'rgb(255 255 255)';
    const textShadowStart = `0 0 5px rgba(255, 255, 255, 0), 0 0 10px rgba(255, 181, 115, 0), 0 0 20px rgba(255, 181, 115, 0), 0 0 30px rgba(255, 181, 115, 0)`;
    const textShadowEnd = `0 0 5px rgba(255, 255, 255, 1), 0 0 10px rgba(255, 181, 115, 1), 0 0 20px rgba(255, 181, 115, 1), 0 0 30px rgba(255, 181, 115, 1)`;
    const slideClassNames = ['.slide-1', '.slide-2', '.slide-3', '.slide-4'];

    slideClassNames.forEach((slide, ind) => {
        createScrollAnimation({
            scrollingElementSelector: `${slide} .left`,
            animatedElementSelector: `${slide} .glow-ups`,
            boundaryStart: 'bottom',
            boundaryEnd: 'top',
            // minScreenWidth: 768,
            animationFunction: (element, index, elements) => {
                return createAnimationFunction(element, [
                    {
                        color: startColor,
                    },
                    {
                        color: startColor,
                        textShadow: textShadowStart,
                        offset: 0.3
                    },
                    {
                        color: endColor,
                        textShadow: textShadowEnd,
                        offset: 0.6
                    },
                    {
                        color: endColor,
                        textShadow: textShadowEnd,
                        offset: 1
                    }
                ]);
            }
        });

        createScrollAnimation({
            scrollingElementSelector: `${slide} .right`,
            animatedElementSelector: `${slide} .right .content`,
            boundaryStart: 'bottom',
            boundaryEnd: 'bottom',
            debug: false,
            minScreenWidth: 768,
            animationFunction: (element, index, elements) => {
                const af = createAnimationFunction(element, [
                    {
                        opacity: 0,
                        offset: 0
                    },
                    {
                        opacity: 1,
                        offset: 1
                    }
                ]);
                return (transitionRatio) => {
                    if (slide !== '.slide-1')
                        af(transitionRatio);
                    if (slide === '.slide-4' && transitionRatio >= 1) {
                        element.style.position = 'relative';
                        element.style.width = '100%';
                    }
                    else if (transitionRatio >= 2) {
                        element.style.position = 'relative';
                        element.style.width = '100%';
                    }
                    else if (transitionRatio > (slide === '.slide-1' ? 1 : 0)) {
                        element.style.position = 'fixed';
                        element.style.width = '50%';
                    }
                    else {
                        element.style.position = 'relative';
                        element.style.width = '100%';
                    }
                };
            }
        });
    });

    createScrollAnimation({
        scrollingElementSelector: '.slide-1',
        animatedElementSelector: '.slide-1 .right .content',
        boundaryStart: 'bottom',
        boundaryEnd: 'top',
        debug: false,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    transform: "matrix(0.8, 0, 0, 0.8, 0, 0)",
                    offset: 0
                },
                {
                    transform: "matrix(0.8, 0, 0, 0.8, 0, 0)",
                    offset: 0.4
                },
                {
                    transform: "matrix(1, 0, 0, 1, 0, 0)",
                    offset: 0.5
                },
                {
                    transform: "matrix(1, 0, 0, 1, 0, 0)",
                    offset: 1
                }
            ]);
        }
    });

    attachDesktopNavigationHandlers(scrollFactorMenuHide);
    attachMobileNavigationHandlers(scrollFactorMenuHide);
    window.addEventListener('scroll', () => {
        toggleNav(scrollFactorMenuHide);
    });
    toggleNav(scrollFactorMenuHide);

    //Adding this class begins the fadeIn animation for the h1
    setTimeout(() => {
        if (body) {
            body.classList.remove('loading');
            body.classList.add('loaded');
        }
    }, 3000);
});