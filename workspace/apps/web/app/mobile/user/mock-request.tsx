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

import { sleep } from "antd-mobile/es/utils/sleep";
import React, { createContext, useState, Fragment, useEffect } from "react";
import { assetsLoader } from "../../utils/image";
import trpc from "../../utils/trpc";

const user_id = 1111111

const thisPublish = await trpc.publish.list.query({ uids: undefined });
const draftNumber = await trpc.draft.count.query({ author_id: user_id });
const Drafts = await trpc.draft.paging.query({ skip: 0, take: draftNumber.data.count });

try {
    trpc.draft.paging.query({ skip: 0, take: draftNumber });
} catch (error) {
    alert("Error");
}

if (Drafts.code !== 0) {
    alert("Error");
}
let currentIndex = 0;
// const assetsThis = thisPublish.data?.publishs[0]!.assets;
export async function mockRequest() {
    const endIndex = currentIndex + 5;
    const result = Drafts?.data?.drafts.slice(currentIndex, endIndex);
    // if (result) {
        
    //     const secondPart = (result || []).filter((item) => Object.keys(item)[0] !== "[x: string]");
    //     // const secondPart = result.filter((item) => Object.keys(item)[0] !== "[x: string]");
    // }
    currentIndex = endIndex >= Drafts?.data.drafts.length ? 0 : endIndex;
    await sleep(2000); // 等待2秒钟
    return result;
}
