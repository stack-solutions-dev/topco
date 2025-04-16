// window.onbeforeunload = function () {
//     window.scrollTo(0, 0);
// };
function extractStartEndFromElement(element) {
    const classList = element.classList;
    const startRegex = /start-(\d*\.?\d+)/;
    const endRegex = /end-(\d*\.?\d+)/;
    let start = null;
    let end = null;
    classList.forEach(className => {
        const startMatch = className.match(startRegex);
        const endMatch = className.match(endRegex);
        if (startMatch) {
            start = parseFloat(startMatch[1]);
        }
        if (endMatch) {
            end = parseFloat(endMatch[1]);
        }
    });
    return [start, end];
}
const scaleElement = (element, ratio, targetScale) => {
    element.style.animation = 'none';
    const scaleValue = 1 + ratio * (targetScale - 1);
    element.style.transform = `matrix(${scaleValue}, 0, 0, ${scaleValue}, 0, 0)`;
};
const fadeOutElement = (element, ratio, fadeOutStart = 0.8) => {
    if (ratio >= fadeOutStart) {
        element.style.opacity = `${1 - (ratio - fadeOutStart) / (1 - fadeOutStart)}`;
    }
    else {
        element.style.opacity = '1';
    }
};
const fadeElement = (element, ratio) => {
    element.style.opacity = `${ratio}`;
};
const scaleAndFade = (element, ratio, targetScale = 1.3) => {
    scaleElement(element, ratio, targetScale);
    fadeElement(element, ratio);
};
const fixElements = (elements, index) => {
    // console.log(slideRights);
    elements.forEach((element, i) => {
        const htmlElement = element;
        if (index > -1) {
            htmlElement.style.position = 'fixed';
            htmlElement.style.width = '50%';
        }
        else {
            htmlElement.style.position = 'relative';
            htmlElement.style.width = '100%';
        }
    });
};
const createAnimations = (config) => {
    const animations = [];
    for (const animationConfig of config) {
        const scrollContainer = document.querySelector(animationConfig.scrollContainer);
        const animatedElement = document.querySelector(animationConfig.animatedElement);
        if (!scrollContainer) {
            console.error('No scroll element found for:', animationConfig);
            continue;
        }
        if (!animatedElement) {
            console.error('No animated element found for:', animationConfig);
            animations.push({
                scrollContainer
            });
            continue;
        }
        const animation = new Animation(new KeyframeEffect(animatedElement, animationConfig.keyframes, { duration: 100, fill: 'forwards' }));
        animations.push({
            scrollContainer,
            animation
        });
    }
    return animations;
};
const createGroupAnimationFunction = (elements, keyframes) => {
    const animations = [];
    for (const element of elements) {
        animations.push(new Animation(new KeyframeEffect(element, keyframes, { duration: 100, fill: 'forwards' })));
    }
    return (transitionRatio) => {
        for (const animation of animations) {
            animation.currentTime = transitionRatio * 100;
        }
    };
};
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
const splitTextToSpans = (text) => {
    const regex = /{{(.*?)}}|(\S+)/g;
    const wordSpans = [];
    const words = text.split(' ');
    words.forEach(word => {
        const wordSpan = document.createElement('span');
        wordSpan.className = "word";
        const match = word.match(/{{(.*?)}}/);
        if (match && match[1]) {
            let text = match[1];
            const highlightSpan = document.createElement('span');
            highlightSpan.className = "highlight";
            highlightSpan.textContent = text;
            wordSpan.textContent = text;
            wordSpan.appendChild(highlightSpan);
        }
        else {
            let text = word;
            wordSpan.textContent = text;
        }
        const spaceSpan = document.createElement('span');
        spaceSpan.className = "word";
        spaceSpan.textContent = " ";
        wordSpans.push(wordSpan);
        wordSpans.push(spaceSpan); // Preserve spaces
    });
    return wordSpans;
    // const wordSpans = [];
    // const regex = /{{(.*?)}}|(\S+)/g;
    // let match;
    // while ((match = regex.exec(text)) !== null) {
    //     const word = match[1] || match[2];
    //     const wordSpan = document.createElement('span');
    //     wordSpan.className = 'word';
    //     word.split('').forEach(char => {
    //         const charSpan = document.createElement('span');
    //         charSpan.textContent = char;
    //         if (match[1]) {
    //             charSpan.className = 'highlight foo';
    //         }
    //         wordSpan.appendChild(charSpan);
    //     });
    //     wordSpans.push(wordSpan);
    //     const spaceSpan = document.createElement('span');
    //     spaceSpan.className = 'word';
    //     const spaceCharSpan = document.createElement('span');
    //     spaceCharSpan.textContent = " ";
    //     spaceSpan.appendChild(spaceCharSpan);
    //     wordSpans.push(spaceSpan); // Preserve spaces
    // }
    // return wordSpans;
};
const splitTextToSpans_old = (text) => {
    const wordSpans = [];
    const regex = /{{[^{}]*}}/gm;
    let match;
    while ((match = regex.exec(text)) !== null) {
        const word = match[1] || match[2];
        const wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        word.split('').forEach(char => {
            const charSpan = document.createElement('span');
            charSpan.textContent = char;
            if (match[1]) {
                charSpan.className = 'highlight foo';
            }
            wordSpan.appendChild(charSpan);
        });
        wordSpans.push(wordSpan);
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'word';
        const spaceCharSpan = document.createElement('span');
        spaceCharSpan.textContent = " ";
        spaceSpan.appendChild(spaceCharSpan);
        wordSpans.push(spaceSpan); // Preserve spaces
    }
    return wordSpans;
};
const fadeInCharacters = (spans, startDelay, characterDelay) => {
    let charCount = 0;
    spans.forEach(span => {
        const characters = span.textContent.split('');
        span.textContent = '';
        characters.forEach(char => {
            charCount++;
            const charSpan = document.createElement('span');
            charCount++;
            charSpan.style.animationDelay = `${startDelay + (charCount * characterDelay)}s`;
            charSpan.textContent = char;
            span.appendChild(charSpan);
        });
    });
};
const animateSegments = (percentage, animations, options = { start: 0, end: 1, debug: false }) => {
    const { start = 0, end = 1, debug = false } = options;
    const segments = end - start;
    const segmentLength = segments / animations.length;
    const segmentIndex = Math.floor((percentage - start) / segmentLength);
    const segmentStart = start + segmentIndex * segmentLength;
    const segmentPercentage = (percentage - segmentStart) / segmentLength;
    for (let i = 0; i < animations.length; i++) {
        if (i < segmentIndex) {
            animations[i](1); // Set animations before the target to 100%
        }
        else if (i > segmentIndex) {
            animations[i](0); // Set animations after the target to 0%
        }
        else if (i === segmentIndex) {
            animations[i](segmentPercentage); // Set the target animation to the correct percentage
        }
    }
    if (debug)
        console.debug(`Percentage: ${percentage} SegmentIndex: ${segmentIndex} SegmentPercentage: ${segmentPercentage} SegmentLength: ${segmentLength} Start: ${start} End: ${end}`);
};
// const calcScrollPositionRelativeToViewport = (scrollContainer: HTMLElement) => {
//     if (!scrollContainer) {
//         return -1;
//     }
//     const elementTop = scrollContainer.getBoundingClientRect().top;
//     const elementHeight = scrollContainer.offsetHeight;
//     const endPosition = elementHeight - window.innerHeight;
//     const transitionRatio = (elementTop * -1) / endPosition;
//     return transitionRatio;
// }
// const calcPositionRelativeToViewport_old = (element: HTMLElement, debug = false) => {
//     if (!element) {
//         return -1;
//     }
//     const elementTop = element.getBoundingClientRect().top;
//     const elementHeight = element.offsetHeight;
//     const startPosition = window.innerHeight;
//     const endPosition = -(elementHeight);
//     const transitionRatio = (startPosition - elementTop) / (startPosition - endPosition);
//     if (debug) console.debug(`${element.className} ElementTop: ${elementTop} TransitionRatio: ${transitionRatio} ElementHeight: ${elementHeight} Window InnerHeight ${window.innerHeight} StartPosition ${startPosition} endPosition ${endPosition}`);
//     return transitionRatio;
// }
const fadeInOut = (element, index, elements) => {
    return createAnimationFunction(element, [
        {
            opacity: 0,
            offset: 0
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
};
const fadeInHold = (element, index, elements) => {
    return createAnimationFunction(element, [
        {
            opacity: 0,
            offset: 0
        },
        {
            opacity: 0,
            offset: 0.2
        },
        {
            opacity: 1,
            offset: 0.5
        },
        {
            opacity: 1,
            offset: 1
        }
    ]);
};
const highlightInOut = (element, index, elements) => {
    return createAnimationFunction(element, [
        {
            opacity: 0.2,
            offset: 0
        },
        {
            opacity: 1,
            offset: 0.3
        },
        {
            opacity: 1,
            offset: 0.7
        },
        {
            opacity: 0.2,
            offset: 1
        }
    ]);
};
const highlightInOutHold = (element, index, elements) => {
    return createAnimationFunction(element, [
        {
            opacity: index === 0 ? 1 : 0.2,
            offset: 0
        },
        {
            opacity: 1,
            offset: 0.2
        },
        {
            opacity: 1,
            offset: 0.8
        },
        {
            opacity: index === elements.length - 1 ? 1 : 0.2,
            offset: 1
        }
    ]);
};
const calcPositionRelativeToViewport = (element, options = {}) => {
    const { debug = false, boundaryStart = 'top', boundaryEnd = 'top' } = options;
    if (!element) {
        return -1;
    }
    const elementTop = element.getBoundingClientRect().top;
    const elementHeight = element.offsetHeight;
    let startPosition;
    let endPosition;
    let transitionRatio;
    if (boundaryStart === 'top') {
        startPosition = 0;
    }
    else if (boundaryStart === 'bottom') {
        startPosition = window.innerHeight;
    }
    if (boundaryStart === 'bottom' && boundaryEnd === 'bottom') {
        endPosition = startPosition - window.innerHeight;
        transitionRatio = (startPosition - elementTop) / (startPosition - endPosition);
    }
    else if (boundaryEnd === 'top') {
        endPosition = -(elementHeight);
        transitionRatio = (startPosition - elementTop) / (startPosition - endPosition);
    }
    else if (boundaryEnd === 'bottom') {
        endPosition = startPosition - (elementHeight - window.innerHeight);
        transitionRatio = (elementTop * -1) / endPosition;
        transitionRatio = (startPosition - elementTop) / (startPosition - endPosition);
    }
    if (debug)
        console.debug(`${element.className} ElementTop: ${elementTop} TransitionRatio: ${transitionRatio} ElementHeight: ${elementHeight} Window InnerHeight ${window.innerHeight} StartPosition ${startPosition} EndPosition ${endPosition}`);
    return transitionRatio;
};
const scrollHandler = (props) => {
    const { scrollContainerSelector, scrollingElementSelector, animatedElementSelector, useSegments = false, start = 0, end = 1, animationFunction = fadeInOut, boundaryStart, boundaryEnd, debug = false } = props;
    const scrollContainer = document.querySelector(scrollContainerSelector) || window;
    const scrollingElement = document.querySelector(scrollingElementSelector);
    const spans = document.querySelectorAll(animatedElementSelector);
    if (!scrollingElement) {
        console.error('No scrollingElement element found for:', scrollingElementSelector);
        return;
    }
    if (spans.length === 0) {
        console.error('No spans element found for:', animatedElementSelector);
        return;
    }
    const animations = Array.from(spans).map(animationFunction);
    scrollContainer.addEventListener('scroll', () => {
        const transitionRatio = calcPositionRelativeToViewport(scrollingElement, { boundaryStart, boundaryEnd, debug });
        if (debug === true) {
            console.log(`ScrollTop: ${scrollContainer.scrollTop} TransitionRatio: ${transitionRatio}`);
        }
        if (useSegments) {
            animateSegments(transitionRatio, animations, { start, end, debug });
        }
        else {
            animations.forEach((animation) => {
                animation(transitionRatio);
            });
        }
    });
};
const ScrollAnimation = {
    scrollHandler: scrollHandler
};
const Animations = {
    fadeInOut: fadeInOut,
    fadeInHold: fadeInHold,
    highlightInOut: highlightInOut,
    highlightInOutHold: highlightInOutHold
};
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded and parsed');
    const body = document.querySelector('body');
    const navContainer = document.querySelector('.nav-container');
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
    setTimeout(() => {
        if (body) {
            body.classList.remove('loading');
            body.classList.add('loaded');
        }
    }, 3000);
    window.addEventListener('scroll', () => {
        toggleNav();
    });
    const hero1Title = document.querySelector('.hero-1-title');
    if (hero1Title) {
        fadeInCharacters(document.querySelectorAll('.hero-1-title .word'), 0.5, 0.03);
    }
    ScrollAnimation.scrollHandler({
        scrollingElementSelector: '.hero.scroll-container',
        animatedElementSelector: '.hero-title-wrapper',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        debug: false,
        animationFunction: (element, index, elements) => {
            return createAnimationFunction(element, [
                {
                    opacity: 1,
                    transform: "matrix(1, 0, 0, 1, 0, 0)",
                },
                {
                    opacity: 1,
                    transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
                    offset: 0.8
                },
                {
                    opacity: 0,
                    transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
                    offset: 0.9
                },
                {
                    opacity: 0,
                    transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
                    offset: 1
                }
            ]);
        }
    });
    ScrollAnimation.scrollHandler({
        scrollingElementSelector: '.hero-copy-paragraph',
        animatedElementSelector: '.hero-copy-paragraph .hero-copy',
        animationFunction: Animations.highlightInOutHold,
        boundaryStart: 'bottom',
        useSegments: true,
        start: 0.1,
        end: 0.8
    });
    ScrollAnimation.scrollHandler({
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
    ScrollAnimation.scrollHandler({
        scrollingElementSelector: '.copy.scroll-container',
        animatedElementSelector: '.copy-title-wrapper',
        boundaryEnd: 'bottom',
        debug: false,
        animationFunction: (element, index, elements) => {
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
                    transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
                    offset: 0.3
                },
                {
                    opacity: 0,
                    transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
                    offset: 0.35
                }
            ]);
        }
    });
    ScrollAnimation.scrollHandler({
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
        ScrollAnimation.scrollHandler({
            scrollingElementSelector: `${slide} .left`,
            animatedElementSelector: `${slide} .glow-ups`,
            boundaryStart: 'bottom',
            boundaryEnd: 'top',
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
            },
            debug: true
        });
        // ScrollAnimation.scrollHandler({
        //     scrollingElementSelector: `${slide} .left`,
        //     animatedElementSelector: `${slide} .highlight`,
        //     boundaryStart: 'bottom',
        //     boundaryEnd: 'top',
        //     animationFunction: Animations.fadeInHold,
        //     debug: false
        // });
        ScrollAnimation.scrollHandler({
            scrollingElementSelector: `${slide} .right`,
            animatedElementSelector: `${slide} .right .content`,
            boundaryStart: 'bottom',
            boundaryEnd: 'bottom',
            debug: false,
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
    ScrollAnimation.scrollHandler({
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
});
