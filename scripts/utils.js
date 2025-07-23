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

export const createScrollAnimation = (props) => {
    const {
        debug = false,
        calculateElementPosition = false,
        scrollContainerSelector,
        scrollingElementSelector,
        animatedElementSelector,
        useSegments = false,
        start = 0,
        end = 1,
        animationFunction = () => console.error("No animation function provided"),
        boundaryStart,
        boundaryEnd,
        // resetPosition = 0,
        minScreenWidth = null,
        maxScreenWidth = null
    } = props;
    // const scrollContainer: HTMLElement | (Window & typeof globalThis) = document.querySelector(scrollContainerSelector) || window;
    const scrollContainer = document.querySelector(scrollContainerSelector) || window;
    const scrollingElement = document.querySelector(scrollingElementSelector);
    const elements = document.querySelectorAll(animatedElementSelector);
    let screenWidth = window.innerWidth;

    if (!scrollingElement) {
        console.error('No scrollingElement element found for:', scrollingElementSelector);
        return;
    }
    if (elements.length === 0) {
        console.error('No spans element found for:', animatedElementSelector);
        return;
    }
    const arrElements = Array.from(elements);
    const animations = arrElements.map(animationFunction);

    const doStuff = () => {
        if (maxScreenWidth && window.innerWidth > maxScreenWidth || minScreenWidth && window.innerWidth < minScreenWidth) {
            if (debug) console.log(`Scroll animation ${animatedElementSelector}: Skipping animations for screen width: ${window.innerWidth} (max: ${maxScreenWidth}) (min: ${maxScreenWidth})`);
            return; // Skip animations if the screen width exceeds the maximum specified
        }

        let transitionRatio;

        if (calculateElementPosition) {
            arrElements.forEach((element, index) => {
                if (debug) console.log(`Scroll animation ${animatedElementSelector}: Scroll animation ${animatedElementSelector}: Calculating position for element ${index}:`, element);
                transitionRatio = calcPositionRelativeToViewport(element, { boundaryStart, boundaryEnd, debug });
                if (debug) console.log(`Scroll animation ${animatedElementSelector}: Scroll animation ${animatedElementSelector}: Element ${index} TransitionRatio: ${transitionRatio}`);
                animations[index](transitionRatio);
            });

        } else {
            transitionRatio = calcPositionRelativeToViewport(scrollingElement, { boundaryStart, boundaryEnd, debug });

            if (useSegments) {
                animateSegments(transitionRatio, animations, { start, end, debug });
                return
            }

            animations.forEach((animation) => {
                animation(transitionRatio || 0);
            });

            if (debug === true) console.log(`Scroll animation ${animatedElementSelector}: ScrollTop: ${scrollContainer.scrollTop} TransitionRatio: ${transitionRatio}`);
        }
    }

    scrollContainer.addEventListener('scroll', doStuff);

    if (scrollContainer === window) {
        window.addEventListener('resize', (ev) => {
            if (window.innerWidth === screenWidth) {
                if (debug) console.debug(`Scroll animation ${animatedElementSelector}: Window resized to same width: ${window.innerWidth}, no action taken`, ev);
                return;
            }
            if (maxScreenWidth && window.innerWidth > maxScreenWidth || minScreenWidth && window.innerWidth < minScreenWidth) {
                if (debug) console.debug(`Scroll animation ${animatedElementSelector}: Window resized to: ${window.innerWidth} maxScreenWidth ${maxScreenWidth} minScreenWidth ${minScreenWidth}`, ev);
                animations.forEach((animation) => {
                    animation(null, true);
                });
                if (debug) console.debug(`Scroll animation ${animatedElementSelector}: Animations cancelled for screen width: ${window.innerWidth} (less than max: ${maxScreenWidth})`);
                return;
            }
            screenWidth = window.innerWidth;
            doStuff();
        });
        window.addEventListener('load', doStuff);
    } else {
        if (scrollContainer instanceof HTMLElement) {
            if (scrollContainer.complete || scrollContainer.readyState === 'complete') {
                doStuff();
            } else {
                scrollContainer.addEventListener('load', doStuff);
            }
        }
    }
};

export const createAnimationFunction = (element, keyframes) => {
    const animation = new Animation(new KeyframeEffect(element, keyframes, { duration: 100, fill: 'forwards' }));
    return (transitionRatio, removeAnimation) => {
        if (removeAnimation) {
            animation.cancel();
            // animation = null; // Actually destroy the reference
            return;
        }
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

export const fadeInCharacters = (spans, startDelay, characterDelay) => {
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

export const fadeInOut = (element, index, elements) => {
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

export const fadeInHold = (element, index, elements) => {
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

export const highlightInOut = (element, index, elements) => {
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

export const highlightInOutHold = (element, index, elements) => {
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

export const Animations = {
    fadeInOut: fadeInOut,
    fadeInHold: fadeInHold,
    highlightInOut: highlightInOut,
    highlightInOutHold: highlightInOutHold
};
