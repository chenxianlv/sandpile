import type { FunctionDirective } from 'vue';
import { useUserStore } from '@/stores/userStore';

const vAuth: FunctionDirective<any, number[]> = (el, binding) => {
    const requiredAuthIdArr = binding.value;
    const isAllowed = useUserStore().authenticate(requiredAuthIdArr);
    if (!isAllowed) {
        el.parentNode?.removeChild(el);
    }
};

export default vAuth;

export { vAuth };
