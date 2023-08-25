import mitt from 'mitt';

type Events = {
    // 页面元素大小变化时，不会触发resize事件，可以触发该事件表示需要更新当前页面的某些元素
    manualResize: void;
};
export const $bus = mitt<Events>();

export default $bus;
