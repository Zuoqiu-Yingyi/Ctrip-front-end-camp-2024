/**
 * Copyright (C) 2024 Zuoqiu Yingyi
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

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

import { assetsLoader } from "@/utils/image";

export interface IAsset {
    uid: string;
    filename: string;
    mimetype: string;
    fieldname: string;
}

export default function Login() {
    const [files, setFiles] = useState<FileList | null>(null);
    const [assets, setAssets] = useState<IAsset[]>([]);

    async function upload() {
        const formData = new FormData();
        if (files) {
            for (let i = 0; i < files.length; ++i) {
                formData.append("file[]", files[i]);
            }
            const response = await fetch("/assets/upload", {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const body = await response.json();
                console.debug(body);
                if (body.code === 0) {
                    setAssets(body.data.successes);
                }
            }
            // setFiles(null);
        }
    }

    return (
        <>
            <h1>Assets</h1>
            <div>
                Back to <Link href="/test">/test</Link>
            </div>
            <ul>
                <li>
                    <input
                        type="file"
                        accept="image/*"
                        multiple={true}
                        onChange={(event) => setFiles(event.target.files)}
                    />
                </li>
                <li>
                    <button onClick={upload}>Upload</button>
                </li>
                {assets.map((asset) => (
                    <li key={asset.uid}>
                        
                        <Image
                            src={asset.uid}
                            loader={assetsLoader}
                            alt="Asset"
                            title={asset.filename}
                            width={256}
                        />

                    </li>
                ))}
                
            </ul>
        </>
    );
}
