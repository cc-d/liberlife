/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Body_oauth_login_u_oauth_login_post } from '../models/Body_oauth_login_u_oauth_login_post';
import type { Token } from '../models/Token';
import type { UserIn } from '../models/UserIn';
import type { UserOut } from '../models/UserOut';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * Register
     * @param requestBody
     * @returns Token Successful Response
     * @throws ApiError
     */
    public static registerURegisterPost(
        requestBody: UserIn,
    ): CancelablePromise<Token> {
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
     * Oauth Login
     * @param formData
     * @returns Token Successful Response
     * @throws ApiError
     */
    public static oauthLoginUOauthLoginPost(
        formData: Body_oauth_login_u_oauth_login_post,
    ): CancelablePromise<Token> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/u/oauth_login',
            formData: formData,
            mediaType: 'application/x-www-form-urlencoded',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Json Login
     * @param requestBody
     * @returns Token Successful Response
     * @throws ApiError
     */
    public static jsonLoginULoginPost(
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
     * @returns UserOut Successful Response
     * @throws ApiError
     */
    public static meUMeGet(): CancelablePromise<UserOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/u/me',
        });
    }

}
