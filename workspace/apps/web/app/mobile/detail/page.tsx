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

import styles from "./page.module.scss";

import {
    //
    Suspense,
    useEffect,
    useState,
    useContext,
} from "react";
import {
    //
    useRouter,
    useSearchParams,
} from "next/navigation";
import { useTranslation } from "react-i18next";
import {
    //
    NavBar,
    Image,
    Space,
    Swiper,
    Toast,
    Skeleton,
    Avatar,
    Tag,
    ImageViewer,
    AutoCenter,
    Popover,
} from "antd-mobile";
import {
    //
    AddSquareOutline,
    EditFill,
    GlobalOutline,
    LinkOutline,
    SendOutline,
    UploadOutline,
} from "antd-mobile-icons";

import { ClientContext } from "@/contexts/client";
import { uid2path } from "@/utils/image";
import { DetailType } from "@/utils/search-params";

import {
    //
    type IDraft,
    type IPublish,
    type IReview,
    type TCuid,
} from "@/types/response";
import {
    //
    handleError,
    handleResponse,
} from "@/utils/message";
import { useStore } from "@/contexts/store";
import {
    //
    MobileContent,
    MobileFooter,
    MobileHeader,
} from "@/mobile/components/MobileLayout";
import { timestampFormat } from "@/utils/time";
import DraftStatusTag from "@/mobile/components/DraftStatusTag";
import TitleBarMenu from "@/mobile/components/TitleBarMenu";
import { copyText } from "@/utils/copy";

// REF: https://nextjs.org/docs/messages/missing-suspense-with-csr-bailout
export function Detail() {
    const { t } = useTranslation();
    const { trpc } = useContext(ClientContext);
    const {
        //
        mode,
        user,
    } = useStore.getState();

    const router = useRouter();
    const searchParams = useSearchParams();

    const [detailType, setDetailType] = useState<DetailType>(DetailType.PUBLISH);

    const [loading, setLoading] = useState<boolean>(true);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [swiperAutoPlay, setSwiperAutoPlay] = useState<boolean>(true);
    const [data, setData] = useState<IDraft | IReview | IPublish | undefined>();

    useEffect(() => {
        const uid = searchParams.get("uid"); // 发布内容

        const id = searchParams.get("id"); // 草稿/审核
        const detail_type = searchParams.get("type") as DetailType | null; // 类型

        if (uid) {
            queryPublish(uid);
            setDetailType(DetailType.PUBLISH);
        } else if (id) {
            const id_ = parseInt(id);
            switch (detail_type) {
                default:
                case DetailType.DRAFT:
                    // 加载草稿内容
                    queryDraft(id_);
                    setDetailType(DetailType.DRAFT);
                    break;
                case DetailType.REVIEW:
                    // 加载审核内容
                    queryReview(id_);
                    setDetailType(DetailType.REVIEW);
                    break;
                case DetailType.PUBLISH:
                    // 参数错误
                    Toast.show({
                        icon: "fail",
                        content: t("detail.errors.invalid-params"),
                    });
                    setLoading(false);
                    setLoaded(false);
                    break;
            }
        }
    }, [searchParams]);

    useEffect(() => {
        if (data) {
            globalThis.document.title = data.title;
        }
    }, [data]);

    /**
     * 查询发布内容
     */
    async function queryPublish(uid: TCuid) {
        try {
            const response = await trpc.publish.list.query({
                uids: [uid],
            });
            handleResponse(response);
            const publishs: IPublish[] = (response.data?.publishs as any[]) ?? [];
            if (publishs.length > 0) {
                setData(publishs.at(0));
                setLoading(false);
                setLoaded(true);
            }
        } catch (error) {
            handleError(error);
            setLoading(false);
            setLoaded(false);
        }
    }

    /**
     * 查询草稿内容
     */
    async function queryDraft(id: number) {
        try {
            const response = await trpc.draft.list.query({
                ids: [id],
            });
            handleResponse(response);
            const drafts: IDraft[] = (response.data?.drafts as any[]) ?? [];
            if (drafts.length > 0) {
                setData(drafts.at(0));
                setLoading(false);
                setLoaded(true);
            }
        } catch (error) {
            handleError(error);
            setLoading(false);
            setLoaded(false);
        }
    }

    /**
     * 查询审批内容
     */
    async function queryReview(id: number) {
        try {
            const response = await trpc.review.list.query({
                ids: [id],
            });
            handleResponse(response);
            const reviews: IDraft[] = (response.data?.reviews as any[]) ?? [];
            if (reviews.length > 0) {
                setData(reviews.at(0));
                setLoading(false);
                setLoaded(true);
            }
        } catch (error) {
            handleError(error);
            setLoading(false);
            setLoaded(false);
        }
    }

    function onNavBarBack() {
        router.back();
    }

    const avatar_src = (() => {
        if (data) {
            if ("publisher" in data) {
                return data.publisher.profile.avatar ? uid2path(data.publisher.profile.avatar) : "";
            } else if ("submitter" in data) {
                return data.submitter.profile.avatar ? uid2path(data.submitter.profile.avatar) : "";
            } else {
                return user.avatar ? uid2path(user.avatar) : "";
            }
        }
        return "";
    })();

    const username = (() => {
        if (data) {
            if ("publisher" in data) {
                return data.publisher.name;
            } else if ("submitter" in data) {
                return data.submitter.name;
            } else {
                return user.name ?? "";
            }
        }
        return "";
    })();

    const assets_src: string[] = (() => {
        if (data) {
            return data.assets.map((asset) => uid2path(asset.asset_uid));
        }
        return [];
    })();

    const hyperlink = globalThis.location?.href;
    const title_link = data?.title && hyperlink ? `${data?.title}\n${hyperlink}` : hyperlink;
    const share_data = {
        title: data?.title,
        text: data?.content,
        url: hyperlink,
    };

    return (
        <>
            <MobileHeader>
                <NavBar
                    onBack={onNavBarBack}
                    right={
                        <TitleBarMenu>
                            <Popover.Menu
                                actions={[
                                    {
                                        icon: <SendOutline />,
                                        text: t("labels.share-to"),
                                        disabled: !globalThis.navigator.canShare?.(share_data),
                                        onClick: async () => {
                                            // REF: https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/share
                                            if (globalThis.navigator?.canShare?.(share_data)) {
                                                await globalThis.navigator.share(share_data);
                                                Toast.show({
                                                    icon: "success",
                                                    content: t("actions.share.to-other.prompt.content"),
                                                });
                                            }
                                        },
                                    },
                                    {
                                        icon: <LinkOutline />,
                                        text: t("labels.copy-link"),
                                        disabled: !hyperlink,
                                        onClick: async () => {
                                            await copyText(hyperlink);
                                            Toast.show({
                                                icon: "success",
                                                content: t("actions.share.copy-link.prompt.content"),
                                            });
                                        },
                                    },
                                    {
                                        icon: <GlobalOutline />,
                                        text: t("labels.copy-title-link"),
                                        disabled: !title_link,
                                        onClick: async () => {
                                            await copyText(title_link);
                                            Toast.show({
                                                icon: "success",
                                                content: t("actions.share.copy-title-link.prompt.content"),
                                            });
                                        },
                                    },
                                ]}
                                mode={mode}
                                trigger="click"
                                placement="bottom-end"
                            >
                                <SendOutline aria-label={t("aria.share")} />
                            </Popover.Menu>
                        </TitleBarMenu>
                    }
                    left={
                        loaded ? (
                            <Avatar
                                src={avatar_src}
                                alt={t("avatar")}
                                style={{ "--size": "32px", "--border-radius": "50%" }}
                            />
                        ) : undefined
                    }
                >
                    {loaded ? <span aria-label={t("username")}>{username}</span> : <Skeleton.Title animated={loading} />}
                </NavBar>
            </MobileHeader>
            <MobileContent>
                {loaded ? (
                    <>
                        <div className={styles.swiper_container}>
                            {/* REF: https://mobile.ant.design/zh/components/swiper/ */}
                            <Swiper
                                className={styles.swiper}
                                autoplay={swiperAutoPlay}
                                loop
                            >
                                {data?.assets.map((asset: { asset_uid: string }, index, assets) => (
                                    <Swiper.Item
                                        key={asset.asset_uid}
                                        onClick={() => {
                                            setSwiperAutoPlay(false);
                                            // REF: https://mobile.ant.design/zh/components/image-viewer/
                                            ImageViewer.Multi.show({
                                                images: assets_src,
                                                defaultIndex: index,
                                                renderFooter: (_image, index) => <AutoCenter>{`${index + 1} / ${assets.length}`}</AutoCenter>,
                                                onClose: () => {
                                                    setSwiperAutoPlay(true);
                                                },
                                            });
                                        }}
                                    >
                                        <Image
                                            src={uid2path(asset.asset_uid)}
                                            fit="contain"
                                            height="50vh"
                                            alt={t("photograph")}
                                        />
                                    </Swiper.Item>
                                ))}
                            </Swiper>
                        </div>
                        <article>
                            <h4
                                className={styles.card_title}
                                aria-label={t("title")}
                            >
                                {data?.title}
                            </h4>
                            <section
                                className={styles.card_content}
                                aria-label={t("content")}
                            >
                                {data?.content.split(/[\n]{2,}/).map((paragraph, index) => {
                                    return (
                                        <p key={index}>
                                            {paragraph.split(/[\n]+/).map((line, index) => {
                                                return (
                                                    <span key={index}>
                                                        {line}
                                                        <br />
                                                    </span>
                                                );
                                            })}
                                        </p>
                                    );
                                })}
                            </section>
                        </article>
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
            </MobileContent>
            <MobileFooter>
                {loaded ? (
                    <Space
                        className={styles.card_footer}
                        align="baseline"
                    >
                        {data && "creation_time" in data && (
                            <Tag
                                color="default"
                                fill="outline"
                                aria-label={t("aria.creation-time")}
                            >
                                <AddSquareOutline />
                                &thinsp;
                                {timestampFormat(data.creation_time)}
                            </Tag>
                        )}
                        {data && "submission_time" in data && (
                            <Tag
                                color="default"
                                fill="outline"
                                aria-label={t("aria.submission-time")}
                            >
                                <UploadOutline />
                                &thinsp;
                                {timestampFormat(data.submission_time)}
                            </Tag>
                        )}
                        {data && "publication_time" in data && (
                            <Tag
                                color="default"
                                fill="outline"
                                aria-label={t("aria.publication-time")}
                            >
                                <UploadOutline />
                                &thinsp;
                                {timestampFormat(data.publication_time)}
                            </Tag>
                        )}
                        {data && (
                            <Tag
                                color="primary"
                                fill="outline"
                                aria-label={t("aria.modification-time")}
                            >
                                <EditFill />
                                &thinsp;
                                {timestampFormat(data.modification_time)}
                            </Tag>
                        )}
                        {data && "status" in data && <DraftStatusTag status={data.status} />}
                    </Space>
                ) : (
                    <Skeleton.Paragraph
                        animated={loading}
                        lineCount={1}
                    />
                )}
            </MobileFooter>
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
