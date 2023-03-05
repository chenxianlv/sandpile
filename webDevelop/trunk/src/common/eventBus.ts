import mitt from 'mitt';

type Events = {
    sashRePosition: void;
    headerCollapse: boolean;
};
export default mitt<Events>();
