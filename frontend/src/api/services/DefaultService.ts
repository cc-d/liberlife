/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoalTemplateDB } from '../models/GoalTemplateDB';
import type { GoalTemplateIn } from '../models/GoalTemplateIn';
import type { GoalTemplateUpdate } from '../models/GoalTemplateUpdate';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * List Goal Templates
     * @returns GoalTemplateDB Successful Response
     * @throws ApiError
     */
    public static listGoalTemplatesTemplatesGet(): CancelablePromise<Array<GoalTemplateDB>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/templates',
        });
    }
    /**
     * Create Goal Template
     * @param requestBody
     * @returns GoalTemplateDB Successful Response
     * @throws ApiError
     */
    public static createGoalTemplateTemplatesPost(
        requestBody: GoalTemplateIn,
    ): CancelablePromise<GoalTemplateDB> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/templates',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update Goal Template
     * @param templateId
     * @param requestBody
     * @returns GoalTemplateDB Successful Response
     * @throws ApiError
     */
    public static updateGoalTemplateTemplatesTemplateIdPut(
        templateId: number,
        requestBody: GoalTemplateUpdate,
    ): CancelablePromise<GoalTemplateDB> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Goal Template
     * @param templateId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteGoalTemplateTemplatesTemplateIdDelete(
        templateId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/templates/{template_id}',
            path: {
                'template_id': templateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
