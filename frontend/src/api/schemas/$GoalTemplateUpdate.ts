/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GoalTemplateUpdate = {
    properties: {
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
        tasks: {
            type: 'any-of',
            contains: [{
                type: 'array',
                contains: {
                    type: 'TemplateTaskUpdate',
                },
            }, {
                type: 'null',
            }],
        },
        use_todays_date: {
            type: 'any-of',
            contains: [{
                type: 'boolean',
            }, {
                type: 'null',
            }],
        },
    },
} as const;
