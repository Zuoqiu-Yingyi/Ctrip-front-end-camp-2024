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
import { Avatar, Button } from "antd-mobile";
import styles from "./page.module.scss";
import Image from "next/image";
import { assetsLoader } from "../../utils/image";

const UserCard = ({ imageUrl, title, username, content }: { imageUrl: string; title: string; username: string; content: string }) => {
    return (
        <div className={styles.usercard}>
            <div className={styles.imagecontainer}>
                <Image
                    src={imageUrl}
                    loader={assetsLoader}
                    alt="Image"
                    className={styles.image}
                    fill={true}
                />
            </div>
            <div className={styles.wordcontainer}>
                <p className={styles.cardtitle}>{title}</p>
                <p className={styles.cardcontent}>{content}</p>
            </div>

            <div className={styles.buttoncontainer}>
                <Button
                    color="primary"
                    fill="solid"
                    className={styles.button}
                >
                    显示审核状态
                </Button>
                <Button
                    color="primary"
                    fill="solid"
                    className={styles.button}
                >
                    删除
                </Button>
                <Button
                    color="primary"
                    fill="solid"
                    className={styles.button}
                >
                    编辑
                </Button>
            </div>
        </div>
    );
};

export default UserCard;
