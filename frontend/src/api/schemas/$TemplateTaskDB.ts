/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export const $TemplateTaskDB = {
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
        text: {
            type: 'string',
            isRequired: true,
        },
        template_id: {
            type: 'number',
            isRequired: true,
        },
    },
} as const;
