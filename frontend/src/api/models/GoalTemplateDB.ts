/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TemplateTaskDB } from './TemplateTaskDB';
export type GoalTemplateDB = {
    id: number;
    text: string;
    user_id: number;
    tasks: Array<TemplateTaskDB>;
    notes?: (string | null);
    use_todays_date: boolean;
};

