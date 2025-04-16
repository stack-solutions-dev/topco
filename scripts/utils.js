// export const createScrollAnimation = (props: {
//     scrollContainerSelector: string | undefined;
//     scrollingElementSelector: string;
//     animatedElementSelector: string;
//     useSegments?: boolean;
//     start?: number;
//     end?: number;
//     animationFunction?: any;
//     // animationFunction?: (element: Element) => (ratio: number) => void;
//     boundaryStart?: string;
//     boundaryEnd?: string;
//     debug?: boolean;
// }) => {
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
export const createScrollAnimation = (props) => {
    const { scrollContainerSelector, scrollingElementSelector, animatedElementSelector, useSegments = false, start = 0, end = 1, animationFunction = () => console.error("No animation function provided"), boundaryStart, boundaryEnd, debug = false } = props;
    // const scrollContainer: HTMLElement | (Window & typeof globalThis) = document.querySelector(scrollContainerSelector) || window;
    const scrollContainer = document.querySelector(scrollContainerSelector) || window;
    const scrollingElement = document.querySelector(scrollingElementSelector);
    const elements = document.querySelectorAll(animatedElementSelector);
    if (!scrollingElement) {
        console.error('No scrollingElement element found for:', scrollingElementSelector);
        return;
    }
    if (elements.length === 0) {
        console.error('No spans element found for:', animatedElementSelector);
        return;
    }
    const animations = Array.from(elements).map(animationFunction);
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
