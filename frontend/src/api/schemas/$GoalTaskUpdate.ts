/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GoalTaskUpdate = {
    properties: {
        completed: {
            type: 'any-of',
            contains: [{
                type: 'boolean',
            }, {
                type: 'null',
            }],
        },
        text: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
        notes: {
            type: 'any-of',
            contains: [{
                type: 'string',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
