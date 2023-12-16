/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GoalTaskOut } from './GoalTaskOut';
import type { UserOut } from './UserOut';

export type GoalOut = {
    created_on: string;
    updated_on: string;
    id: number;
    text: string;
    template_id?: (number | null);
    user_id: number;
    user: UserOut;
    tasks: Array<GoalTaskOut>;
    notes: (string | null);
    archived?: boolean;
    tasks_locked?: boolean;
};

