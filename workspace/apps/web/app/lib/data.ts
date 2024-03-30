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
import { TravelNote } from "../lib/definitions";

export async function fetchCardData() {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    return {
        passNumber: 20,
        failNumber: 10,
        waitingNumber: 40,
    };
}

export async function fetchItemData() {
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data: TravelNote[] = Array.from({ length: 23 }).map((_, i) => ({
        href: "https://ant.design",
        title: `用户 ${i}`,
        avatar: `https://api.dicebear.com/7.x/miniavs/svg?seed=${i}`,
        description: '游记标题',
        content: "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
        state: i % 2 == 0 ? "waiting" : "fail",
    }));

    return data;
}
