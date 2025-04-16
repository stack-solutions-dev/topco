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
// const clipElement = (element: HTMLElement, transitionRatio: number) => {
//     const maxRadius = 15;
//     let top, right, bottom, left, radius;
//     const targetRect = element.parentElement.getBoundingClientRect();
//     console.log(element.parentElement);
//     if (transitionRatio <= 0) {
//         top = 0;
//         right = 0;
//         bottom = 0;
//         left = 0;
//         radius = 0;
//     } else if (transitionRatio < 0.2) {
//         const clipRatio = (transitionRatio - 0) / (0.2 - 0);
//         top = targetRect.top * clipRatio;
//         right = (window.innerWidth - targetRect.right) * clipRatio;
//         bottom = (window.innerHeight - targetRect.top - targetRect.height) * clipRatio;
//         left = targetRect.left * clipRatio;
//         radius = maxRadius * clipRatio;
//     } else {
//         top = targetRect.top;
//         right = window.innerWidth - targetRect.right;
//         bottom = window.innerHeight - targetRect.top - targetRect.height;
//         left = targetRect.left;
//         radius = maxRadius;
//     }
//     console.log(`inset(${top}px ${right}px ${bottom}px ${left}px round 10px)`)
//     element.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
// }
let transitionR = 0;
let translateX = 0;
let targetRect = null;
const clipElement = (clipElement, translateElement, targetRect, transitionRatio) => {
    const maxRadius = 15;
    const maxTranslationX = 6160;
    let top, right, bottom, left, radius;
    //const targetRect = clipElement.parentElement.getBoundingClientRect();
    console.log(clipElement.parentElement);
    const clipRatio = (transitionRatio - 0) / (0.2 - 0);
    const translateRatio = (transitionRatio - 0.2) / (1 - 0.2);
    if (transitionRatio < 0.2) {
        translateX = 0;
    }
    else if (transitionRatio > 0.2 && transitionRatio < 1) {
        translateX = translateRatio * maxTranslationX;
    }
    else {
        translateX = maxTranslationX;
    }
    if (transitionRatio <= 0) {
        top = 0;
        right = 0;
        bottom = 0;
        left = 0;
        radius = 0;
    }
    else if (transitionRatio < 0.2) {
        top = targetRect.top * clipRatio;
        right = (window.innerWidth - targetRect.right) * clipRatio;
        bottom = (window.innerHeight - targetRect.top - targetRect.height) * clipRatio;
        left = targetRect.left * clipRatio;
        radius = maxRadius * clipRatio;
    }
    else {
        top = targetRect.top;
        right = window.innerWidth - (targetRect.right);
        bottom = window.innerHeight - targetRect.top - targetRect.height;
        left = targetRect.left;
        radius = maxRadius;
    }
    console.log(`translateRatio ${transitionRatio} translateX ${translateX}`);
    console.log(`inset(${top}px ${right}px ${bottom}px ${left}px round 10px)`);
    clipElement.style.clipPath = `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`;
    translateElement.style.transform = `translateX(-${translateX}px)`;
};
window.addEventListener('resize', () => {
    const clipEl = document.querySelector('.full-screen-image');
    const translateElement = document.querySelector('.timeline-wrapper');
    const foo = clipEl.parentElement.getBoundingClientRect();
    targetRect = {
        width: foo.width,
        height: foo.height,
        top: foo.top,
        right: foo.right + translateX,
        bottom: foo.bottom,
        left: foo.left + translateX,
    };
    console.log(foo);
    console.log(targetRect);
    clipElement(clipEl, translateElement, targetRect, transitionR);
    // targetRect = foo;
});
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const viewportHeight = window.innerHeight;
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
            const animation = createAnimationFunction(animatedElement, [
                {
                    transform: "translateX(0px)",
                },
                {
                    transform: "translateX(0px)",
                    offset: 0.2
                },
                {
                    transform: "translateX(-6160px)",
                }
            ]);
            targetRect = fullScreenImg.parentElement.getBoundingClientRect();
            console.log(fullScreenImg.parentElement);
            return (transitionRatio) => {
                transitionR = transitionRatio;
                // const maxRadius = 15;
                // let top,right,bottom,left,radius;
                // if (transitionRatio <= 0){
                //     top = 0;
                //     right = 0;
                //     bottom = 0;
                //     left = 0;
                //     radius = 0;
                // } else if (transitionRatio < 0.2) {
                //     const clipRatio = (transitionRatio - 0) / (0.2 - 0);
                //     top = targetRect.top * clipRatio;
                //     right = (window.innerWidth - targetRect.right) * clipRatio;
                //     bottom = (window.innerHeight - targetRect.top - targetRect.height) * clipRatio;
                //     left = targetRect.left * clipRatio;
                //     radius = maxRadius * clipRatio;
                // } else {
                //     top = targetRect.top;
                //     right = window.innerWidth - targetRect.right;
                //     bottom = window.innerHeight - targetRect.top - targetRect.height;
                //     left = targetRect.left;
                //     radius = maxRadius;
                // }
                // if (transitionRatio < 0.2) {
                //     progress.style.width = '0%';
                //     year.innerHTML = years[0];
                // } else if (transitionRatio >= 0.2 && transitionRatio <= 1) {
                //     const adjustedTransitionRatio = (transitionRatio - 0.2) / (1 - 0.2);
                //     const yearIndex = Math.min(
                //         Math.floor(adjustedTransitionRatio * years.length),
                //         years.length - 1
                //     );
                //     year.innerHTML = years[yearIndex];
                //     progress.style.width = `${100 * adjustedTransitionRatio}%`;
                // } else {
                //     year.innerHTML = years[years.length - 1];
                //     progress.style.width = '100%';
                // }
                clipElement(fullScreenImg, animatedElement, targetRect, transitionRatio);
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
                    offset: 0.175
                },
                {
                    opacity: 1,
                    offset: 0.2
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
        animatedElementSelector: '.hero-video-1',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        debug: false,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    transform: "scale(1)",
                },
                {
                    transform: "scale(0.8)",
                    offset: 0.2
                }
            ]);
        }
    });
});
