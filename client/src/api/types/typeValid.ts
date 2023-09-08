import Ajv from 'ajv';
import type { AxiosRequestConfig } from 'axios';
import resSchema from './ApiRes.json';
import reqSchema from './ApiReq.json';
import baseRequest from '@/common/axios';
import baseConfig from '@/config/base';

const ajv = new Ajv({ schemas: [resSchema, reqSchema] });

/**
 * @param type json-schema中的类型标识(不包含 ApiReq. 或 ApiRes.)；若type为undefined，则不校验直接通过
 * @param data 请求体
 */
export const validRequest = (type: string, data?: any) => {
    return async function (config: AxiosRequestConfig<typeof data>) {
        if (import.meta.env.DEV && baseConfig.api.VALIDATE_REQUEST_DATA_IN_DEV && data) {
            const reqValidate = ajv.getSchema(`req#/definitions/ApiReq.${type}`);
            if (reqValidate === undefined) {
                console.error(`request valid failed (${type}): cant find type "ApiReq.${type}"`);
            } else if (reqValidate(data) === false) {
                console.error(`request valid failed (${type}): ${reqValidate.errors?.[0].message}`);
            }
        }
        const res = await baseRequest(config);
        if (import.meta.env.DEV && baseConfig.api.VALIDATE_RESPONSE_DATA_IN_DEV) {
            const resValidate = ajv.getSchema(`res#/definitions/ApiRes.${type}`);
            if (resValidate === undefined) {
                // 若响应体为空且未定义该类型，不作警告
                if (res.data.data) {
                    console.error(
                        `response valid failed (${type}): cant find type "ApiRes.${type}"`
                    );
                }
            } else if (resValidate(res.data.data) === false) {
                console.error(
                    `response valid failed (${type}): ${resValidate.errors?.[0].message}`
                );
            }
        }
        return res;
    };
};
