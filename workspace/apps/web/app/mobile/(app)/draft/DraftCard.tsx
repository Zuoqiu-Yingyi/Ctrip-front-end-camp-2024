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

import { useTranslation } from "react-i18next";
import {
    //
    Ellipsis,
    Image,
    List,
    Space,
    Tag,
} from "antd-mobile";
import {
    AddCircleOutline,
    //
    EditFill,
    EditSOutline,
} from "antd-mobile-icons";

import styles from "./page.module.scss";
import { uid2path } from "@/utils/image";
import { TTimestamp_ISO_8601 } from "@/types/response";
import { timestampFormat } from "@/utils/time";

export function DraftCard({
    //
    coverUid,
    title,
    content,
    creation,
    modification,
    onClick,
}: {
    coverUid: string;
    title: string;
    content: string;
    creation: TTimestamp_ISO_8601;
    modification: TTimestamp_ISO_8601;
    onClick: (uid: string) => void;
}) {
    const { t } = useTranslation();

    return (
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
            title={title}
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
        >
            <Ellipsis
                direction="end"
                expandText={t("expand")}
                collapseText={t("collapse")}
                content={content}
            />
        </List.Item>
    );
}
export default DraftCard;
