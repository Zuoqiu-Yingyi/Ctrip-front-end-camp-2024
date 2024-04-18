/**
 * Copyright (C) 2024 wu
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

import { createContext, useContext, useRef, useState } from "react";
import { TravelNote, ManageData, ManagePage, ManagePageNumber } from "../types/definitions";
import { getReviewCount, operateSingleReview, getReviews } from "../utils/review";
import { ClientContext } from "./client";

export const MessageContext = createContext<{
    totalDataNumber: ManagePageNumber;
    loading: boolean;
    onSearch: boolean;
    checkedNumber: number;
    displayItems: TravelNote[];
    pageState: TravelNote["state"];
    addCheckSet: Function;
    subCheckSet: Function;
    firstPullData: Function;
    togglePage: Function;
    operateReview: Function;
    operateBatchReview: Function;
    togglePageState: Function;
    setPageState: Function;
    searchItem: Function;
    delTravelNote: Function;
}>({
    totalDataNumber: { success: 0, waiting: 0, fail: 0 },
    loading: true,
    checkedNumber: 0,
    displayItems: [],
    pageState: "waiting",
    onSearch: false,
    addCheckSet: () => {},
    subCheckSet: () => {},
    firstPullData: () => {},
    togglePage: () => {},
    operateReview: () => {},
    operateBatchReview: () => {},
    togglePageState: () => {},
    setPageState: () => {},
    searchItem: () => {},
    delTravelNote: () => {},
});

export default function MessageContextProvider({ children }: { children: React.ReactElement<any, any> }): JSX.Element {

    const { trpc } = useContext(ClientContext);

    const checkedSet = useRef<Set<number>>(new Set());

    const [checkedNumber, setCheckedNumber] = useState<number>(0);

    // 当前界面状态
    const [pageState, setPageState] = useState<TravelNote["state"]>("waiting");

    // 已加载全部数据
    const allItems = useRef<ManageData>({ success: [], waiting: [], fail: [] });

    // 最大渲染界面
    const maxReaderPage = useRef<ManagePageNumber>({ success: 0, waiting: 0, fail: 0 });

    // 预加载界面
    const preLoadedPages = useRef<ManagePage>({ success: new Set(), waiting: new Set(), fail: new Set() });

    // 已加载界面
    const loadedPages = useRef<ManagePage>({ success: new Set(), waiting: new Set(), fail: new Set() });

    // 数据总数
    const [totalDataNumber, setTotalDataNumber] = useState<ManagePageNumber>({ success: 0, waiting: 0, fail: 0 });

    // 界面呈现数据
    const [displayItems, setDisplayItems] = useState<TravelNote[]>(new Array(5).fill({}));

    // 界面是否等待
    const [loading, setLoading] = useState<boolean>(true);

    // 是否正在搜索
    const [onSearch, setOnSearch] = useState<boolean>(false);

    const searchNumber = useRef<number>(0);

    /**
     * 删除游记
     *
     * @remarks
     *
     * @param state - 状态
     */
    async function delTravelNote(id: number, uid: string) {
        console.debug(uid);

        console.debug("dddd");

        const response_delete1 = await trpc.publish.delete.mutate({ uids: [uid] });

        console.debug(response_delete1);

        await operateSingleItem(id, "success");
    }

    /**
     * 切换页面状态
     *
     * @remarks
     *
     * @param state - 状态
     */
    async function togglePageState(state: TravelNote["state"]) {
        setOnSearch(false);

        searchNumber.current += 1;

        if (allItems.current[state].length === 0) {
            await firstPullData(state);
        } else {
            changeDisplayItems(allItems.current[state]);
        }
    }

    /**
     * 搜索审核项
     *
     * @remarks
     *
     * @param state - 状态
     */
    async function searchItem(field: "title" | "content", searchWord: string) {
        setOnSearch(true);

        searchNumber.current += 1;

        let recordSearchNumber = searchNumber.current;

        let loadedSearchItems = allItems.current[pageState].filter((item) => item[field].includes(searchWord));

        changeDisplayItems(loadedSearchItems);

        // let allSearchItems = [...loadedSearchItems, ...(await mockRemoteSearch(3, pageState))];

        // let remoteSearchResult = await mockRemoteSearch(3, pageState);
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // let searchedResultSet = new Set(loadedSearchItems.map((value) => value.id));

        // remoteSearchResult.forEach((item) => {
        //     if (!searchedResultSet.has(item.id)) {
        //         loadedSearchItems.push(item);
        //     }
        // })

        if (recordSearchNumber === searchNumber.current) {
            changeDisplayItems([...loadedSearchItems]);

            setOnSearch(false);
        }
    }

    function changeDisplayItems(items: TravelNote[]) {
        setDisplayItems(
            items.map((item) => ({
                ...item,
                isChecked: checkedSet.current.has(item.id),
            })),
        );
    }

    /**
     * 增加批处理项
     *
     * @remarks
     *
     * @param id - 审核id
     */
    function addCheckSet(id: number) {
        checkedSet.current.add(id);

        setCheckedNumber(checkedNumber + 1);

        setDisplayItems(
            displayItems.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        isChecked: !item.isChecked,
                    };
                } else {
                    return item;
                }
            }),
        );
    }

    /**
     * 删除批处理项
     *
     * @remarks
     *
     * @param id - 审核id
     */
    function subCheckSet(id: number) {
        checkedSet.current.delete(id);

        setCheckedNumber(checkedNumber - 1);

        setDisplayItems(
            displayItems.map((item) => {
                if (item.id === id) {
                    return {
                        ...item,
                        isChecked: !item.isChecked,
                    };
                } else {
                    return item;
                }
            }),
        );
    }

    async function mendLoadedPages(changedTotlNum: number, state: TravelNote["state"]) {
        console.log(loadedPages.current[state]);

        for (let key of loadedPages.current[state].keys()) {
            await Promise.all(
                [0, 1, 2, 3, 4]
                    .map((index) => switchItemIndex(key, index, 5))
                    .filter((switchIndex) => switchIndex < changedTotlNum)
                    .map((switchIndex) => {
                        if (switchIndex >= allItems.current[state].length || JSON.stringify(allItems.current[state][switchIndex]) === "{}") {
                            return getReviews(switchIndex, 1, state, trpc).then((value) => {
                                allItems.current[state][switchIndex] = value[0];
                            });
                        }
                    }),
            );
        }
    }

    async function operateReview(id: number, operate: "pass" | "reject", rejectReason?: string) {
        if (operate === "pass") {
            await operateSingleReview(id, operate, trpc);
        } else {
            await operateSingleReview(id, operate, trpc, rejectReason);
        }

        await operateSingleItem(id, "waiting");
    }

    /**
     * 前端单个审核状态改变
     *
     * @remarks
     *
     * @param id - 审核id
     * @param state - 状态
     *
     */
    async function operateSingleItem(id: number, state: TravelNote["state"]) {
        let changedTotlNum = totalDataNumber[state] - 1;

        allItems.current[state] = allItems.current[state].filter((item) => item.id !== id);

        setTotalDataNumber({
            ...totalDataNumber,
            [state]: changedTotlNum,
        });

        setDisplayItems(allItems.current[state]);

        mendLoadedPages(changedTotlNum, state);
    }

    async function operateBatchReview(operate: "pass" | "reject", rejectReason?: string) {
        console.log(checkedSet.current);

        await Promise.all(
            [...checkedSet.current].map((id) => {
                if (operate === "pass") {
                    return operateSingleReview(id, operate, trpc);
                } else {
                    return operateSingleReview(id, operate, trpc, rejectReason);
                }
            }),
        );

        await operateBatchItem("waiting");
    }

    /**
     * 前端批量审核状态改变
     *
     * @remarks
     *
     * @param state - 状态
     *
     */
    async function operateBatchItem(state: TravelNote["state"]) {
        let changedTotlNum = totalDataNumber[state] - checkedNumber;

        allItems.current[state] = allItems.current[state].filter((item) => !checkedSet.current.has(item.id));

        setTotalDataNumber({
            ...totalDataNumber,
            [state]: changedTotlNum,
        });

        mendLoadedPages(changedTotlNum, state);

        setDisplayItems(allItems.current[state]);

        checkedSet.current.clear();

        setCheckedNumber(0);
    }

    /**
     * 首次获取数据，获取第一页页面，渲染界面，并异步加载后五页的内容
     *
     * @remarks
     *
     * @param state - 状态
     *
     */
    async function firstPullData(state: TravelNote["state"]) {
        // 获取待审核总数
        let allWaitingCount = (await getReviewCount(state, trpc)) as number;

        console.log(allWaitingCount);

        if (allWaitingCount > 0) {
            setLoading(true);

            allItems.current[state] = await getReviews(0, 5, state, trpc);

            console.log("loadedPages: ");

            console.log(loadedPages.current[state]);

            loadedPages.current[state].add(1);

            maxReaderPage.current[state] += 1;

            changeDisplayItems(allItems.current[state]);

            setLoading(false);

            for (let index = 0; index < Math.ceil(allWaitingCount / 5) - 1 && index < 1; index++) {
                allItems.current[state].push(...(await getReviews((index + 1) * 5, 5, state, trpc)));

                loadedPages.current[state].add(index + 2);

                maxReaderPage.current[state] += 1;

                setTotalDataNumber({
                    ...totalDataNumber,
                    [state]: allItems.current[state].length,
                });
            }
        } else {
            changeDisplayItems(allItems.current[state]);
        }

        setTotalDataNumber({
            ...totalDataNumber,
            [state]: allWaitingCount,
        });

        console.log("allItems.current: ");

        console.log(allItems.current[state]);
    }

    /**
     * 加载页面内容
     *
     * @remarks
     *
     * @param page - 页面索引
     * @param pageSize - 页面审核数
     * @param isLoading - 界面是否等待
     * @param state - 状态
     */
    async function loadPage(page: number, pageSize: number, isLoading: boolean, state: TravelNote["state"]) {
        if (!loadedPages.current[state].has(page)) {
            if (isLoading) {
                setLoading(true);
            }

            if (!preLoadedPages.current[state].has(page)) {
                preLoadedPages.current[state].add(page);

                for (let index = maxReaderPage.current[state]; index < page - 1; index++) {
                    allItems.current[state].push(...new Array(5).fill({}));
                }

                await Promise.all(
                    [0, 1, 2, 3, 4]
                        .map((index) => switchItemIndex(page, index, pageSize))
                        .filter((switchIndex) => switchIndex < totalDataNumber[state])
                        .map((switchIndex) => {
                            if (switchIndex >= allItems.current[state].length || JSON.stringify(allItems.current[state][switchIndex]) === "{}") {
                                return getReviews(switchIndex, 1, state, trpc).then((value) => {
                                    allItems.current[state][switchIndex] = value[0];
                                });
                            }
                        }),
                );

                loadedPages.current[state].add(page);

                maxReaderPage.current[state] = maxReaderPage.current[state] > page ? maxReaderPage.current[state] : page;

                console.log(allItems.current);

                if (isLoading) {
                    changeDisplayItems(allItems.current[state]);

                    setLoading(false);
                }
            }
        }
    }

    /**
     * 转换审核索引
     *
     * @remarks
     *
     * @param page - 页面索引
     * @param indexOfPage - 在当前页面的索引
     * @param pageSize - 页面审核数
     */
    function switchItemIndex(page: number, indexOfPage: number, pageSize: number) {
        return indexOfPage + (page - 1) * pageSize;
    }

    /**
     * 切换页面
     *
     * @remarks
     *
     * @param page - 页面索引
     * @param pageSize - 页面审核数
     * @param state - 状态
     */
    async function togglePage(page: number, pageSize: number, state: TravelNote["state"]) {
        await loadPage(page, pageSize, true, state);

        changeDisplayItems(allItems.current[state]);

        if (page <= Math.floor((totalDataNumber[state] - 1) / pageSize)) {
            await loadPage(page + 1, pageSize, false, state);
        }

        // changeDisplayItems(allItems.current[state]);
    }

    return <MessageContext.Provider value={{ searchItem, delTravelNote, checkedNumber, addCheckSet, subCheckSet, displayItems, loading, firstPullData, togglePage, totalDataNumber, operateReview, operateBatchReview, togglePageState, pageState, setPageState, onSearch }}>{children}</MessageContext.Provider>;
}
