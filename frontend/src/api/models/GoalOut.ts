/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GoalTaskOut } from './GoalTaskOut';
import type { UserOut } from './UserOut';

export type GoalOut = {
    id: number;
    created_on: string;
    updated_on?: (string | null);
    text: string;
    user_id: number;
    user: UserOut;
    tasks?: Array<GoalTaskOut>;
    notes?: (string | null);
};

