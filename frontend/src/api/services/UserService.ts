/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Token } from '../models/Token';
import type { UserBase } from '../models/UserBase';
import type { UserIn } from '../models/UserIn';
import type { UserOut } from '../models/UserOut';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Register
     * @param requestBody
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static registerURegisterPost(
        requestBody: UserIn,
    ): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/u/register',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Login
     * @param requestBody
     * @returns Token Successful Response
     * @throws ApiError
     */
    public static loginULoginPost(
        requestBody: UserIn,
    ): CancelablePromise<Token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/u/login',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Me
     * @returns UserBase Successful Response
     * @throws ApiError
     */
    public static meUMeGet(): CancelablePromise<UserBase> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/u/me',
        });
    }

}
