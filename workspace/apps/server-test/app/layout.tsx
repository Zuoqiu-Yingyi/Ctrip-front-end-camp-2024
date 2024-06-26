import "./globals.css";
import type { Metadata } from "next";
import { AntdRegistry } from "@ant-design/nextjs-registry";

export const metadata: Metadata = {
    title: "Create Turborepo",
    description: "Generated by create turbo",
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
    return (
        <html lang="en">
            <body>
                <AntdRegistry>{children}</AntdRegistry>
            </body>
        </html>
    );
}
