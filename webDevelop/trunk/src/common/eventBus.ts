import mitt from 'mitt';

type Events = {
    sashRePosition: void;
};
export default mitt<Events>();
