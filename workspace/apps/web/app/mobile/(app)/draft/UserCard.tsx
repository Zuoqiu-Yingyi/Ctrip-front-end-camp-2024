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
import React, { useRef, useEffect, useState, useContext } from "react";
import { Avatar, Button, Modal } from "antd-mobile";
import styles from "./page.module.scss";
import Image from "next/image";
import {
    //
    uid2path,
    assetsLoader,
} from "@/utils/image";
import { useTranslation } from "react-i18next";
import { StoreContext } from "@/providers/store";

const UserCard = ({ key, thisUid, coverUid, title, content, onClick }: { key: string; thisUid: string; coverUid: string; title: string; content: string; onClick: (uid: string) => void }) => {
    const { t, i18n } = useTranslation();

    return (
        <div className={styles.usercard}>
            <div className={styles.imagecontainer}>
                <Image
                    src={coverUid}
                    loader={assetsLoader}
                    alt={t("cover")}
                    className={styles.image}
                    fill={true}
                />
            </div>
            <div className={styles.wordcontainer}>
                <p className={styles.cardtitle}>{title}</p>
                <p className={styles.cardcontent}>{content}</p>
            </div>
        </div>
    );
};

export default UserCard;
