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

import { AntdRegistry } from "@ant-design/nextjs-registry";

import ClientProvider from "@/contexts/client";

import manifest from "~/public/manifest.json";
import "./globals.css";

import type {
    //
    Metadata,
    Viewport,
} from "next";

const APP_TITLE_TEMPLATE = "%s - PWA";
const APP_MANIFEST_PATH = "/manifest.json";
const APP_FAVICON_PATH = "/favicon.ico";

// REF: https://ducanh-next-pwa.vercel.app/docs/next-pwa/getting-started#step-3-add-meta--and-link--tags-to-your-head-
export const metadata = {
    applicationName: manifest.name,
    title: {
        default: manifest.name,
        template: APP_TITLE_TEMPLATE,
    },
    description: manifest.description,
    manifest: APP_MANIFEST_PATH,
    icons: [
        //
        APP_FAVICON_PATH,
    ],
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: manifest.name,
        // startUpImage: [],
    },
    formatDetection: {
        telephone: false,
    },
    openGraph: {
        type: "website",
        siteName: manifest.name,
        title: {
            default: manifest.name,
            template: APP_TITLE_TEMPLATE,
        },
        description: manifest.description,
    },
    twitter: {
        card: "summary",
        title: {
            default: manifest.name,
            template: APP_TITLE_TEMPLATE,
        },
        description: manifest.description,
    },
} satisfies Metadata;

export const viewport = {
    themeColor: manifest.theme_color,
} satisfies Viewport;

// REF: https://nextjs.org/docs/app/api-reference/file-conventions/layout
export default function RootLayout({ children }: { children: React.ReactNode }) {
    // REF: https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns#using-context-providers
    return (
        <html lang="en">
            <head>
                <link
                    rel="shortcut icon"
                    type="image/x-icon"
                    href={APP_FAVICON_PATH}
                />
                <link
                    rel="manifest"
                    href={APP_MANIFEST_PATH}
                />
            </head>
            <body>
                <ClientProvider>
                    <AntdRegistry>{children}</AntdRegistry>
                </ClientProvider>
            </body>
        </html>
    );
}
