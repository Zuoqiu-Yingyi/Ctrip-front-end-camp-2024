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

import {
    //
    useContext,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    //
    Button,
    Flex,
    Typography,
} from "antd";
import {
    //
    ImageUploader,
    Toast,
    Popup,
    ImageUploadItem,
    Divider,
} from "antd-mobile";
import {
    //
    HighlightFilled,
} from "@ant-design/icons";

import DrawPanel from "./draw-canvas";
import { SubmitInfoContext } from "@/contexts/mobileEditContext";

export default function EditAlbumTab(): JSX.Element {
    const { t } = useTranslation();

    const maxCount = 9;

    const [popupVisible, setPopupVisible] = useState(false);

    const {
        //
        fileList,
        setFileList,
        addImage,
        delImage,
    } = useContext(SubmitInfoContext);

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
                upload={async (file) => {
                    return addImage(file);
                }}
                onDelete={(item: ImageUploadItem) => {
                    delImage(item);
                }}
                multiple
                maxCount={maxCount}
                showUpload={fileList.length < maxCount}
                onCountExceed={(exceed) => {
                    Toast.show(`最多选择 ${maxCount} 张图片，你多选了 ${exceed} 张`);
                }}
            />

            <Divider />

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
                            <Typography.Title
                                level={5}
                                className="m-0"
                            >
                                {t("graffiti")}
                            </Typography.Title>
                        </Flex>

                        <Typography.Text>{t("graffiti-tip")}</Typography.Text>
                    </Flex>
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
