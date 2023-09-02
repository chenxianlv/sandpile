import Ajv from 'ajv';
import resSchema from './ApiRes.json';
import reqSchema from './ApiReq.json';
import type { NormalResponse } from '@/common/axios';

const ajv = new Ajv({ schemas: [resSchema, reqSchema] });

/**
 * @param promise
 * @param type json-schema中的类型标识；若type为undefined，则不校验直接通过
 */
export const resValid = async (promise: NormalResponse<any>, type?: string) => {
    const res = await promise;
    if (type === undefined) {
        return res;
    }
    const validate = ajv.getSchema(`res#/definitions/${type}`);
    if (validate && validate(res.data.data) === false) {
        console.error(`response valid failed (${type}): ${validate.errors?.[0].message}`);
    }
    return res;
};

export const reqValid = (data: any, type: string) => {
    const validate = ajv.getSchema(`req#/definitions/${type}`);
    if (validate && validate(data) === false) {
        console.error(`request valid failed (${type}): ${validate.errors?.[0].message}`);
    }
};
