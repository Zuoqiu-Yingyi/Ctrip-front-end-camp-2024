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
import { Button, Flex, Typography } from "antd";
import { HighlightFilled, UpOutlined } from "@ant-design/icons";
import { ImageUploader, Toast, Popup, ImageUploadItem } from "antd-mobile";
import DrawPanel from "./draw-canvas";
import { useContext, useState } from "react";
import React from "react";
import { SubmitInfoContext } from "@/context/mobileEditContext";
import { useTranslation } from "react-i18next";

const { Title, Text } = Typography;

export default function EditAlbumTab(): JSX.Element {

    const { t, i18n } = useTranslation();

    const maxCount = 3;

    const [popupVisible, setPopupVisible] = useState(false);

    const { fileList, setFileList, addImage, delImage } = useContext(SubmitInfoContext);

    return (
        <Flex
            vertical={true}
            justify="space-between"
            style={{ flex: 1 }}
            className="p-10"
        >
            <ImageUploader
                columns={3}
                value={fileList}
                onChange={setFileList}
                upload={(file) => {return addImage(file)}}
                onDelete={(item: ImageUploadItem) => {delImage(item)}}
                multiple
                maxCount={3}
                showUpload={fileList.length < maxCount}
                onCountExceed={(exceed) => {
                    Toast.show(`最多选择 ${maxCount} 张图片，你多选了 ${exceed} 张`);
                }}
            />

            <Button
                type="dashed"
                shape="round"
                onClick={() => {
                    setPopupVisible(true);
                }}
                style={{
                    height: 80,
                }}
            >
                <Flex
                    justify="space-between"
                    className="px-3"
                >
                    <Flex vertical={true}>
                        <Flex align="center">
                            <HighlightFilled className="mr-2" />
                            <Title
                                level={5}
                                className="m-0"
                            >
                                {t("graffiti")}
                            </Title>
                        </Flex>

                        <Text>{t("graffiti-tip")}</Text>
                    </Flex>
                    <UpOutlined />
                </Flex>
            </Button>

            <Popup
                visible={popupVisible}
                destroyOnClose={true}
                onMaskClick={() => {
                    setPopupVisible(false);
                }}
                bodyStyle={{
                    borderTopLeftRadius: "16px",
                    borderTopRightRadius: "16px",
                    minHeight: "80vh",
                }}
            >
                <DrawPanel
                    back={() => {
                        setPopupVisible(false);
                    }}
                />
            </Popup>
        </Flex>
    );
}
