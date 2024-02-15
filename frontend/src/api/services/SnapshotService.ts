/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SnapshotOut } from '../models/SnapshotOut';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class SnapshotService {
    /**
     * List Snapshots
     * @returns SnapshotOut Successful Response
     * @throws ApiError
     */
    public static listSnapshotsSnapshotsGet(): CancelablePromise<Array<SnapshotOut>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/snapshots',
        });
    }
    /**
     * Create Snapshot
     * @returns SnapshotOut Successful Response
     * @throws ApiError
     */
    public static createSnapshotSnapshotsPost(): CancelablePromise<SnapshotOut> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/snapshots',
        });
    }
    /**
     * Get Snapshot
     * @param snapId
     * @returns SnapshotOut Successful Response
     * @throws ApiError
     */
    public static getSnapshotSnapshotsSnapIdGet(
        snapId: string,
    ): CancelablePromise<SnapshotOut> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/snapshots/{snap_id}',
            path: {
                'snap_id': snapId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Delete Snapshot
     * @param snapId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static deleteSnapshotSnapshotsSnapIdDelete(
        snapId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/snapshots/{snap_id}',
            path: {
                'snap_id': snapId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
