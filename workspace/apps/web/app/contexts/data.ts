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
        isChecked: false,
    }));

    return data;
}

export async function mockRemoteSearch(count: number, state: TravelNote["state"]): Promise<TravelNote[]> {
    await new Promise((resolve) => setTimeout(resolve, 5000));

    const data: TravelNote[] = Array.from({ length: count }).map((_, i) => ({
        id: getUuid(10),
        href: "https://ant.design",
        title: `远程搜索项 ${i}`,
        image: "",
        /* cspell:disable-next-line */
        content: "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
        state: state,
        isChecked: false,
    }));

    return data;
}
