/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { TaskUpdateOut } from './TaskUpdateOut';

export type TaskOut = {
    id: number;
    created_on: string;
    updated_on: string;
    text: string;
    user_id: number;
    updates?: Array<TaskUpdateOut>;
};

