/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class RootService {
    /**
     * Index
     * @returns any Successful Response
     * @throws ApiError
     */
    public static indexIndexGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/index',
            errors: {
                404: `Not found`,
            },
        });
    }
    /**
     * Index
     * @returns any Successful Response
     * @throws ApiError
     */
    public static indexGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/',
            errors: {
                404: `Not found`,
            },
        });
    }
    /**
     * Get Openapi
     * @returns any Successful Response
     * @throws ApiError
     */
    public static getOpenapiOpenapiJsonGet(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/openapi.json',
            errors: {
                404: `Not found`,
            },
        });
    }
}
