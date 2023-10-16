/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GoalOut = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        created_on: {
            type: 'string',
            isRequired: true,
            format: 'date-time',
        },
        updated_on: {
            type: 'any-of',
            contains: [{
                type: 'string',
                format: 'date-time',
            }, {
                type: 'null',
            }],
        },
        text: {
            type: 'string',
            isRequired: true,
        },
        user_id: {
            type: 'number',
            isRequired: true,
        },
        user: {
            type: 'UserOut',
            isRequired: true,
        },
        tasks: {
            type: 'array',
            contains: {
                type: 'GoalTaskOut',
            },
            isRequired: true,
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
