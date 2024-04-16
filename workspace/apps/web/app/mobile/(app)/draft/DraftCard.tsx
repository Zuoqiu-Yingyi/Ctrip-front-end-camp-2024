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
import {
    //
    useRef,
    useEffect,
    useState,
    useContext,
} from "react";
import Image from "next/image";
import {
    //
    Avatar,
    Button,
    Modal,
} from "antd-mobile";
import { useTranslation } from "react-i18next";

import styles from "./page.module.scss";
import { assetsLoader } from "@/utils/image";

export function DraftCard({
    //
    coverUid,
    title,
    content,
    onClick,
}: {
    coverUid: string;
    title: string;
    content: string;
    onClick: (uid: string) => void;
}) {
    const { t } = useTranslation();

    return (
        <div className={styles.draft_card}>
            <div className={styles.image_container}>
                <Image
                    src={coverUid}
                    loader={assetsLoader}
                    alt={t("cover")}
                    className={styles.image}
                    fill={true}
                />
            </div>
            <div className={styles.card_text_container}>
                <h4 className={styles.card_title}>{title}</h4>
                <p className={styles.card_content}>{content}</p>
            </div>
        </div>
    );
}
export default DraftCard;
