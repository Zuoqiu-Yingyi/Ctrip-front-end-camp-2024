// Copyright 2024 wu
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
import { MutableRefObject, createContext, useRef, useState } from "react";
import { TravelNote, ManageData, ManagePage, ManagePageNumber } from "./definitions";
import { fetchItemData, mockRomoteSearch } from "@/app/lib/data";
import { getReviewCount } from "../utils/review";

export const MessageContext = createContext<{
    totalDataNumber: ManagePageNumber;
    loading: boolean;
    onSearch: boolean;
    // onSearch: ;
    checkedNumber: number;
    displayItems: TravelNote[];
    pageState: TravelNote["state"];
    // allItems: MutableRefObject<TravelNote[]>;
    toggleLoadingState: Function;
    filterItems: Function;
    addCheckSet: Function;
    subCheckSet: Function;
    firstPullData: Function;
    togglePage: Function;
    operateSingleItem: Function;
    operateBatchItem: Function;
    togglePageState: Function;
    setPageState: Function;
    searchItem: Function
}>({
    totalDataNumber: { success: 0, waiting: 0, fail: 0 },
    loading: true,
    checkedNumber: 0,
    displayItems: [],
    pageState: "waiting",
    // allItems: { current: [] },
    onSearch: false,
    toggleLoadingState: () => {},
    filterItems: () => {},
    addCheckSet: () => {},
    subCheckSet: () => {},
    firstPullData: () => {},
    togglePage: () => {},
    operateSingleItem: () => {},
    operateBatchItem: () => {},
    togglePageState: () => {},
    setPageState: () => {},
    searchItem: () => {},
});

export default function MessageContextProvider({ children }: { children: React.ReactElement<any, any> }): JSX.Element {
    const checkedSet = useRef<Set<number>>(new Set());

    const [checkedNumber, setCheckedNumber] = useState<number>(0);

    // 当前界面状态
    const [pageState, setPageState] = useState<TravelNote["state"]>("waiting");

    // 已加载全部数据
    // const allItems = useRef<TravelNote[]>([]);
    const allItems = useRef<ManageData>({ success: [], waiting: [], fail: [] });

    // 最大渲染界面
    // const maxReaderPage = useRef<number>(0);
    const maxReaderPage = useRef<ManagePageNumber>({ success: 0, waiting: 0, fail: 0 });

    // 预加载界面
    // const preLoadedPages = useRef<Set<number>>(new Set());
    const preLoadedPages = useRef<ManagePage>({ success: new Set(), waiting: new Set(), fail: new Set() });

    // 已加载界面
    // const loadedPages = useRef<Set<number>>(new Set());
    const loadedPages = useRef<ManagePage>({ success: new Set(), waiting: new Set(), fail: new Set() });

    // 数据总数
    // const [totalDataNumber, setTotalDataNumber] = useState<number>(0);
    const [totalDataNumber, setTotalDataNumber] = useState<ManagePageNumber>({ success: 0, waiting: 0, fail: 0 });

    // 界面呈现数据
    const [displayItems, setDisplayItems] = useState<TravelNote[]>(new Array(5).fill({}));

    // 界面是否等待
    const [loading, setLoading] = useState<boolean>(true);

    // 是否正在搜索
    const [onSearch, setOnSearch] = useState<boolean>(false);

    const searchNumber = useRef<number>(0);

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

        // onSearch.current = true;
        setOnSearch(true);

        searchNumber.current += 1;

        let record = searchNumber.current;

        let loadedSearchItems = allItems.current[pageState].filter((item) => item[field].includes(searchWord))

        changeDisplayItems(
            loadedSearchItems
        )


        let allSearchItems = [...loadedSearchItems, ...await mockRomoteSearch(3, pageState)];
        

        if (record === searchNumber.current) {

            changeDisplayItems(
                allSearchItems
            );

            setOnSearch(false);
        }

        // onSearch.current = false;
    }

    function filterItems(items: TravelNote[], state: "success" | "waiting" | "fail") {
        setDisplayItems(items.filter((value) => JSON.stringify(value) === "{}" || value.state === state));
    }

    function changeDisplayItems(items: TravelNote[]) {
        setDisplayItems(
            items.map((item) => ({
                ...item,
                isChecked: checkedSet.current.has(item.id),
            })),
        );
    }

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

    function toggleLoadingState() {
        setLoading(!loading);
    }

    async function mendLoadedPages(redNumber: number, state: TravelNote["state"]) {
        for (let key of loadedPages.current[state].keys()) {
            console.log(key);

            for (let index = 0; index < 5; index++) {
                let itemIndex = switchItemIndex(key, index, 5);

                if (itemIndex < totalDataNumber[state] - redNumber && JSON.stringify(allItems.current[state][itemIndex]) === "{}") {
                    allItems.current[state][itemIndex] = (await fetchItemData(1, state))[0];
                }
            }
        }
    }

    /**
     * 前端单个审核状态改变
     *
     * @remarks
     *
     * @param id - 审核id
     */
    async function operateSingleItem(id: number, state: TravelNote["state"]) {
        // let filterIndex = 0;

        allItems.current[state] = allItems.current[state].filter((item) => item.id !== id);

        // setTotalDataNumber(totalDataNumber[state] - 1);
        setTotalDataNumber({
            ...totalDataNumber,
            [state]: totalDataNumber[state] - 1,
        });

        setDisplayItems(allItems.current[state]);

        mendLoadedPages(1, state);

        // for (let index = filterIndex; index + 1 <= totalDataNumber - 1 && index < allItems.current.length; index++) {
        //     if (JSON.stringify(allItems.current[index]) === "{}") {
        //         allItems.current[index] = (await fetchItemData(1))[0];
        //     }
        // }
    }

    /**
     * 前端批量审核状态改变
     *
     */
    async function operateBatchItem(state: TravelNote["state"]) {
        allItems.current[state] = allItems.current[state].filter((item) => !checkedSet.current.has(item.id));

        // setTotalDataNumber(totalDataNumber[state] - checkedNumber);
        setTotalDataNumber({
            ...totalDataNumber,
            [state]: totalDataNumber[state] - checkedNumber,
        });

        mendLoadedPages(checkedNumber, state);

        setDisplayItems(allItems.current[state]);

        checkedSet.current.clear();

        setCheckedNumber(0);
    }

    /**
     * 首次获取数据，获取第一页页面，渲染界面，并异步加载后五页的内容
     */
    async function firstPullData(state: TravelNote["state"]) {
        // 获取待审核总数
        // let allWaitingCount = (await getReviewCount()) as number;
        let allWaitingCount = 5 as number;

        if (allWaitingCount > 0) {
            setLoading(true);

            allItems.current[state] = await fetchItemData(5, state);

            console.log(loadedPages.current[state]);

            loadedPages.current[state].add(1);

            maxReaderPage.current[state] += 1;

            changeDisplayItems(allItems.current[state]);

            setLoading(false);

            for (let index = 0; index < Math.ceil(allWaitingCount / 5) - 1 && index < 5; index++) {
                allItems.current[state].push(...(await fetchItemData(5, state)));

                loadedPages.current[state].add(index + 2);

                maxReaderPage.current[state] += 1;

                // setTotalDataNumber(allItems.current[state].length);
                setTotalDataNumber({
                    ...totalDataNumber,
                    [state]: allItems.current[state].length,
                });

                // changeDisplayItems(allItems.current[state]);
            }
        }

        // setTotalDataNumber(allWaitingCount);
        setTotalDataNumber({
            ...totalDataNumber,
            [state]: allWaitingCount,
        });

        console.log(allItems.current);
    }

    /**
     * 加载页面内容
     *
     * @remarks
     *
     * @param page - 页面索引
     * @param pageSize - 页面审核数
     * @param isLoading - 界面是否等待
     */
    async function loadPage(page: number, pageSize: number, isLoading: boolean, state: TravelNote["state"]) {
        if (!loadedPages.current[state].has(page)) {
            if (isLoading) {
                setLoading(true);
            }

            if (!preLoadedPages.current[state].has(page)) {
                preLoadedPages.current[state].add(page);

                // let receivedData = await fetchItemData(5);

                for (let index = maxReaderPage.current[state]; index < page; index++) {
                    allItems.current[state].push(...new Array(5).fill({}));
                }

                for (let index = 0; index < pageSize; index++) {
                    if (JSON.stringify(allItems.current[state][switchItemIndex(page, index, pageSize)]) === "{}") {
                        allItems.current[state][switchItemIndex(page, index, pageSize)] = (await fetchItemData(1, state))[0];
                    }
                }

                loadedPages.current[state].add(page);

                maxReaderPage.current[state] = maxReaderPage.current[state] > page ? maxReaderPage.current[state] : page;

                // changeDisplayItems(allItems.current[state]);

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

        if (page <= Math.floor((totalDataNumber[state] - 1) / pageSize)) {
            await loadPage(page + 1, pageSize, false, state);
        }

        changeDisplayItems(allItems.current[state]);
    }

    return <MessageContext.Provider value={{ searchItem, checkedNumber, addCheckSet, subCheckSet, displayItems, filterItems: filterItems, loading, toggleLoadingState, firstPullData, togglePage, totalDataNumber, operateSingleItem, operateBatchItem, togglePageState, pageState, setPageState, onSearch }}>{children}</MessageContext.Provider>;
}
