/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskUpdateIn } from '../models/TaskUpdateIn';
import type { TaskUpdateOut } from '../models/TaskUpdateOut';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TaskUpdatesService {

    /**
     * Create Task Update
     * @param requestBody
     * @returns TaskUpdateOut Successful Response
     * @throws ApiError
     */
    public static createTaskUpdateTuPost(
        requestBody: TaskUpdateIn,
    ): CancelablePromise<TaskUpdateOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/tu/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Task Update
     * @param taskUpdateId
     * @returns TaskUpdateOut Successful Response
     * @throws ApiError
     */
    public static getTaskUpdateTuTaskUpdateIdGet(
        taskUpdateId: number,
    ): CancelablePromise<TaskUpdateOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/tu/{task_update_id}/',
            path: {
                'task_update_id': taskUpdateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Task Update
     * @param taskUpdateId
     * @param requestBody
     * @returns TaskUpdateOut Successful Response
     * @throws ApiError
     */
    public static updateTaskUpdateTuTaskUpdateIdPut(
        taskUpdateId: number,
        requestBody: TaskUpdateIn,
    ): CancelablePromise<TaskUpdateOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/tu/{task_update_id}/',
            path: {
                'task_update_id': taskUpdateId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Task Update
     * @param taskUpdateId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteTaskUpdateTuTaskUpdateIdDelete(
        taskUpdateId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/tu/{task_update_id}/',
            path: {
                'task_update_id': taskUpdateId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
