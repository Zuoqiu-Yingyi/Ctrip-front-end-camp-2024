/**
 * Copyright (C) 2024 lyt
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import type trpc from "@/utils/trpc";
import type { ReviewStatus } from "@repo/server/src/types/review";

export type TPublishPagingQueryResponse = Awaited<ReturnType<typeof trpc.publish.paging.query>>;
export type TPublish = NonNullable<TPublishPagingQueryResponse["data"]>["publishs"][0];

/**
 * ISO 8601 格式时间戳
 */
export type TTimestamp_ISO_8601 = string;

/**
 * Cuid 格式的 UID
 */
export type TCuid = string;

/**
 * 资源文件
 */
export interface IAsset {
    index: number;
    asset_uid: string;
}

/**
 * 坐标
 */
export interface ICoordinate {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitude_accuracy: number | null;
    heading: number | null;
    speed: number | null;
}

/**
 * 用户
 */
export interface IUser {
    name: string;
    profile: {
        avatar: TCuid | null;
    };
}

/**
 * 发布项
 */
export interface IPublishConnect {
    uid: TCuid;
}

/**
 * 游记
 */
export interface INote {
    title: string;
    content: string;
    assets: IAsset[];
    coordinate: ICoordinate | null;
    modification_time: TTimestamp_ISO_8601;
}

/**
 * 游记草稿
 */
export interface IDraft extends INote {
    id: number;
    creation_time: TTimestamp_ISO_8601;
    status: ReviewStatus | null;
    author_id: number;
    publish?: IPublishConnect;
}

/**
 * 游记审批
 */
export interface IReview extends INote {
    id: number;
    submission_time: TTimestamp_ISO_8601;
    status: ReviewStatus;
    comment?: string;
    approval_time?: TTimestamp_ISO_8601;
    submitter_id: number;
    draft_id: number;
    submitter: IUser;
    publish?: IPublishConnect;
}

/**
 * 游记发布
 */
export interface IPublish extends INote {
    uid: TCuid;
    publication_time: TTimestamp_ISO_8601;
    draft_id: number;
    publisher: IUser;
}
