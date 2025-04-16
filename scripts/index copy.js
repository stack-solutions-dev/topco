window.onbeforeunload = function () {
    window.scrollTo(0, 0);
};
function extractStartEndFromElement(element) {
    var classList = element.classList;
    var startRegex = /start-(\d*\.?\d+)/;
    var endRegex = /end-(\d*\.?\d+)/;
    var start = null;
    var end = null;
    classList.forEach(function (className) {
        var startMatch = className.match(startRegex);
        var endMatch = className.match(endRegex);
        if (startMatch) {
            start = parseFloat(startMatch[1]);
        }
        if (endMatch) {
            end = parseFloat(endMatch[1]);
        }
    });
    return [start, end];
}
var scaleElement = function (element, ratio, targetScale) {
    element.style.animation = 'none';
    var scaleValue = 1 + ratio * (targetScale - 1);
    element.style.transform = "matrix(".concat(scaleValue, ", 0, 0, ").concat(scaleValue, ", 0, 0)");
};
var fadeOutElement = function (element, ratio, fadeOutStart) {
    if (fadeOutStart === void 0) { fadeOutStart = 0.8; }
    if (ratio >= fadeOutStart) {
        element.style.opacity = "".concat(1 - (ratio - fadeOutStart) / (1 - fadeOutStart));
    }
    else {
        element.style.opacity = '1';
    }
};
var fadeElement = function (element, ratio) {
    element.style.opacity = "".concat(ratio);
};
var scaleAndFade = function (element, ratio, targetScale) {
    if (targetScale === void 0) { targetScale = 1.3; }
    scaleElement(element, ratio, targetScale);
    fadeElement(element, ratio);
};
var fixElements = function (elements, index) {
    // console.log(slideRights);
    elements.forEach(function (element, i) {
        var htmlElement = element;
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
var createAnimations = function (config) {
    var animations = [];
    for (var _i = 0, config_1 = config; _i < config_1.length; _i++) {
        var animationConfig = config_1[_i];
        var scrollContainer = document.querySelector(animationConfig.scrollContainer);
        var animatedElement = document.querySelector(animationConfig.animatedElement);
        if (!scrollContainer) {
            console.error('No scroll element found for:', animationConfig);
            continue;
        }
        if (!animatedElement) {
            console.error('No animated element found for:', animationConfig);
            animations.push({
                scrollContainer: scrollContainer
            });
            continue;
        }
        var animation = new Animation(new KeyframeEffect(animatedElement, animationConfig.keyframes, { duration: 100, fill: 'forwards' }));
        animations.push({
            scrollContainer: scrollContainer,
            animation: animation
        });
    }
    return animations;
};
var createGroupAnimationFunction = function (elements, keyframes) {
    var animations = [];
    for (var _i = 0, elements_1 = elements; _i < elements_1.length; _i++) {
        var element = elements_1[_i];
        animations.push(new Animation(new KeyframeEffect(element, keyframes, { duration: 100, fill: 'forwards' })));
    }
    return function (transitionRatio) {
        for (var _i = 0, animations_1 = animations; _i < animations_1.length; _i++) {
            var animation = animations_1[_i];
            animation.currentTime = transitionRatio * 100;
        }
    };
};
var createAnimationFunction = function (element, keyframes) {
    var animation = new Animation(new KeyframeEffect(element, keyframes, { duration: 100, fill: 'forwards' }));
    return function (transitionRatio) {
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
var splitTextToSpans = function (text) {
    var regex = /{{(.*?)}}|(\S+)/g;
    var wordSpans = [];
    var words = text.split(' ');
    words.forEach(function (word) {
        var wordSpan = document.createElement('span');
        wordSpan.className = "word";
        var match = word.match(/{{(.*?)}}/);
        if (match && match[1]) {
            var text_1 = match[1];
            var highlightSpan = document.createElement('span');
            highlightSpan.className = "highlight";
            highlightSpan.textContent = text_1;
            wordSpan.textContent = text_1;
            wordSpan.appendChild(highlightSpan);
        }
        else {
            var text_2 = word;
            wordSpan.textContent = text_2;
        }
        var spaceSpan = document.createElement('span');
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
var splitTextToSpans_old = function (text) {
    var wordSpans = [];
    var regex = /{{[^{}]*}}/gm;
    var match;
    var _loop_1 = function () {
        var word = match[1] || match[2];
        var wordSpan = document.createElement('span');
        wordSpan.className = 'word';
        word.split('').forEach(function (char) {
            var charSpan = document.createElement('span');
            charSpan.textContent = char;
            if (match[1]) {
                charSpan.className = 'highlight foo';
            }
            wordSpan.appendChild(charSpan);
        });
        wordSpans.push(wordSpan);
        var spaceSpan = document.createElement('span');
        spaceSpan.className = 'word';
        var spaceCharSpan = document.createElement('span');
        spaceCharSpan.textContent = " ";
        spaceSpan.appendChild(spaceCharSpan);
        wordSpans.push(spaceSpan); // Preserve spaces
    };
    while ((match = regex.exec(text)) !== null) {
        _loop_1();
    }
    return wordSpans;
};
var fadeInCharacters = function (spans, startDelay, characterDelay) {
    var charCount = 0;
    spans.forEach(function (span) {
        var characters = span.textContent.split('');
        span.textContent = '';
        characters.forEach(function (char) {
            charCount++;
            var charSpan = document.createElement('span');
            charCount++;
            charSpan.style.animationDelay = "".concat(startDelay + (charCount * characterDelay), "s");
            charSpan.textContent = char;
            span.appendChild(charSpan);
        });
    });
};
var animateSegments = function (percentage, animations, options) {
    if (options === void 0) { options = { start: 0, end: 1, debug: false }; }
    var _a = options.start, start = _a === void 0 ? 0 : _a, _b = options.end, end = _b === void 0 ? 1 : _b, _c = options.debug, debug = _c === void 0 ? false : _c;
    var segments = end - start;
    var segmentLength = segments / animations.length;
    var segmentIndex = Math.floor((percentage - start) / segmentLength);
    var segmentStart = start + segmentIndex * segmentLength;
    var segmentPercentage = (percentage - segmentStart) / segmentLength;
    for (var i = 0; i < animations.length; i++) {
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
        console.debug("Percentage: ".concat(percentage, " SegmentIndex: ").concat(segmentIndex, " SegmentPercentage: ").concat(segmentPercentage, " SegmentLength: ").concat(segmentLength, " Start: ").concat(start, " End: ").concat(end));
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
var fadeInOut = function (element, index, elements) {
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
var fadeInHold = function (element, index, elements) {
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
var highlightInOut = function (element, index, elements) {
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
var highlightInOutHold = function (element, index, elements) {
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
var calcPositionRelativeToViewport = function (element, options) {
    if (options === void 0) { options = {}; }
    var _a = options.debug, debug = _a === void 0 ? false : _a, _b = options.boundaryStart, boundaryStart = _b === void 0 ? 'top' : _b, _c = options.boundaryEnd, boundaryEnd = _c === void 0 ? 'top' : _c;
    if (!element) {
        return -1;
    }
    var elementTop = element.getBoundingClientRect().top;
    var elementHeight = element.offsetHeight;
    var startPosition;
    window.innerHeight;
    var endPosition;
    var transitionRatio;
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
        console.debug("".concat(element.className, " ElementTop: ").concat(elementTop, " TransitionRatio: ").concat(transitionRatio, " ElementHeight: ").concat(elementHeight, " Window InnerHeight ").concat(window.innerHeight, " StartPosition ").concat(startPosition, " EndPosition ").concat(endPosition));
    return transitionRatio;
};
var scrollHandler = function (props) {
    var scrollContainerSelector = props.scrollContainerSelector, scrollingElementSelector = props.scrollingElementSelector, animatedElementSelector = props.animatedElementSelector, _a = props.useSegments, useSegments = _a === void 0 ? false : _a, _b = props.start, start = _b === void 0 ? 0 : _b, _c = props.end, end = _c === void 0 ? 1 : _c, _d = props.animationFunction, animationFunction = _d === void 0 ? fadeInOut : _d, boundaryStart = props.boundaryStart, boundaryEnd = props.boundaryEnd, _e = props.debug, debug = _e === void 0 ? false : _e;
    var scrollContainer = document.querySelector(scrollContainerSelector) || window;
    var scrollingElement = document.querySelector(scrollingElementSelector);
    var spans = document.querySelectorAll(animatedElementSelector);
    if (!scrollingElement) {
        console.error('No scrollingElement element found for:', scrollingElementSelector);
        return;
    }
    if (spans.length === 0) {
        console.error('No spans element found for:', animatedElementSelector);
        return;
    }
    var animations = Array.from(spans).map(animationFunction);
    scrollContainer.addEventListener('scroll', function () {
        var transitionRatio = calcPositionRelativeToViewport(scrollingElement, { boundaryStart: boundaryStart, boundaryEnd: boundaryEnd, debug: debug });
        if (debug === true) {
            console.log("ScrollTop: ".concat(scrollContainer.scrollTop, " TransitionRatio: ").concat(transitionRatio));
        }
        if (useSegments) {
            animateSegments(transitionRatio, animations, { start: start, end: end, debug: debug });
        }
        else {
            animations.forEach(function (animation) {
                animation(transitionRatio);
            });
        }
    });
};
var ScrollAnimation = {
    scrollHandler: scrollHandler
};
var Animations = {
    fadeInOut: fadeInOut,
    fadeInHold: fadeInHold,
    highlightInOut: highlightInOut,
    highlightInOutHold: highlightInOutHold
};
document.addEventListener('DOMContentLoaded', function () {
    console.log('DOM fully loaded and parsed');
    var viewportHeight = window.innerHeight;
    var body = document.querySelector('body');
    var navContainer = document.querySelector('.nav-container');
    var hero1Title = document.querySelector('.hero-1-title');
    console.log('DOM fully loaded and parsed, height:', viewportHeight);
    if (hero1Title) {
        fadeInCharacters(document.querySelectorAll('.hero-1-title .word'), 0.5, 0.03);
    }
    var slides = document.querySelector('.slides');
    var slideRights = document.querySelectorAll('.slide .right .content');
    ScrollAnimation.scrollHandler({
        scrollingElementSelector: '.hero.scroll-container',
        animatedElementSelector: '.hero-title-wrapper',
        boundaryStart: 'top',
        boundaryEnd: 'bottom',
        debug: false,
        animationFunction: function (element, index, elements) {
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
        scrollingElementSelector: '.slide-1 .slide-copy p',
        animatedElementSelector: '.slide-1 .highlight',
        animationFunction: Animations.fadeInHold,
        debug: false
    });
    ScrollAnimation.scrollHandler({
        scrollingElementSelector: '.slide-2 .slide-copy p',
        animatedElementSelector: '.slide-2 .highlight',
        animationFunction: Animations.fadeInHold,
        debug: false
    });
    ScrollAnimation.scrollHandler({
        scrollingElementSelector: '.slide-3 .slide-copy p',
        animatedElementSelector: '.slide-3 .highlight',
        animationFunction: Animations.fadeInHold,
        debug: false
    });
    ScrollAnimation.scrollHandler({
        scrollingElementSelector: '.slide-4 .slide-copy p',
        animatedElementSelector: '.slide-4 .highlight',
        animationFunction: Animations.fadeInHold,
        debug: false
    });
    ScrollAnimation.scrollHandler({
        scrollingElementSelector: '.hero.scroll-container',
        animatedElementSelector: '.hero-video-1-wrapper',
        boundaryEnd: 'bottom',
        debug: false,
        animationFunction: function (element, index, elements) {
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
        animationFunction: function (element, index, elements) {
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
        animationFunction: function (element, index, elements) {
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
    var slidez = ['.slide-1', '.slide-2', '.slide-3', '.slide-4'];
    slidez.forEach(function (slide, ind) {
        ScrollAnimation.scrollHandler({
            scrollingElementSelector: "".concat(slide, " .right"),
            animatedElementSelector: "".concat(slide, " .right .content"),
            boundaryStart: 'bottom',
            boundaryEnd: 'bottom',
            debug: slide === '.slide-4' ? true : false,
            animationFunction: function (element, index, elements) {
                var af = createAnimationFunction(element, [
                    {
                        opacity: 0,
                        offset: 0
                    },
                    {
                        opacity: 1,
                        offset: 1
                    }
                ]);
                return function (transitionRatio) {
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
    // ScrollAnimation.scrollHandler({
    //     scrollingElementSelector: '.slide-1',
    //     animatedElementSelector: '.slide-1 .right .content',
    //     boundaryEnd: 'bottom',
    //     debug: false,
    //     animationFunction: (element, index, elements) => {
    //         return (transitionRatio) => {
    //             if (transitionRatio < 0) fixElements(slideRights, -1)
    //             else if (transitionRatio > 0 && transitionRatio < 0.15) fixElements(slideRights, 0)
    //             else if (transitionRatio > 0.15 && transitionRatio < 0.5) fixElements(slideRights, 1);
    //             else if (transitionRatio > 0.5 && transitionRatio < 0.85) fixElements(slideRights, 2);
    //             else if (transitionRatio > 0.85 && transitionRatio < 1) fixElements(slideRights, 3);
    //             else fixElements(slideRights, -1);
    //         }
    //     }
    // });
    // const fixElements = (elements, index: number) => {
    //     // console.log(slideRights);
    //     elements.forEach((element, i) => {
    //         const htmlElement = element as HTMLElement;
    //         if (index > -1) {
    //             htmlElement.style.position = 'fixed';
    //             htmlElement.style.width = '50%';
    //         } else {
    //             htmlElement.style.position = 'relative';
    //             htmlElement.style.width = '100%';
    //         }
    //     });
    // };
    ScrollAnimation.scrollHandler({
        scrollingElementSelector: '.slide-1',
        animatedElementSelector: '.slide-1 .right .content',
        boundaryStart: 'bottom',
        boundaryEnd: 'top',
        debug: false,
        animationFunction: function (element, index, elements) {
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
    // {
    //     scrollContainer: slides,
    //         animate: createAnimationFunction(
    //             document.querySelector('.slide-1 .right .content'),
    //             [
    //                 {
    //                     transform: "matrix(0.8, 0, 0, 0.8, 0, 0)",
    //                     offset: 0
    //                 },
    //                 {
    //                     transform: "matrix(1, 0, 0, 1, 0, 0)",
    //                     offset: 0.10
    //                 },
    //                 {
    //                     transform: "matrix(1, 0, 0, 1, 0, 0)",
    //                     offset: 1
    //                 }
    //             ])
    // },
    var animations = [
    // {
    //     scrollContainer: document.querySelector('.hero.scroll-container'),
    //     animate: createAnimationFunction(
    //         document.querySelector('.hero-title-wrapper'),
    //         [
    //             {
    //                 opacity: 1,
    //                 transform: "matrix(1, 0, 0, 1, 0, 0)",
    //             },
    //             {
    //                 opacity: 1,
    //                 transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
    //                 offset: 0.8
    //             },
    //             {
    //                 opacity: 0,
    //                 transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
    //                 offset: 0.9
    //             },
    //             {
    //                 opacity: 0,
    //                 transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
    //                 offset: 1
    //             }
    //         ]),
    //     debug: true
    // }
    ];
    var animationz = [
        // {
        //     scrollContainer: document.querySelector('.hero.scroll-container'),
        //     animate: createAnimationFunction(
        //         document.querySelector('.hero-video-1-wrapper'),
        //         [
        //             {
        //                 opacity: 1,
        //             },
        //             {
        //                 opacity: 1,
        //                 offset: 0.9
        //             },
        //             {
        //                 opacity: 0,
        //                 offset: 1
        //             }
        //         ])
        // },
        // {
        //     scrollContainer: document.querySelector('.hero.scroll-container'),
        //     animate: createAnimationFunction(
        //         document.querySelector('.hero-title-wrapper'),
        //         [
        //             {
        //                 opacity: 1,
        //                 transform: "matrix(1, 0, 0, 1, 0, 0)",
        //             },
        //             {
        //                 opacity: 1,
        //                 transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
        //                 offset: 0.8
        //             },
        //             {
        //                 opacity: 0,
        //                 transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
        //                 offset: 0.9
        //             },
        //             {
        //                 opacity: 0,
        //                 transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
        //                 offset: 1
        //             }
        //         ])
        // },
        // {
        //     scrollContainer: document.querySelector('.copy.scroll-container'),
        //     animate: createAnimationFunction(
        //         document.querySelector('.copy-title-wrapper'),
        //         [
        //             {
        //                 opacity: 0,
        //                 transform: "matrix(1, 0, 0, 1, 0, 0)",
        //             },
        //             {
        //                 opacity: 1,
        //                 offset: 0.1
        //             },
        //             {
        //                 opacity: 1,
        //                 transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
        //                 offset: 0.3
        //             },
        //             {
        //                 opacity: 0,
        //                 transform: "matrix(1.3, 0, 0, 1.3, 0, 0)",
        //                 offset: 0.35
        //             }
        //         ])
        // },
        // {
        //     scrollContainer: document.querySelector('.copy.scroll-container'),
        //     animate: createAnimationFunction(
        //         document.querySelector('.hero-video-2-wrapper'),
        //         [
        //             {
        //                 opacity: 1,
        //             },
        //             {
        //                 opacity: 1,
        //                 offset: 0.5
        //             },
        //             {
        //                 opacity: 0,
        //                 offset: 1
        //             }
        //         ])
        // },
        {
            scrollContainer: slides,
            animate: createAnimationFunction(document.querySelector('.slide-1 .right .content'), [
                {
                    transform: "matrix(0.8, 0, 0, 0.8, 0, 0)",
                    offset: 0
                },
                {
                    transform: "matrix(1, 0, 0, 1, 0, 0)",
                    offset: 0.10
                },
                {
                    transform: "matrix(1, 0, 0, 1, 0, 0)",
                    offset: 1
                }
            ])
        },
        {
            scrollContainer: slides,
            animate: createAnimationFunction(document.querySelector('.slide-2 .right .content'), [
                {
                    opacity: 0,
                    offset: 0
                },
                {
                    opacity: 0,
                    offset: 0.15
                },
                {
                    opacity: 1,
                    offset: 0.2
                },
                {
                    opacity: 1,
                    offset: 1
                }
            ])
        },
        {
            scrollContainer: slides,
            animate: createAnimationFunction(document.querySelector('.slide-3 .right .content'), [
                {
                    opacity: 0,
                    offset: 0
                },
                {
                    opacity: 0,
                    offset: 0.45
                },
                {
                    opacity: 1,
                    offset: 0.5
                },
                {
                    opacity: 1,
                    offset: 1
                }
            ])
        },
        {
            scrollContainer: slides,
            animate: createAnimationFunction(document.querySelector('.slide-4 .right .content'), [
                {
                    opacity: 0,
                    offset: 0
                },
                {
                    opacity: 0,
                    offset: 0.8
                },
                {
                    opacity: 1,
                    offset: 0.85
                },
                {
                    opacity: 1,
                    offset: 1
                }
            ])
        },
        {
            scrollContainer: slides,
            animate: function (transitionRatio) {
                if (transitionRatio < 0)
                    fixElements(slideRights, -1);
                else if (transitionRatio > 0 && transitionRatio < 0.15)
                    fixElements(slideRights, 0);
                else if (transitionRatio > 0.15 && transitionRatio < 0.5)
                    fixElements(slideRights, 1);
                else if (transitionRatio > 0.5 && transitionRatio < 0.85)
                    fixElements(slideRights, 2);
                else if (transitionRatio > 0.85 && transitionRatio < 1)
                    fixElements(slideRights, 3);
                else
                    fixElements(slideRights, -1);
            }
        }
    ];
    setTimeout(function () {
        if (navContainer) {
            navContainer.classList.remove('off-screen');
        }
    }, 500);
    setTimeout(function () {
        if (body) {
            body.classList.remove('loading');
            body.classList.add('loaded');
        }
    }, 3000);
    window.addEventListener('scroll', function () {
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        var scrollFactorMenuHide = 25;
        if (scrollTop > scrollFactorMenuHide && !navContainer.classList.contains('off-screen')) {
            navContainer.classList.add('off-screen');
        }
        else if (scrollTop < scrollFactorMenuHide && navContainer.classList.contains('off-screen')) {
            navContainer.classList.remove('off-screen');
        }
        for (var _i = 0, animations_2 = animations; _i < animations_2.length; _i++) {
            var animatedElement = animations_2[_i];
            var scrollContainer = animatedElement.scrollContainer;
            if (!scrollContainer) {
                //console.error('No scroll element found for:', animatedElement);
                continue;
            }
            var transitionRatio = void 0;
            if (animatedElement.offsetCalculation === 'viewport') {
                transitionRatio = calcPositionRelativeToViewport(animatedElement.element);
                //console.log(`Relative to viewport: ${transitionRatio}`);
            }
            else if (animatedElement.offsetCalculation === 'container') {
                transitionRatio = calcScrollPositionRelativeToViewport(scrollContainer);
                console.log("Relative to scrollContainer: ".concat(transitionRatio));
            }
            else {
                transitionRatio = calcScrollPositionRelativeToViewport(scrollContainer);
            }
            if (animatedElement.debug === true)
                console.log("TransitionRatio: ".concat(transitionRatio));
            if (animatedElement.animate)
                animatedElement.animate(transitionRatio);
        }
    });
});
