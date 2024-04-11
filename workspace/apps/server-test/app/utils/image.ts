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

import type { ImageLoader } from "next/image";

import imageCompression from 'browser-image-compression';

/**
 * 资源加载
 * @see {@link https://nextjs.org/docs/app/api-reference/components/image#loader}
 */
export const assetsLoader: ImageLoader = function ({
    src,
    // width,
    // quality,
}) {
    return `/assets/${src}`;
};


/**
 * 图片压缩
 * @see {@link https://nextjs.org/docs/app/api-reference/components/image#loader}
 */
export async function compressImage(imageFile: File) {
    try {
        const blobFile = await imageCompression(imageFile, {
            maxSizeMB: 0.6,
            maxWidthOrHeight: 1080,
            useWebWorker: true,
        });

        return blobFile;
    } catch (err) {
        console.log(err);
        return Promise.reject(err);
    }
}
