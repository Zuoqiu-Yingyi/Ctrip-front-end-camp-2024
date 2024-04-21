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
    useRef,
    useState,
} from "react";
import { useTranslation } from "react-i18next";
import {
    //
    Modal,
    Swiper,
    TextArea,
    Divider,
    Input,
    List,
    Popover,
} from "antd-mobile";
import {
    DeleteOutline,
    EnvironmentOutline,
    //
    FileOutline,
    LocationFill,
    MoreOutline,
    RedoOutline,
} from "antd-mobile-icons";

import { SubmitInfoContext } from "@/contexts/mobileEditContext";

import styles from "./EditTextTab.module.scss";
import { useStore } from "@/contexts/store";
import CoordinateInfoPopup from "./CoordinateInfoPopup";

const contentTemplates: string[] = [
    `费用：
路线: 
    Day 1：…
    Day 2：…
住宿：
吃饭：`,

    `出发前带什么：
需要提前预约的：
行程：（景点，路程/交通方式，吃饭，住宿，网红景点打卡位置）
此次旅游小结`,
    `酒店：
交通：
行程：（具体景点，吃饭）
避雷点：`,

    `人均消费：
行程（具体景点，去了哪些店，消费了什么，什么值得买，什么不建议）
吃饭：
住宿：
交通：`,
];

const titleTemplates: string[] = [
    //
    "** 出发！",
    "** *天*夜 人均 **",
    "** 去哪玩？",
    "** 旅游攻略",
    "** 超全避雷攻略",
];

export default function EditTextTab(): JSX.Element {
    const { t } = useTranslation();
    const { mode } = useStore.getState();

    const {
        //
        title,
        content,
        coordinate,
        updateTitle,
        updateContent,
        updateCoordinate,
        deleteCoordinate,
    } = useContext(SubmitInfoContext);

    const [templateModalVisible, setTemplateModalVisible] = useState(false);
    const [coordinateInfoPopupVisible, setCoordinateInfoPopupVisible] = useState(false);

    const insertedText = useRef<string>(contentTemplates[0] as string);

    // const rows = Math.floor((screen.height - 42 - 45 - 56 - 32 - 19 - 30) / 25.5);

    return (
        <div className={styles.layout}>
            <List.Item
                className={styles.title}
                arrow={
                    <Popover.Menu
                        actions={titleTemplates.map((item) => ({
                            text: item,
                            onClick: () => {
                                updateTitle(item);
                            },
                        }))}
                        mode={mode}
                        trigger="click"
                        placement="bottom-end"
                    >
                        <FileOutline
                            className={styles.title_template}
                            aria-label={t("aria.draft.title.template")}
                        />
                    </Popover.Menu>
                }
            >
                <Input
                    placeholder={t("input.draft.title.placeholder")}
                    value={title}
                    onChange={(val) => {
                        updateTitle(val);
                    }}
                />
            </List.Item>

            <Divider className={styles.divider} />

            <List.Item
                className={styles.toolbar}
                arrow={
                    <Popover.Menu
                        actions={[
                            {
                                icon: <RedoOutline />,
                                text: t("actions.draft.content.clear.text"),
                                onClick: () => {
                                    updateContent("");
                                },
                            },
                            {
                                icon: <FileOutline />,
                                text: t("actions.draft.content.template.text"),
                                onClick: () => {
                                    setTemplateModalVisible(true);
                                },
                            },
                            {
                                icon: <LocationFill />,
                                text: t("actions.draft.coordinate.update.text"),
                                onClick: async () => {
                                    await updateCoordinate();
                                },
                            },
                            {
                                icon: <EnvironmentOutline />,
                                text: t("actions.draft.coordinate.view.text"),
                                disabled: !coordinate,
                                onClick: async () => {
                                    setCoordinateInfoPopupVisible(true);
                                },
                            },
                            {
                                icon: <DeleteOutline />,
                                text: t("actions.draft.coordinate.delete.text"),
                                disabled: !coordinate,
                                onClick: () => {
                                    deleteCoordinate();
                                },
                            },
                        ]}
                        mode={mode}
                        trigger="click"
                        placement="bottom-end"
                    >
                        <MoreOutline
                            className={styles.toolbar_menu}
                            aria-label={t("aria.draft.toolbar.menu")}
                        />
                    </Popover.Menu>
                }
            ></List.Item>

            <TextArea
                className={styles.content}
                value={content}
                placeholder={t("input.draft.content.placeholder")}
                // autoSize={true}
                showCount={true}
                onChange={(val) => {
                    updateContent(val);
                }}
            />

            <Modal
                closeOnMaskClick={true}
                title={t("actions.draft.content.template.text")}
                showCloseButton={true}
                visible={templateModalVisible}
                content={
                    <Swiper
                        onIndexChange={(index: number) => {
                            insertedText.current = contentTemplates[index] as string;
                        }}
                    >
                        {contentTemplates.map((value, index) => (
                            <Swiper.Item key={`text_${index}`}>
                                <TextArea
                                    value={value}
                                    autoSize
                                    readOnly
                                />
                            </Swiper.Item>
                        ))}
                    </Swiper>
                }
                actions={[
                    {
                        key: "insert",
                        text: t("actions.template.apply.text"),
                        primary: true,
                        onClick: () => {
                            updateContent(insertedText.current);
                            setTemplateModalVisible(false);
                        },
                    },
                ]}
                onClose={() => {
                    setTemplateModalVisible(false);
                }}
            />

            <CoordinateInfoPopup
                coordinate={coordinate}
                visible={coordinateInfoPopupVisible}
                onClose={() => setCoordinateInfoPopupVisible(false)}
            />
        </div>
    );
}
