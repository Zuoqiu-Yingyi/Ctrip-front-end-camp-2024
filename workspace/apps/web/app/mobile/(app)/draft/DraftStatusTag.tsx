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
import { Tag } from "antd-mobile";
import {
    //
    CheckCircleOutline,
    CloseCircleOutline,
    ExclamationTriangleOutline,
    FileOutline,
    MoreOutline,
} from "antd-mobile-icons";

import { ReviewStatus } from "@repo/server/src/types/review";

export function DraftStatusTag({
    //
    status,
    showText = true,
    showIcon = true,
}: {
    status: ReviewStatus | null;
    showText?: boolean;
    showIcon?: boolean;
}): JSX.Element {
    const { t } = useTranslation();

    switch (status) {
        case null:
        default: {
            const text = t("review-status.unpublished");
            return (
                <Tag
                    color="default"
                    fill="outline"
                    aria-label={showText ? undefined : text}
                >
                    {showIcon && <FileOutline />}
                    {showText && (
                        <>
                            &thinsp;
                            {text}
                        </>
                    )}
                </Tag>
            );
        }
        case ReviewStatus.Pending: {
            const text = t("review-status.padding");
            return (
                <Tag
                    color="primary"
                    fill="outline"
                    aria-label={showText ? undefined : text}
                >
                    {showIcon && <MoreOutline />}
                    {showText && (
                        <>
                            &thinsp;
                            {text}
                        </>
                    )}
                </Tag>
            );
        }
        case ReviewStatus.Approved: {
            const text = t("review-status.passed");
            return (
                <Tag
                    color="success"
                    fill="outline"
                    aria-label={showText ? undefined : text}
                >
                    {showIcon && <CheckCircleOutline />}
                    {showText && (
                        <>
                            &thinsp;
                            {text}
                        </>
                    )}
                </Tag>
            );
        }
        case ReviewStatus.Rejected: {
            const text = t("review-status.failed");
            return (
                <Tag
                    color="warning"
                    fill="outline"
                    aria-label={showText ? undefined : text}
                >
                    {showIcon && <ExclamationTriangleOutline />}
                    {showText && (
                        <>
                            &thinsp;
                            {text}
                        </>
                    )}
                </Tag>
            );
        }
        case ReviewStatus.Canceled: {
            const text = t("review-status.canceled");
            return (
                <Tag
                    color="danger"
                    fill="outline"
                    aria-label={showText ? undefined : text}
                >
                    {showIcon && <CloseCircleOutline />}
                    {showText && (
                        <>
                            &thinsp;
                            {text}
                        </>
                    )}
                </Tag>
            );
        }
    }
}
export default DraftStatusTag;
