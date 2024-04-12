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

// InfiniteScrollContent.tsx

"use client";

import React, { useRef, useEffect, useState, useContext } from "react";
import { Button, AutoCenter, InfiniteScroll, ErrorBlock, Avatar, DotLoading, Toast } from "antd-mobile";
import { useTranslation } from "react-i18next";
import styles from "./page.module.scss";
import UserCard from "./UserCard";
import { StoreContext } from "@/providers/store";

const InfiniteContent = ({ hasMore }: { hasMore?: boolean }) => {
    const { t, i18n } = useTranslation();

    return (
        <>
            {hasMore ? (
                <AutoCenter>
                    <span>{t("loading")}</span>
                    <DotLoading />
                </AutoCenter>
            ) : (
                <ErrorBlock
                    status="empty"
                    title={t("empty.description")}
                />
            )}
        </>
    );
};

export function UserContent({
    //
    userUid,
    onCardClick,
}: {
    userUid: string;
    onCardClick: (uid: string) => void;
}): JSX.Element {
    const { t, i18n } = useTranslation();
    const { trpc } = useContext(StoreContext);
    const cardRefs = useRef<HTMLDivElement[]>([]);
    const [data, setData] = useState<any[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [cursor, setCursor] = useState<string | undefined>();

    setCursor(undefined);
    setData([]);
    setHasMore(true);

    async function loadMore() {
        // console.debug("loadMore");
        try {
            // console.debug(cursor);
            const response = await trpc.draft.paging.query({
                skip: cursor ? 1 : 0,
                take:10,
                // cursor
            });
            // const response = await trpc.publish.paging.query({
            //     skip: cursor ? 1 : 0,
            //     cursor,
            // });
            if (response.code !== 0) {
                throw new Error(response.message);
            }
            const drafts = response.data?.drafts || [];
            // console.debug(publishs);
            if (drafts.length > 0) {
                setHasMore(true);
                setData((val) => [...val, ...drafts]);
                setCursor(drafts.at(-1)!.uid as unknown as string);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.warn(error);
            // REF: https://mobile.ant.design/zh/components/toast
            Toast.show({
                icon: "fail",
                content: String(error),
            });
            setHasMore(false);
        }
    }

    return (
        <>
            <div className={styles.usertitle}>
                <div className={styles.usermessage}>
                    <p className={styles.username}>{data[0].publisher.name}</p>
                    <p className={styles.userid}>{data[0].author_id}</p>
                </div>
                <Button className={styles.editbutton}>{t("edit information")}</Button>
            </div>
            <div className={styles.container4}>
                {data.map((draft) => (
                    <UserCard
                        key={draft.uid}
                        thisUid={draft.uid}
                        coverUid={draft.assets.at(0)?.asset_uid}
                        title={draft.title}
                        content={draft.content}
                        onClick={onCardClick}
                    />
                ))}
                <InfiniteScroll
                    loadMore={loadMore}
                    hasMore={hasMore}
                >
                    <InfiniteContent hasMore={hasMore} />
                </InfiniteScroll>
            </div>
        </>
    );
}
export default UserContent;
