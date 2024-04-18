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
    Tag,
    Space,
    Input,
} from "antd-mobile";
import {
    //
    FileOutline,
    RedoOutline,
} from "antd-mobile-icons";
import { FloatButton } from "antd";
import { SubmitInfoContext } from "@/contexts/mobileEditContext";

const contentTemplates: string[] = [
    `费用：
路线: Day1…
     Day2…
           
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

const titleTemplates: string[] = ["** 出发！", "*** *天*夜 人均 **", "** 去哪玩？", "** 旅游攻略", "** 超全避雷攻略"];

export default function EditTextTab(): JSX.Element {
    const { t } = useTranslation();

    const {
        //
        title,
        content,
        updateTitle,
        updateContent,
    } = useContext(SubmitInfoContext);

    const [visible, setVisible] = useState(false);

    const insertedText = useRef<string>(contentTemplates[0] as string);

    // const rows = Math.floor((screen.height - 42 - 45 - 56 - 32 - 19 - 30) / 25.5);

    return (
        <div style={{ flex: 1 }}>
            <Input
                placeholder={t("input.draft.title.placeholder")}
                value={title}
                onChange={(val) => {
                    updateTitle(val);
                }}
                style={{
                    padding: "0.5em 1em",
                    boxSizing: "border-box",
                }}
            />

            <Space
                className="px-2"
                style={{
                    overflowX: "auto",
                    width: "100%",
                }}
            >
                {titleTemplates.map((item, index) => (
                    <Tag
                        key={`tag_${index}`}
                        round
                        style={{
                            fontSize: 13,
                            marginInline: 5,
                            paddingBlock: 4,
                            paddingInline: 8,
                        }}
                        onClick={() => {
                            updateTitle(item);
                        }}
                    >
                        {item}
                    </Tag>
                ))}
            </Space>

            <Divider
                style={{
                    borderStyle: "dashed",
                    margin: 0,
                }}
            />

            <TextArea
                value={content}
                placeholder={t("input.draft.content.placeholder")}
                autoSize={true}
                showCount={true}
                style={{
                    padding: "1em",
                    boxSizing: "border-box",
                }}
                onChange={(val) => {
                    updateContent(val);
                }}
            />

            {/* TODO: 改进控件栏 */}
            <FloatButton.Group
                shape="square"
                style={{ top: "180px", height: "0px" }}
            >
                <FloatButton
                    icon={<FileOutline />}
                    description="大纲"
                    onClick={() => {
                        setVisible(true);
                    }}
                />
                <FloatButton
                    icon={<RedoOutline />}
                    description="清空"
                    onClick={() => {
                        updateContent("");
                    }}
                />
                {/* TODO: 增加更新当前定位按钮 */}
            </FloatButton.Group>

            <Modal
                closeOnMaskClick={true}
                title="大纲"
                showCloseButton={true}
                visible={visible}
                content={
                    <Swiper
                        onIndexChange={(index: number) => {
                            insertedText.current = contentTemplates[index] as string;
                        }}
                    >
                        {contentTemplates.map((value, index) => (
                            <Swiper.Item key={`text_${index}`}>
                                <TextArea
                                    placeholder="请输入内容"
                                    value={value}
                                    rows={10}
                                    readOnly
                                />
                            </Swiper.Item>
                        ))}
                    </Swiper>
                }
                actions={[
                    {
                        key: "insert",
                        text: "插入",
                        primary: true,
                        onClick: () => {
                            updateContent(insertedText.current);
                            setVisible(false);
                        },
                    },
                ]}
                onClose={() => {
                    setVisible(false);
                }}
            />
        </div>
    );
}
