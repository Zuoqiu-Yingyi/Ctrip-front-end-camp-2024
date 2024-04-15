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
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { Avatar } from "antd-mobile";

import styles from "./page.module.scss";
import {
    //
    uid2path,
    assetsLoader,
} from "@/utils/image";

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
 * @param onClick Function to handle clicking on the card.
 */

export function CardContent({
    //
    uid,
    coverUid,
    title,
    avatar,
    username,
    cardRefs,
    handleSetGridRowEnd,
    onClick,
}: {
    uid: string;
    coverUid?: string;
    title: string;
    avatar: string;
    username: string;
    cardRefs: React.MutableRefObject<HTMLDivElement[]>;
    handleSetGridRowEnd: (index: number) => void;
    onClick: (uid: string) => void;
}): JSX.Element {
    const { t } = useTranslation();
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

    return (
        <div
            ref={contentRef}
            onClick={() => onClick(uid)}
            className={styles.card_container}
            style={{ gridRowEnd: height ? `span ${Math.ceil(height)}` : "auto" }}
            aria-role="button"
            aria-label={t("aria.card")}
        >
            {coverUid && (
                <div className={styles.img_container}>
                    <Image
                        src={coverUid}
                        loader={assetsLoader}
                        alt={t("cover")}
                        className={styles.image}
                        fill={true}
                    />
                </div>
            )}

            <h3
                className={styles.card_title}
                aria-label={t("title")}
            >
                {title}
            </h3>
            <div
                className={styles.card_user}
                aria-label={t("profile")}
            >
                <Avatar
                    src={uid2path(avatar)}
                    alt={t("avatar")}
                    style={{ "--size": "20px", "--border-radius": "50%" }}
                />
                <p
                    className={styles.card_username}
                    aria-label={t("username")}
                >
                    {username}
                </p>
            </div>
        </div>
    );
}

export default CardContent;
