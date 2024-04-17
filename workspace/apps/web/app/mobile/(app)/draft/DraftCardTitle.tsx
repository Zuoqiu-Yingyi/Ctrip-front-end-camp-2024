/**
 * Copyright (C) 2024 Zuoqiu Yingyi
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

"use client";

import { useTranslation } from "react-i18next";
import {
    //
    Ellipsis,
    Space,
} from "antd-mobile";

import DraftStatusTag from "./DraftStatusTag";
import type { ReviewStatus } from "@repo/server/src/types/review";

export function DraftCardTitle({
    //
    title,
    status,
    published,
}: {
    title: string;
    status: ReviewStatus | null;
    published: boolean;
}): JSX.Element {
    const { t } = useTranslation();

    return (
        <Space
            justify="between"
            block={true}
        >
            <Ellipsis
                direction="end"
                content={title}
                style={{
                    maxWidth: "calc(100vw - 8em)",
                    wordBreak: "break-word",
                }}
            />
            <DraftStatusTag status={status} />
        </Space>
    );
}
export default DraftCardTitle;
