/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TaskIn } from '../models/TaskIn';
import type { TaskOut } from '../models/TaskOut';
import type { TaskUpdateIn } from '../models/TaskUpdateIn';
import type { TaskUpdateOut } from '../models/TaskUpdateOut';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class TaskService {

    /**
     * List Tasks
     * @returns TaskOut Successful Response
     * @throws ApiError
     */
    public static listTasksTGet(): CancelablePromise<Array<TaskOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/t/',
        });
    }

    /**
     * Create Task
     * @param requestBody
     * @returns TaskOut Successful Response
     * @throws ApiError
     */
    public static createTaskTPost(
        requestBody: TaskIn,
    ): CancelablePromise<TaskOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/t/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Add Task Update
     * @param requestBody
     * @returns TaskUpdateOut Successful Response
     * @throws ApiError
     */
    public static addTaskUpdateTTaskIdUpdatesPost(
        requestBody: TaskUpdateIn,
    ): CancelablePromise<TaskUpdateOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/t/{task_id}/updates',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * List Task Updates
     * @param taskId
     * @returns TaskUpdateOut Successful Response
     * @throws ApiError
     */
    public static listTaskUpdatesTTaskIdUpdatesGet(
        taskId: number,
    ): CancelablePromise<Array<TaskUpdateOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/t/{task_id}/updates',
            path: {
                'task_id': taskId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
