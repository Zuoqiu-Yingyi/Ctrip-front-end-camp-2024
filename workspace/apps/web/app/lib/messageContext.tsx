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
import { MutableRefObject, createContext, lazy, useRef, useState } from "react";
import { TravelNote } from "./definitions";
import { fetchItemData } from "@/app/lib/data";

export const MessageContext = createContext<{
    checkedNumber: number;
    totalDataNumber: number;
    loading: boolean;
    displayItems: TravelNote[];
    allItems: MutableRefObject<TravelNote[]>;
    toggleLoadingState: Function;
    filterItems: Function;
    addCheckNumber: Function;
    subCheckNumber: Function;
    firstPullData: Function;
    togglePage: Function;
}>({
    checkedNumber: 0,
    totalDataNumber: 0,
    loading: true,
    displayItems: [],
    allItems: { current: [] },
    toggleLoadingState: () => {},
    filterItems: () => {},
    addCheckNumber: () => {},
    subCheckNumber: () => {},
    firstPullData: () => {},
    togglePage: () => {},
});

export default function MessageContextProvider({ children }: { children: React.ReactElement<any, any> }): JSX.Element {
    const [checkedNumber, setCheckedNumber] = useState<number>(0);

    const [totalDataNumber, setTotalDataNumber] = useState<number>(0);

    const [loading, setLoading] = useState<boolean>(true);

    const allItems = useRef<TravelNote[]>([]);

    const maxReaderPage = useRef<number>(0);

    const preLoadedPages = useRef<Set<number>>(new Set());

    const loadedPages = useRef<Set<number>>(new Set());

    const [displayItems, setDisplayItems] = useState<TravelNote[]>(new Array(5).fill({}));

    function filterItems(items: TravelNote[], state: "success" | "waiting" | "fail") {
        setDisplayItems(items.filter((value) => JSON.stringify(value) === "{}" || value.state === state));
    }

    function addCheckNumber() {
        setCheckedNumber(checkedNumber + 1);
    }

    function subCheckNumber() {
        setCheckedNumber(checkedNumber - 1);
    }

    function toggleLoadingState() {
        setLoading(!loading);
    }

    async function firstPullData() {
        allItems.current = await fetchItemData();

        loadedPages.current.add(1);

        maxReaderPage.current += 1;

        filterItems(allItems.current, "waiting");

        setLoading(false);

        for (let index = 0; index < 5; index++) {
            allItems.current.push(...(await fetchItemData()));

            loadedPages.current.add(index + 2);

            maxReaderPage.current += 1;

            setTotalDataNumber(allItems.current.length);

            filterItems(allItems.current, "waiting");
        }

        setTotalDataNumber(1000);
    }

    async function loadPage(page: number, pageSize: number, isLoading: boolean) {
        console.log(loadedPages.current.has(page));

        if (!loadedPages.current.has(page)) {
            if (isLoading) {
                setLoading(true);
            }

            console.log(preLoadedPages.current.has(page));

            console.log(maxReaderPage.current);

            if (!preLoadedPages.current.has(page)) {
                preLoadedPages.current.add(page);

                let receivedData = await fetchItemData();

                for (let index = maxReaderPage.current; index < page; index++) {
                    allItems.current.push(...new Array(5).fill({}));
                }

                for (let index = 0; index < pageSize; index++) {
                    allItems.current[index + (page - 1) * pageSize] = receivedData[index]!;
                }

                loadedPages.current.add(page);

                maxReaderPage.current = maxReaderPage.current > page ? maxReaderPage.current : page;

                filterItems(allItems.current, "waiting");

                console.log(allItems.current);

                if (isLoading) {
                    setLoading(false);
                }
            }
        }
    }

    async function togglePage(page: number, pageSize: number) {
        console.log(page);

        console.log(pageSize);

        console.log(loadedPages.current);

        console.log(preLoadedPages.current);

        console.log(allItems.current);

        await loadPage(page, pageSize, true);

        if (page <= Math.floor((totalDataNumber - 1) / pageSize)) {
            await loadPage(page + 1, pageSize, false);
        }

        // preLoadedPages.current.add(page);

        // if (!loadedPages.current.has(page)) {

        //     setLoading(true);

        //     if (!preLoadedPages.current.has(page)) {

        //         let receivedData = await fetchItemData();

        //         for (let index = maxReaderPage.current; index < page; index++) {
        //             allItems.current.push(...new Array(5).fill({}));
        //         }

        //         for (let index = 0; index < pageSize; index++) {
        //             allItems.current[index + (page - 1) * pageSize] = receivedData[index]!;
        //         }

        //         setDisplayItems(allItems.current);

        //         console.log(allItems.current);

        //         loadedPages.current.add(page);

        //         maxReaderPage.current = maxReaderPage.current > page ? maxReaderPage.current : page;

        //         setLoading(false);
        //     }

        // }
    }

    return <MessageContext.Provider value={{ checkedNumber, addCheckNumber, subCheckNumber, displayItems, allItems, filterItems: filterItems, loading, toggleLoadingState, firstPullData, togglePage, totalDataNumber }}>{children}</MessageContext.Provider>;
}
