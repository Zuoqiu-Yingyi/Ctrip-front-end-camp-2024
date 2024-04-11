// Copyright 2024 lyt
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use client";
import React, { useRef, useEffect, useState } from "react";
import { Avatar } from "antd-mobile";
import styles from "./page.module.scss";
import Image from "next/image";
import { assetsLoader } from "../../utils/image";
/**
 * Functional component for rendering card content.
 *
 * This component renders content for a card including an image, a title, and user information.
 * The height of the card is calculated based on the image height plus 57px.
 *
 * @param imageUrl The URL of the image to be displayed.
 * @param title The title of the card.
 * @param username The username associated with the card.
 * @param avatarUrl The URL of the avatar image.
 * @param cardRefs Refs for tracking the height of each card.
 * @param handleSetGridRowEnd Function to handle setting the grid row end for the card.
 */

const CardContent = ({ imageUrl, title, username, avatarUrl, cardRefs, handleSetGridRowEnd }: { imageUrl: string; title: string; username: string; avatarUrl: string; cardRefs: React.RefObject<HTMLDivElement>[]; handleSetGridRowEnd: (index: number, height: number) => void }) => {
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
            cardRefs.current.push({ ref: contentRef, height });
        }
    }, [cardRefs, height]);

    useEffect(() => {
        const index = cardRefs.current.findIndex(({ ref }) => ref.current === contentRef.current);
        if (index !== -1 && height !== null) {
            handleSetGridRowEnd(index, height);
        }
    }, [handleSetGridRowEnd, height]);

    return (
        <div
            ref={contentRef}
            className={styles.cardcontainer}
            style={{ gridRowEnd: height ? `span ${Math.ceil(height)}` : "auto" }}
        >
            <div className={styles.imgcontainer}>
                <Image
                    src={imageUrl}
                    loader={assetsLoader}
                    alt="Image"
                    className={styles.image}
                    fill={true}
                />
            </div>

            <h4 className={styles.cardtitle}>{title}</h4>
            <div className={styles.carduser}>
                <Avatar
                    src={avatarUrl}
                    style={{ "--size": "20px", "--border-radius": "50%" }}
                    fallback={true}
                />
                <p className={styles.cardusername}>{username}</p>
            </div>
        </div>
    );
};

export default CardContent;
// const CardContent = ({ imageUrl, title, username, avatarUrl, cardRefs, handleSetGridRowEnd }: { imageUrl: string; title: string; username: string; avatarUrl: string; cardRefs: React.RefObject<HTMLDivElement>[]; handleSetGridRowEnd: (index: number, height: number) => void }) => {
//     const contentRef = useRef<HTMLDivElement>(null);
//     const [height, setHeight] = useState<number | null>(null);

//     useEffect(() => {
//         const calculateHeight = () => {
//             if (contentRef.current) {
//                 const image = new Image();
//                 image.src = imageUrl;
//                 image.onload = () => {
//                     const imageHeight = image.height;
//                     const totalHeight = imageHeight + 57;
//                     setHeight(totalHeight);
//                 };
//             }
//         };

//         calculateHeight();

//         window.addEventListener("resize", calculateHeight);
//         return () => {
//             window.removeEventListener("resize", calculateHeight);
//         };
//     }, [imageUrl]);

//     useEffect(() => {
//         if (contentRef.current && height !== null) {
//             cardRefs.current.push({ ref: contentRef, height });
//         }
//     }, [cardRefs, height]);

//     useEffect(() => {
//         const index = cardRefs.current.findIndex(({ ref }) => ref.current === contentRef.current);
//         if (index !== -1 && height !== null) {
//             handleSetGridRowEnd(index, height);
//         }
//     }, [handleSetGridRowEnd, height]);

//     return (
//         <div
//             ref={contentRef}
//             className={styles.cardcontainer}
//             style={{ gridRowEnd: height ? `span ${Math.ceil(height)}` : "auto" }}
//         >
//             <div>
//                 <Image
//                     src={imageUrl}
//                     loader={assetsLoader}
//                     alt="Image"
//                     className={styles.image}
//                 />
//                 <h4 className={styles.cardtitle}>{title}</h4>
//                 <div className={styles.carduser}>
//                     <Avatar
//                         src={avatarUrl}
//                         style={{ "--size": "20px", "--border-radius": "50%" }}
//                         fallback={true}
//                     />
//                     <p className={styles.cardusername}>{username}</p>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CardContent;
