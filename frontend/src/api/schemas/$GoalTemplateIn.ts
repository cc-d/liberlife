/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GoalTemplateIn = {
    properties: {
        text: {
            type: 'string',
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
        tasks: {
            type: 'any-of',
            contains: [{
                type: 'array',
                contains: {
                    type: 'TemplateTaskIn',
                },
            }, {
                type: 'null',
            }],
        },
    },
} as const;
