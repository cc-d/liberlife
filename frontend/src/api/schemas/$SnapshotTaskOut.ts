/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $SnapshotTaskOut = {
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
        completed: {
            type: 'boolean',
            isRequired: true,
        },
        goal_id: {
            type: 'number',
            isRequired: true,
        },
        text: {
            type: 'string',
            isRequired: true,
        },
    },
} as const;
