/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $GoalTemplateDB = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        text: {
            type: 'string',
            isRequired: true,
        },
        user_id: {
            type: 'number',
            isRequired: true,
        },
        tasks: {
            type: 'array',
            contains: {
                type: 'TemplateTaskDB',
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
        use_todays_date: {
            type: 'boolean',
            isRequired: true,
        },
    },
} as const;
