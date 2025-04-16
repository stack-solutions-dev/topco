import { createScrollAnimation } from './utils.js';
const createAnimationFunction = (element, keyframes) => {
    const animation = new Animation(new KeyframeEffect(element, keyframes, { duration: 100, fill: 'forwards' }));
    return (transitionRatio) => {
        if (transitionRatio < 0) {
            animation.currentTime = 0;
        }
        else if (transitionRatio > 1) {
            animation.currentTime = 100;
        }
        else {
            animation.currentTime = transitionRatio * 100;
        }
    };
};
const clipStart = 0.1;
const clipEnd = 0.3;
const translateStart = clipEnd;
const translateEnd = 1;
let transitionR = 0;
let translateX = 0;
let targetRect = null;
const clipElement = (clipElement, translateElement, targetRect, transitionRatio, maxTranslationX) => {
    const maxRadius = 15;
    // const maxTranslationX = 6160;
    let top, right, bottom, left, radius;
    const clipRatio = (transitionRatio - clipStart) / (clipEnd - clipStart);
    const translateRatio = (transitionRatio - translateStart) / (1 - translateStart);
    //Scroll left
    if (transitionRatio < translateStart) {
        translateX = 0;
    }
    else if (transitionRatio >= translateStart && transitionRatio < 1) {
        translateX = Math.round(translateRatio * maxTranslationX);
    }
    else {
        translateX = maxTranslationX;
    }
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
    clipElement.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px)`;
    translateElement.style.transform = `translateX(-${translateX}px)`;
    //console.log(`transitionRatio ${transitionRatio} translateX ${translateX}`);
    console.log(`transitionRatio ${transitionRatio} inset(${top}px ${right}px ${bottom}px ${left}px round 10px)`);
};
const getBoundingRectange = (el) => {
    const foo = el.getBoundingClientRect();
    console.log('Bounding', foo);
    return {
        width: foo.width,
        height: foo.height,
        top: foo.top,
        right: foo.right + translateX,
        bottom: foo.bottom,
        left: foo.left + translateX,
    };
};
window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};
window.addEventListener('resize', () => {
    const timelineWrapper = document.querySelector('.timeline-wrapper');
    const lastTimelineItem = document.querySelector('.timeline li:last-child');
    if (transitionR >= 0 && transitionR <= 1) {
        const clipEl = document.querySelector('.full-screen-image');
        const translateElement = document.querySelector('.timeline-wrapper');
        targetRect = getBoundingRectange(clipEl.parentElement);
        clipElement(clipEl, translateElement, targetRect, transitionR, timelineWrapper.clientWidth - (window.innerWidth / 2) - (lastTimelineItem.clientWidth / 2));
    }
    else {
        targetRect = null;
    }
    // targetRect = foo;
});
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const body = document.querySelector('body');
    const navContainer = document.querySelector('.nav-container');
    const timelineWrapper = document.querySelector('.timeline-wrapper');
    const lastTimelineItem = document.querySelector('.timeline li:last-child');
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
    createScrollAnimation({
        scrollingElementSelector: 'section.hero',
        animatedElementSelector: '.team-image',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        debug: false,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    opacity: 1,
                    offset: 0
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
        animatedElementSelector: '.timeline-wrapper',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        animationFunction: (animatedElement) => {
            const years = ['2025', '2024', '2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016'];
            const fullScreenImg = document.querySelector('.full-screen-image');
            const video = fullScreenImg.querySelector('video');
            const year = document.querySelector('.year');
            const progress = document.querySelector('.progress');
            return (transitionRatio) => {
                if (targetRect === null && transitionRatio >= 0)
                    targetRect = getBoundingRectange(fullScreenImg.parentElement);
                transitionR = transitionRatio;
                if (transitionRatio < clipEnd) {
                    progress.style.width = '0%';
                    year.innerHTML = years[0];
                }
                else if (transitionRatio >= clipEnd && transitionRatio <= 1) {
                    const adjustedTransitionRatio = (transitionRatio - clipEnd) / (1 - clipEnd);
                    const yearIndex = Math.min(Math.floor(adjustedTransitionRatio * years.length), years.length - 1);
                    year.innerHTML = years[yearIndex];
                    progress.style.width = `${100 * adjustedTransitionRatio}%`;
                }
                else {
                    year.innerHTML = years[years.length - 1];
                    progress.style.width = '100%';
                }
                clipElement(fullScreenImg, animatedElement, targetRect, transitionRatio, timelineWrapper.clientWidth - (window.innerWidth / 2) - (lastTimelineItem.clientWidth / 2));
                // fullScreenImg.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
                // console.log(`inset(${top}px ${right}px ${bottom}px ${left}px round 10px)`)
                // animation(transitionRatio);
            };
        }
    });
    createScrollAnimation({
        scrollingElementSelector: '.horizontal-scroll-container',
        animatedElementSelector: '.image-wrapper, .caption, .timeline-carousel',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        debug: false,
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
        debug: false,
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
        debug: false,
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
    createScrollAnimation({
        scrollingElementSelector: 'section.brand-values',
        animatedElementSelector: '.brand-values h1',
        boundaryStart: 'bottom',
        boundaryEnd: 'bottom',
        debug: false,
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
        debug: false,
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
});
