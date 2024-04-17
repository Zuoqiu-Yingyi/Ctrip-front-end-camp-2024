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
    Suspense,
    useEffect,
    useState,
    useContext,
} from "react";
import Image from "next/image";
import {
    //
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useTranslation } from "react-i18next";
import {
    //
    NavBar,
    Space,
    Swiper,
    Toast,
    Skeleton,
    Avatar,
} from "antd-mobile";
import {
    //
    SendOutline,
} from "antd-mobile-icons";

import styles from "./page.module.scss";
import { ClientContext } from "@/contexts/client";
import { assetsLoader, uid2path } from "@/utils/image";
import { DetailType } from "@/utils/search-params";

import type {
    //
    IDraft,
    IPublish,
    IReview,
} from "@/types/response";

// REF: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export function Detail() {
    const { t } = useTranslation();
    const { trpc } = useContext(ClientContext);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [loading, setLoading] = useState<boolean>(true);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [data, setData] = useState<IPublish | undefined>();
    // const [data, setData] = useState<IDraft | IReview | IPublish | undefined>();

    // TODO: 若为草稿, 查看审批列表
    // TODO: 若为草稿, 查看已发布的内容

    useEffect(() => {
        const id = parseInt(searchParams.get("id")!); // 草稿/审核
        const uid = searchParams.get("uid"); // 发布内容
        const detail_type = searchParams.get("type") as DetailType | null; // 类型

        if (uid) {
            (async () => {
                try {
                    const response = await trpc.publish.list.query({
                        uids: [uid],
                    });
                    if (response.code !== 0) {
                        throw new Error(response.message);
                    }
                    const publishs = (response.data?.publishs as unknown as IPublish[]) || [];
                    if (publishs.length > 0) {
                        setData(publishs.at(0));
                        setLoading(false);
                        setLoaded(true);
                    } else {
                        throw new Error("Not found");
                    }
                } catch (error) {
                    console.warn(error);
                    // REF: https://mobile.ant.design/zh/components/toast
                    Toast.show({
                        icon: "fail",
                        content: String(error),
                    });
                    setLoading(false);
                    setLoaded(false);
                }
            })();
        } else if (id) {
            switch (detail_type) {
                default:
                case DetailType.DRAFT:
                    // TODO: 加载草稿内容
                    break;
                case DetailType.REVIEW:
                    // TODO: 加载审核内容
                    break;
                case DetailType.PUBLISH:
                    // TODO: 参数错误
                    break;
            }
        }
    }, [searchParams]);

    function onNavBarBack() {
        router.back();
    }

    return (
        <>
            <div className={styles.navbar}>
                <NavBar
                    onBack={onNavBarBack}
                    right={
                        <div style={{ fontSize: 24 }}>
                            <Space style={{ "--gap": "16px" }}>
                                <SendOutline />
                            </Space>
                        </div>
                    }
                    left={
                        loaded ? (
                            <Avatar
                                src={data?.publisher.profile.avatar ? uid2path(data.publisher.profile.avatar) : ""}
                                alt={t("avatar")}
                                style={{ "--size": "32px", "--border-radius": "50%" }}
                            />
                        ) : undefined
                    }
                >
                    {loaded ? <span aria-label={t("username")}>{data?.publisher.name}</span> : <Skeleton.Title animated={loading} />}
                </NavBar>
            </div>
            {loaded ? (
                <>
                    <div className={styles.swiper_container}>
                        {/* REF: https://mobile.ant.design/zh/components/swiper/ */}
                        <Swiper className={styles.swiper}>
                            {data?.assets.map((asset: { asset_uid: string }) => (
                                <Swiper.Item>
                                    <Image
                                        src={asset.asset_uid}
                                        loader={assetsLoader}
                                        alt="Asset"
                                        fill={true}
                                    />
                                </Swiper.Item>
                            ))}
                        </Swiper>
                    </div>
                    <h2
                        className={styles.card_title}
                        aria-label={t("title")}
                    >
                        {data?.title}
                    </h2>
                    <p aria-label={t("content")}>{data?.content}</p>
                    <div className={styles.card_time}>
                        <p>
                            {t("publish-time")}: {data?.publication_time}
                        </p>
                        <p>
                            {t("update-time")}: {data?.modification_time}
                        </p>
                    </div>
                </>
            ) : (
                <>
                    {/* REF: https://mobile.ant.design/zh/components/skeleton/skeleton */}
                    <Skeleton
                        className={styles.swiper_skeleton}
                        animated={loading}
                    />
                    <Skeleton.Title animated={loading} />
                    <Skeleton.Paragraph
                        lineCount={5}
                        animated={loading}
                    />
                </>
            )}
        </>
    );
}

export function DetailPage() {
    return (
        <Suspense>
            <Detail />
        </Suspense>
    );
}
export default DetailPage;
