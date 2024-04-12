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
import { TravelNote } from "@/types/definitions";
import { getReviews } from "@/utils/review";

export async function fetchCardData() {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
        passNumber: 20,
        failNumber: 10,
        waitingNumber: 40,
    };
}

function getUuid(randomLength: number) {
    return Number(Math.random().toString().substr(2, randomLength) + Date.now());
}

export async function fetchItemData(count: number, state: TravelNote["state"]): Promise<TravelNote[]> {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const data: TravelNote[] = Array.from({ length: count }).map((_, i) => ({
        id: getUuid(10),
        href: "https://ant.design",
        title: `标题 ${i}`,
        image: "",
        /* cspell:disable-next-line */
        content: "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
        state: state,
        isChecked: false
    }));

    return data;
}

export async function mockRomoteSearch(count: number, state: TravelNote["state"]): Promise<TravelNote[]> {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const data: TravelNote[] = Array.from({ length: count }).map((_, i) => ({
        id: getUuid(10),
        href: "https://ant.design",
        title: `远程搜索项 ${i}`,
        image: "",
        /* cspell:disable-next-line */
        content: "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
        state: state,
        isChecked: false
    }));

    return data;
}
