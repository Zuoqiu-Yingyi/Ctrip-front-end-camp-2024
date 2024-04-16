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

"use client";

import {
    //
    useContext,
    useEffect,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    //
    useRouter,
    useSearchParams,
} from "next/navigation";

import {
    //
    NavBar,
    Tabs,
    Space,
    Button,
    SpinLoading,
} from "antd-mobile";
import {
    //
    CameraOutline,
    FillinOutline,
    PicturesOutline,
} from "antd-mobile-icons";

import { SubmitInfoContext } from "@/contexts/mobileEditContext";
import { ClientContext } from "@/contexts/client";

import EditTab from "@/ui/mobile-edit-tab";
import {
    //
    MobileContent,
    MobileFooter,
    MobileHeader,
} from "@/mobile/components/MobileLayout";

export default function EditPage(): JSX.Element {
    const { t } = useTranslation();
    const { trpc } = useContext(ClientContext);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [tab, setTab] = useState<"text" | "album" | "camera">("text");
    const [onPress, setOnPress] = useState(false);
    const {
        //
        saved,
        setId,
        uploadTravelNote,
    } = useContext(SubmitInfoContext);

    useEffect(() => {
        const id = searchParams.get("id");
        if (id) {
            setId(parseInt(id));
        } else {
            setId(null);
        }
    }, [searchParams]);

    async function onBack() {
        if (!saved) {
            // TODO: 当前更改未保存, 需二次确认
        }
        router.back();
    }

    return (
        <>
            <MobileHeader>
                <NavBar
                    backArrow={true}
                    right={
                        <Space>
                            {onPress && <SpinLoading style={{ "--size": "20px" }} />}
                            <Button
                                block
                                size="mini"
                                shape="rounded"
                                fill="outline"
                                disabled={onPress}
                                style={{
                                    marginLeft: "auto",
                                    width: 90,
                                }}
                                onClick={async () => {
                                    setOnPress(true);
                                    await uploadTravelNote("draft");
                                    setOnPress(false);
                                }}
                            >
                                {t("edit.draft.save")}
                            </Button>
                            <Button
                                block
                                size="mini"
                                shape="rounded"
                                color="primary"
                                disabled={onPress}
                                style={{
                                    marginLeft: "auto",
                                    width: 60,
                                }}
                                onClick={async () => {
                                    setOnPress(true);
                                    await uploadTravelNote("submit");
                                    setOnPress(false);
                                }}
                            >
                                {t("edit.draft.publish")}
                            </Button>
                        </Space>
                    }
                    onBack={onBack}
                />
            </MobileHeader>

            <MobileContent>
                <EditTab tabKey={tab} />
            </MobileContent>

            <MobileFooter>
                <Tabs
                    onChange={(key: string) => {
                        setTab(key as "text" | "album" | "camera");
                    }}
                >
                    <Tabs.Tab
                        title={
                            <Space align="baseline">
                                <FillinOutline />
                                {t("text")}
                            </Space>
                        }
                        key="text"
                    />
                    <Tabs.Tab
                        title={
                            <Space align="baseline">
                                <PicturesOutline />
                                {t("album")}
                            </Space>
                        }
                        key="album"
                    />
                    <Tabs.Tab
                        title={
                            <Space align="baseline">
                                <CameraOutline />
                                {t("camera")}
                            </Space>
                        }
                        key="camera"
                    />
                </Tabs>
            </MobileFooter>
        </>
    );
}
