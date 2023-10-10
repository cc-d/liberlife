/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GoalIn } from '../models/GoalIn';
import type { GoalOut } from '../models/GoalOut';
import type { GoalTaskIn } from '../models/GoalTaskIn';
import type { GoalTaskOut } from '../models/GoalTaskOut';
import type { GoalTaskUpdate } from '../models/GoalTaskUpdate';
import type { GoalUpdateNotes } from '../models/GoalUpdateNotes';

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
            url: '/goals',
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
            url: '/goals',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Goal
     * @param goalId
     * @returns GoalOut Successful Response
     * @throws ApiError
     */
    public static getGoalGoalsGoalIdGet(
        goalId: number,
    ): CancelablePromise<GoalOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/goals/{goal_id}',
            path: {
                'goal_id': goalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Goal
     * @param goalId
     * @param requestBody
     * @returns GoalOut Successful Response
     * @throws ApiError
     */
    public static updateGoalGoalsGoalIdPut(
        goalId: number,
        requestBody: GoalIn,
    ): CancelablePromise<GoalOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/goals/{goal_id}',
            path: {
                'goal_id': goalId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Goal
     * @param goalId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteGoalGoalsGoalIdDelete(
        goalId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/goals/{goal_id}',
            path: {
                'goal_id': goalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Goal Notes
     * @param goalId
     * @param requestBody
     * @returns GoalOut Successful Response
     * @throws ApiError
     */
    public static updateGoalNotesGoalsGoalIdNotesPut(
        goalId: number,
        requestBody: GoalUpdateNotes,
    ): CancelablePromise<GoalOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/goals/{goal_id}/notes',
            path: {
                'goal_id': goalId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Add Task To Goal
     * @param goalId
     * @param requestBody
     * @returns GoalTaskOut Successful Response
     * @throws ApiError
     */
    public static addTaskToGoalGoalsGoalIdTasksPost(
        goalId: number,
        requestBody: GoalTaskIn,
    ): CancelablePromise<GoalTaskOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/goals/{goal_id}/tasks',
            path: {
                'goal_id': goalId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * List Tasks For Goal
     * @param goalId
     * @returns GoalTaskOut Successful Response
     * @throws ApiError
     */
    public static listTasksForGoalGoalsGoalIdTasksGet(
        goalId: number,
    ): CancelablePromise<Array<GoalTaskOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/goals/{goal_id}/tasks',
            path: {
                'goal_id': goalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get Task
     * @param taskId
     * @param goalId
     * @returns GoalTaskOut Successful Response
     * @throws ApiError
     */
    public static getTaskGoalsGoalIdTasksTaskIdGet(
        taskId: number,
        goalId: number,
    ): CancelablePromise<GoalTaskOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/goals/{goal_id}/tasks/{task_id}',
            path: {
                'task_id': taskId,
                'goal_id': goalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update Task
     * @param taskId
     * @param goalId
     * @param requestBody
     * @returns GoalTaskOut Successful Response
     * @throws ApiError
     */
    public static updateTaskGoalsGoalIdTasksTaskIdPut(
        taskId: number,
        goalId: number,
        requestBody: GoalTaskUpdate,
    ): CancelablePromise<GoalTaskOut> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/goals/{goal_id}/tasks/{task_id}',
            path: {
                'task_id': taskId,
                'goal_id': goalId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Task
     * @param taskId
     * @param goalId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteTaskGoalsGoalIdTasksTaskIdDelete(
        taskId: number,
        goalId: number,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/goals/{goal_id}/tasks/{task_id}',
            path: {
                'task_id': taskId,
                'goal_id': goalId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
