/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { SnapshotTaskOut } from './SnapshotTaskOut';

export type SnapshotGoalOut = {
    created_on: string;
    updated_on: string;
    id: number;
    user_id: number;
    tasks?: Array<SnapshotTaskOut>;
    notes: (string | null);
    archived?: boolean;
    board_id: string;
    text: string;
};

