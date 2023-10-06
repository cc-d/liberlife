/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TaskOut = {
    properties: {
        id: {
            type: 'number',
            isRequired: true,
        },
        created_on: {
            type: 'string',
            isRequired: true,
        },
        updated_on: {
            type: 'string',
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
        updates: {
            type: 'array',
            contains: {
                type: 'TaskUpdateOut',
            },
        },
    },
} as const;
