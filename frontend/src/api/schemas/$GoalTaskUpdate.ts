/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GoalTaskUpdate = {
    properties: {
        status: {
            type: 'any-of',
            contains: [{
                type: 'TaskStatus',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
