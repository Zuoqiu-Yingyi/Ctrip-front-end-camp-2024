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

// use client
"use client";
import React from "react";
import { NavBar, Toast, Swiper, Avatar } from "antd-mobile";
import styles from "./page.module.scss";
import trpc from "../../utils/trpc";

import Image from "next/image";
import { assetsLoader } from "../../utils/image";

// 调用 listQuery 的函数
const uid = "1234567890";
const thisPublish = await trpc.publish.list.query({ uids: [uid] });
try {
    trpc.publish.list.query({ uids: [uid] });
} catch (error) {
    alert("Error");
}

// console.log(thisPublish.data.publishs[0].publish_id);
if (thisPublish.code !== 0) {
    alert("Error");
}
const assetsThis = thisPublish.data?.publishs[0]!.assets;

const items = assetsThis!.map((asset) => (
    <Swiper.Item>
        <li key={asset.asset_uid}>
            <Image
                src={asset.asset_uid}
                loader={assetsLoader}
                alt="Asset"
                fill={true}
            />
        </li>
    </Swiper.Item>
));

const left = (
    <div className={styles.carduser}>
        <Avatar
            src=""
            style={{ "--size": "20px", "--border-radius": "50%" }}
            fallback={true}
        />
        <p className={styles.cardusername}>{thisPublish.data?.publishs[0]!.draft!.author_id}</p>
    </div>
);
export default function HomePage() {
    const back = () =>
        Toast.show({
            content: "点击了返回区域",
            duration: 1000,
        });

    return (
        <div style={{ width: "100%", margin: "0 auto", height: "100%" }}>
            <div className={styles.container1}>
                <NavBar
                    onBack={back}
                    left={left}
                ></NavBar>
            </div>
            <div className={styles.container2}>
                <Swiper className={styles.swiper}>{items}</Swiper>
            </div>
            <h4 className={styles.cardtitle}>{thisPublish.data?.publishs[0]!.draft!.title}</h4>
            <p>{thisPublish?.data.publishs[0]!.draft!.content}</p>
            <div className={styles.cardtime}>
                <p>{thisPublish?.data.publishs[0]!.draft!.creation_time}</p>
            </div>
        </div>
    );
}
