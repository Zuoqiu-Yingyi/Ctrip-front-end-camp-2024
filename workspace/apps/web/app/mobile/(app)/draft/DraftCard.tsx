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

"use client";

import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
    Divider,
    //
    Ellipsis,
    Image,
    List,
    Space,
    SwipeAction,
    Tag,
} from "antd-mobile";
import {
    AddCircleOutline,
    DeleteOutline,
    //
    EditFill,
    EditSOutline,
    EyeOutline,
    MessageOutline,
} from "antd-mobile-icons";

import styles from "./page.module.scss";
import { uid2path } from "@/utils/image";
import { TTimestamp_ISO_8601 } from "@/types/response";
import { timestampFormat } from "@/utils/time";
import { PATHNAME } from "@/utils/pathname";
import { DetailType } from "@/utils/search-params";

export function DraftCard({
    //
    id,
    coverUid,
    title,
    content,
    creation,
    modification,
}: {
    id: number;
    coverUid: string;
    title: string;
    content: string;
    creation: TTimestamp_ISO_8601;
    modification: TTimestamp_ISO_8601;
}) {
    const { t } = useTranslation();
    const router = useRouter();

    /**
     * 点击卡片
     */
    function onClickCard() {
        // TODO: 点击卡片
    }

    /**
     * 编辑草稿
     */
    function editDraft() {
        const searchParams = new URLSearchParams();
        searchParams.set("id", id.toString());
        router.push(`${PATHNAME.mobile.edit}?${searchParams.toString()}`);
    }

    /**
     * 预览草稿
     */
    function previewDraft() {
        const searchParams = new URLSearchParams();
        searchParams.set("id", id.toString());
        searchParams.set("type", DetailType.DRAFT);
        router.push(`${PATHNAME.mobile.detail}?${searchParams.toString()}`);
    }

    /**
     * 查看发布状态
     */
    async function checkPublishStatus() {
        // TODO: 查看发布状态
    }

    /**
     * 删除草稿
     */
    async function deleteDraft() {
        // TODO: 删除草稿
    }

    return (
        // REF: https://mobile.ant.design/zh/components/swipe-action
        <SwipeAction
            leftActions={[
                {
                    key: "delete",
                    color: "danger",
                    text: (
                        <>
                            <DeleteOutline aria-label={t("aria.draft.delete")} />
                            &thinsp;
                            {t("delete")}
                        </>
                    ),
                    onClick: deleteDraft,
                },
                {
                    key: "review",
                    color: "light",
                    text: (
                        <>
                            <MessageOutline aria-label={t("aria.draft.review-status")} />
                            &thinsp;
                            {t("labels.review-status")}
                        </>
                    ),
                    onClick: checkPublishStatus,
                },
            ]}
            rightActions={[
                {
                    key: "edit",
                    color: "light",
                    text: (
                        <>
                            <EditSOutline aria-label={t("aria.draft.edit")} />
                            &thinsp;
                            {t("labels.edit")}
                        </>
                    ),
                    onClick: editDraft,
                },
                {
                    key: "preview",
                    color: "weak",
                    text: (
                        <>
                            <EyeOutline aria-label={t("aria.draft.preview")} />
                            &thinsp;
                            {t("labels.preview")}
                        </>
                    ),
                    onClick: previewDraft,
                },
            ]}
        >
            <List.Item
                prefix={
                    <Image
                        src={uid2path(coverUid)}
                        alt={t("cover")}
                        width="16vw"
                        className={styles.cover}
                        fit="contain"
                    />
                }
                arrow={<EditSOutline />}
                title={
                    <span
                        style={{
                            color: "var(--adm-color-text)",
                        }}
                    >
                        {title}
                    </span>
                }
                description={
                    <Space>
                        <Tag
                            color="default"
                            fill="outline"
                            aria-label={t("aria.creation-time")}
                        >
                            <AddCircleOutline />
                            &thinsp;
                            {timestampFormat(creation)}
                        </Tag>
                        <Tag
                            color="primary"
                            fill="outline"
                            aria-label={t("aria.modification-time")}
                        >
                            <EditFill />
                            &thinsp;
                            {timestampFormat(modification)}
                        </Tag>
                    </Space>
                }
                onClick={onClickCard}
            >
                <Ellipsis
                    direction="end"
                    expandText={t("expand")}
                    collapseText={t("collapse")}
                    content={content}
                />
            </List.Item>
        </SwipeAction>
    );
}
export default DraftCard;
