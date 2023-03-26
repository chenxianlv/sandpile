import mitt from 'mitt';

type Events = {
    sashRePosition: void;
    showLoginDialog: void;
};
export const $bus = mitt<Events>();
