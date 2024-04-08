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

'use client'
import React, { useRef, useEffect,useState } from 'react';
import { InfiniteScroll, List, DotLoading,Card,Image,Avatar } from 'antd-mobile'
import { mockRequest } from './mock-request'
import styles from './page.module.scss'


/**
 * Functional component for rendering card content.
 * 
 * This component renders content for a card including an image, a title, and user information.
 * The height of the card is calculated based on the aspect ratio of the image and the container width.
 * 
 * @param imageUrl The URL of the image to be displayed.
 * @param title The title of the card.
 * @param username The username associated with the card.
 * @param avatarUrl The URL of the avatar image.
 * @param aspectRatio The aspect ratio of the image (height / width).
 * @param cardRefs Refs for tracking the height of each card.
 * @param handleSetGridRowEnd Function to handle setting the grid row end for the card.
 */
const CardContent = ({ imageUrl, title, username, avatarUrl, aspectRatio, cardRefs, handleSetGridRowEnd }: { imageUrl: string; title: string; username: string; avatarUrl: string; aspectRatio: number; cardRefs: React.RefObject<HTMLDivElement>[]; handleSetGridRowEnd: (index: number, height: number) => void }) => {
    const contentRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number | null>(null);

    useEffect(() => {
        const calculateHeight = () => {
            if (contentRef.current && aspectRatio) {
                const containerWidth = contentRef.current.offsetWidth;
                if (containerWidth && aspectRatio) {
                    // 计算图片部分的高度
                    const imageHeight = containerWidth * aspectRatio;
                    // 图片部分高度加上固定高度 57px
                    const totalHeight = imageHeight + 57;
                    setHeight(totalHeight);
                }
            }
        };

        calculateHeight();

        window.addEventListener("resize", calculateHeight);
        return () => {
            window.removeEventListener("resize", calculateHeight);
        };
    }, [aspectRatio]);

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
            <div>
                <img
                    src={imageUrl}
                    className={styles.image}
                    alt="Image"
                />
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
        </div>
    );
};


export default CardContent;