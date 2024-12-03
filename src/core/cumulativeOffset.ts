// q@ts-nocheck
/* qeslint-disable */
/* eslint-disable no-param-reassign */
const cumulativeOffset = function (element: any) {
    let top = 0;
    let left = 0;

    do {
        top += element.offsetTop || 0;
        left += element.offsetLeft || 0;
        element = element.offsetParent;
    } while (element);

    return {
        top: top,
        left: left
    };
};

export { cumulativeOffset };
