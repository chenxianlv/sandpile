import mitt from 'mitt';

type Events = {
    sashRePosition: void;
};
export const $bus = mitt<Events>();
