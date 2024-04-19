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
} from "react";
import { useRouter } from "next/navigation";

import { useTranslation } from "react-i18next";
// import Image from "next/image";
import {
    //
    Avatar,
    Ellipsis,
    Image,
} from "antd-mobile";

import styles from "./page.module.scss";
import {
    //
    uid2path,
    assetsLoader,
} from "@/utils/image";
import { PATHNAME } from "@/utils/pathname";

/**
 * Functional component for rendering card content.
 *
 * This component renders content for a card including an image, a title, and user information.
 * The height of the card is calculated based on the image height plus 57px.
 *
 * @param uid The uid of the card.
 * @param coverUid The uid of the cover to be displayed.
 * @param title The title of the card.
 * @param avatar The URL of the avatar image.
 * @param username The username associated with the card.
 * @param cardRefs Refs for tracking the height of each card.
 * @param handleSetGridRowEnd Function to handle setting the grid row end for the card.
 */

export function PublishCard({
    //
    uid,
    coverUid,
    title,
    avatar,
    username,
    cardRefs,
    handleSetGridRowEnd,
}: {
    uid: string;
    coverUid: string | null;
    title: string;
    avatar: string | null;
    username: string;
    cardRefs: React.MutableRefObject<HTMLDivElement[]>;
    handleSetGridRowEnd: (index: number) => void;
}): JSX.Element {
    const { t } = useTranslation();
    const router = useRouter();

    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | null>(null);

    useEffect(() => {
        const calculateHeight = () => {
            if (contentRef.current) {
                const imageElement = contentRef.current.querySelector("img");
                if (imageElement) {
                    setHeight(imageElement.offsetHeight + 57);
                }
            }
        };

        calculateHeight();

        window.addEventListener("resize", calculateHeight);
        return () => {
            window.removeEventListener("resize", calculateHeight);
        };
    }, []);

    useEffect(() => {
        if (contentRef.current && height !== null) {
            cardRefs.current?.push(contentRef.current);
        }
    }, [cardRefs, height]);

    useEffect(() => {
        const index = cardRefs.current?.findIndex((element) => element === contentRef.current);
        if (index !== -1 && height !== null) {
            handleSetGridRowEnd(index);
        }
    }, [handleSetGridRowEnd, height]);

    /**
     * 点击卡片
     */
    function onClickCard(uid: string) {
        const searchParams = new URLSearchParams();
        searchParams.set("uid", uid);
        router.push(`${PATHNAME.mobile.detail}?${searchParams.toString()}`);
    }

    return (
        <div
            ref={contentRef}
            className={styles.card}
            style={{ gridRowEnd: height ? `span ${Math.ceil(height)}` : "auto" }}
            aria-label={t("aria.card")}
            onClick={() => onClickCard(uid)}
        >
            {coverUid && (
                <Image
                    src={uid2path(coverUid)}
                    alt={t("cover")}
                    fit="contain"
                    className={styles.image}
                />
            )}

            <Ellipsis
                className={styles.card_title}
                direction="end"
                content={title}
                aria-label={t("title")}
            />
            <div
                className={styles.card_user}
                aria-label={t("profile")}
            >
                <Avatar
                    src={avatar ? uid2path(avatar) : ""}
                    alt={t("avatar")}
                    style={{ "--size": "20px", "--border-radius": "50%" }}
                />
                <span
                    className={styles.card_username}
                    aria-label={t("username")}
                >
                    {username}
                </span>
            </div>
        </div>
    );
}

export default PublishCard;
