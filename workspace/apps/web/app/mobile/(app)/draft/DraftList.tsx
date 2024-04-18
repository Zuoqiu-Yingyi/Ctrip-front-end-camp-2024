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
    useState,
    useContext,
    useEffect,
} from "react";
import {
    //
    InfiniteScroll,
    Footer,
    DotLoading,
    Collapse,
    Dialog,
} from "antd-mobile";
import { useTranslation } from "react-i18next";

import { useStore } from "@/contexts/store";
import { ClientContext } from "@/contexts/client";
import PullRefresh from "@/mobile/components/PullRefresh";

import DraftCard from "./DraftCard";
import DraftCardTitle from "./DraftCardTitle";

import {
    //
    handleError,
    handleResponse,
} from "@/utils/message";
import type { IDraft } from "@/types/response";

export function InfiniteScrollDirect({ hasMore }: { hasMore?: boolean }) {
    const { t } = useTranslation();

    return (
        <Footer
            label={
                hasMore ? (
                    <>
                        {t("loading")}
                        <DotLoading />
                    </>
                ) : (
                    t("empty.description")
                )
            }
        />
    );
}

export function DraftList({
    //
    searchInput,
}: {
    searchInput: string;
}): JSX.Element {
    const { t } = useTranslation();
    const { trpc } = useContext(ClientContext);
    const {
        //
        user,
        drafts,
        setDrafts,
    } = useStore.getState();

    const [data, setData] = useState<IDraft[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [reload, setReload] = useState(true);
    const [cursor, setCursor] = useState<number>(0);

    const count = 16; // 一次动态加载数量

    useEffect(() => {
        // console.debug(searchInput);

        if (searchInput) {
            /* 搜索功能 */
            setHasMore(false);
            const keyword = searchInput.trim().toLocaleLowerCase();
            setData(drafts.filter((draft) => draft.title.toLocaleLowerCase().includes(keyword)));
        } else {
            setCursor(0);
            setHasMore(true);
        }
    }, [searchInput]);

    /**
     * 加载更多草稿
     */
    async function loadMore() {
        // console.debug("loadMore");
        setHasMore(false);

        /* 将数据加载至 store */
        if (reload) {
            try {
                setReload(false);

                const response = await trpc.draft.list.query({});
                handleResponse(response);
                const _drafts: IDraft[] = (response.data?.drafts as any[]) || [];
                setDrafts(_drafts);
            } catch (error) {
                handleError(error);
            }
        }

        /* 从 store 加载内容 */
        if (cursor > drafts.length) {
            setHasMore(false);
        } else {
            const end = cursor + count;
            const _data = drafts.slice(0, end);
            setData(_data);
            setCursor(end);
            setHasMore(true);
        }
    }

    /**
     * 重新加载草稿列表
     */
    async function refresh() {
        // console.debug("refresh");

        setReload(true);
        setCursor(0);
        await loadMore();
    }

    /**
     * 删除草稿
     */
    async function deleteDraft(id: number, title: string) {
        try {
            /* 二次确认 */
            const confirm1 = await new Promise<boolean>((resolve) => {
                // REF: https://mobile.ant.design/zh/components/dialog#dialogshow
                const handler = Dialog.show({
                    title: t("actions.delete-draft.actions.confirm1.title"),
                    content: (
                        <>
                            {t("actions.delete-draft.actions.confirm1.content", { title })}
                            <br />
                            {t("actions.delete-draft.actions.confirm1.content1", { title })}
                        </>
                    ),
                    actions: [
                        [
                            {
                                key: "cancel",
                                text: t("cancel"),
                                onClick: () => {
                                    handler.close();
                                    resolve(false);
                                },
                            },
                            {
                                key: "delete",
                                text: t("delete"),
                                onClick: () => {
                                    handler.close();
                                    resolve(true);
                                },
                                bold: true,
                                danger: true,
                            },
                        ],
                    ],
                });
            });
            if (!confirm1) {
                return;
            }

            const response = await trpc.draft.delete.mutate({ ids: [id] });
            handleResponse(response);
            const _drafts: IDraft[] = (response.data?.drafts as any[]) || [];
            const ids = _drafts.map((draft) => draft.id);
            setDrafts(drafts.filter((draft) => !(draft.id in ids)));
        } catch (error) {
            handleError(error);
        }
    }

    return (
        <PullRefresh onRefresh={refresh}>
            <Collapse>
                {data.map((draft) => (
                    <Collapse.Panel
                        key={String(draft.id)}
                        title={
                            <DraftCardTitle
                                title={draft.title}
                                status={draft.status}
                                published={!!draft.publish}
                            />
                        }
                    >
                        <DraftCard
                            key={draft.id}
                            id={draft.id}
                            coverUid={draft.assets.at(0)!.asset_uid}
                            title={draft.title}
                            content={draft.content}
                            creation={draft.creation_time}
                            modification={draft.modification_time}
                            onDelete={deleteDraft}
                        />
                    </Collapse.Panel>
                ))}
            </Collapse>
            <InfiniteScroll
                loadMore={loadMore}
                hasMore={hasMore}
            >
                <InfiniteScrollDirect hasMore={hasMore} />
            </InfiniteScroll>
        </PullRefresh>
    );
}
export default DraftList;
