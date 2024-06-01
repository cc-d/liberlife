/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SnapshotGoalOut = {
    properties: {
        created_on: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        updated_on: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        id: {
            type: 'number',
            isRequired: true,
        },
        user_id: {
            type: 'number',
            isRequired: true,
        },
        tasks: {
            type: 'array',
            contains: {
                type: 'SnapshotTaskOut',
            },
        },
        notes: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
            isRequired: true,
        },
        archived: {
            type: 'boolean',
        },
        board_id: {
            type: 'string',
            isRequired: true,
        },
        text: {
            type: 'string',
            isRequired: true,
        },
        tasks_locked: {
            type: 'boolean',
        },
    },
} as const;
