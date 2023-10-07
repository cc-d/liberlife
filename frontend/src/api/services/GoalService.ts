/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoalIn } from '../models/GoalIn';
import type { GoalOut } from '../models/GoalOut';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GoalService {

    /**
     * List Goals
     * @returns GoalOut Successful Response
     * @throws ApiError
     */
    public static listGoalsGoalsGet(): CancelablePromise<Array<GoalOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/goals/',
        });
    }

    /**
     * Create Goal
     * @param requestBody
     * @returns GoalOut Successful Response
     * @throws ApiError
     */
    public static createGoalGoalsPost(
        requestBody: GoalIn,
    ): CancelablePromise<GoalOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/goals/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
