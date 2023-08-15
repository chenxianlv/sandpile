import type { ObjectDirective } from 'vue';
import { useUserStore } from '@/stores/userStore';

const vAuth: ObjectDirective<any, number[]> = {
    mounted(el, binding) {
        const requiredAuthIdArr = binding.value;
        const isAllowed = useUserStore().authenticate(requiredAuthIdArr);

        if (!isAllowed) {
            el.parentNode?.removeChild(el);
        }
    },
};

export default vAuth;

export { vAuth };
